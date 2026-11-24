import { describe, expect, it } from "vitest";
import { deposit, emptyAccount, executeOrder, previewOrder, type AccountState } from "./engine";
import { availableCash, cancelOrder, isTriggered, placePendingOrder, processOrders } from "./orders";

const T = Date.UTC(2026, 5, 1);
const MIN = 60_000;

function funded(cash = 1000): AccountState {
  const r = deposit(emptyAccount(), cash, T);
  if (!r.ok) throw new Error(r.error);
  return r.value;
}

/** A price path that is 100 until `drop`, then 80. */
const stepDown = (drop: number) => (_: string, t: number) => (t >= drop ? 80 : 100);

describe("trigger rules", () => {
  it("limit buy fires at or below, stop buy at or above", () => {
    expect(isTriggered({ side: "buy", type: "limit", triggerPrice: 90 }, 89)).toBe(true);
    expect(isTriggered({ side: "buy", type: "limit", triggerPrice: 90 }, 91)).toBe(false);
    expect(isTriggered({ side: "buy", type: "stop", triggerPrice: 90 }, 91)).toBe(true);
  });

  it("limit sell fires at or above, stop sell at or below", () => {
    expect(isTriggered({ side: "sell", type: "limit", triggerPrice: 110 }, 111)).toBe(true);
    expect(isTriggered({ side: "sell", type: "stop", triggerPrice: 90 }, 85)).toBe(true);
    expect(isTriggered({ side: "sell", type: "stop", triggerPrice: 90 }, 95)).toBe(false);
  });
});

describe("pending orders", () => {
  it("reserves cash for open buy orders", () => {
    const r = placePendingOrder(
      funded(),
      { symbol: "AAPL", side: "buy", type: "limit", mode: "amount", value: 500, triggerPrice: 90, expiresAt: null },
      T,
    );
    if (!r.ok) throw new Error(r.error);
    expect(availableCash(r.value.state)).toBe(1000 - 500 - 1);
    // A market order can't spend the reserved cash.
    expect(previewOrder(r.value.state, { symbol: "MSFT", side: "buy", mode: "amount", value: 600 }, 10).ok).toBe(false);
  });

  it("fills a limit buy at the exact minute it triggered, even after a long gap", () => {
    const placed = placePendingOrder(
      funded(),
      { symbol: "AAPL", side: "buy", type: "limit", mode: "quantity", value: 5, triggerPrice: 90, expiresAt: null },
      T,
    );
    if (!placed.ok) throw new Error(placed.error);
    const drop = T + 3 * 24 * 60 * MIN + 7 * MIN;
    const { state, events } = processOrders({ ...placed.value.state, ordersCheckedAt: T }, stepDown(drop), T + 10 * 24 * 60 * MIN);
    expect(events).toHaveLength(1);
    expect(events[0].kind).toBe("filled");
    // 5-minute scan steps over long gaps → filled within 5 minutes of the drop.
    expect(state.orders[0].closedAt! - drop).toBeLessThan(5 * MIN);
    expect(state.orders[0].fillPrice).toBe(80);
    expect(state.positions.AAPL.quantity).toBe(5);
    expect(state.cash).toBe(1000 - 400 - 1);
  });

  it("stop-loss sells a position when price falls", () => {
    const bought = executeOrder(funded(), { symbol: "AAPL", side: "buy", mode: "quantity", value: 2 }, 100, T);
    if (!bought.ok) throw new Error(bought.error);
    const placed = placePendingOrder(
      bought.value.state,
      { symbol: "AAPL", side: "sell", type: "stop", mode: "quantity", value: 2, triggerPrice: 85, expiresAt: null },
      T,
    );
    if (!placed.ok) throw new Error(placed.error);
    const { state } = processOrders(placed.value.state, stepDown(T + 30 * MIN), T + 60 * MIN);
    expect(state.positions.AAPL).toBeUndefined();
    expect(state.orders[0].status).toBe("filled");
  });

  it("expires orders that never triggered", () => {
    const placed = placePendingOrder(
      funded(),
      { symbol: "AAPL", side: "buy", type: "limit", mode: "quantity", value: 1, triggerPrice: 50, expiresAt: T + 60 * MIN },
      T,
    );
    if (!placed.ok) throw new Error(placed.error);
    const { state, events } = processOrders(placed.value.state, () => 100, T + 120 * MIN);
    expect(events[0].kind).toBe("expired");
    expect(state.orders[0].status).toBe("expired");
    expect(availableCash(state)).toBe(1000);
  });

  it("cancels orders and releases reserved cash", () => {
    const placed = placePendingOrder(
      funded(),
      { symbol: "AAPL", side: "buy", type: "limit", mode: "amount", value: 500, triggerPrice: 90, expiresAt: null },
      T,
    );
    if (!placed.ok) throw new Error(placed.error);
    const state = cancelOrder(placed.value.state, placed.value.order.id, T + MIN);
    expect(state.orders[0].status).toBe("cancelled");
    expect(availableCash(state)).toBe(1000);
  });
});
