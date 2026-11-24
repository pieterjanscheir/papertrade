/**
 * Test tasks for user-testing sessions with traders.
 *
 * A task with `check` completes itself as soon as the tester's account shows it was
 * done (e.g. a matching buy appears after the task started). Tasks without a check
 * are ended by the facilitator or tester with "Done" or "Give up".
 *
 * Teams: add tasks that match YOUR feature here, or in the /testing page.
 */

import type { AccountState } from "@/lib/trading/engine";

export interface TestTask {
  id: string;
  title: string;
  /** What success looks like, for the facilitator. */
  success: string;
  /** Auto-complete check; `since` is the market time when the task started. */
  check?: (account: AccountState, since: number) => boolean;
}

export const DEFAULT_TASKS: TestTask[] = [
  {
    id: "buy-etf",
    title: "Buy about €200 of the FTSE All-World ETF",
    success: "A buy of VWCE between €100 and €300",
    check: (a, since) => a.transactions.some((t) => t.type === "buy" && t.symbol === "VWCE" && t.time >= since && t.amount >= 100 && t.amount <= 300),
  },
  {
    id: "stop-loss",
    title: "Protect your NVIDIA position with a stop-loss about 10% below today's price",
    success: "An open stop sell order on NVDA",
    check: (a, since) => a.orders.some((o) => o.symbol === "NVDA" && o.type === "stop" && o.side === "sell" && o.createdAt >= since),
  },
  {
    id: "call-option",
    title: "Buy one call option on Apple",
    success: "An option buy of an AAPL call",
    check: (a, since) => a.transactions.some((t) => t.type === "option_buy" && t.time >= since && !!t.contract?.startsWith("AAPL|") && t.contract.includes("|C|")),
  },
  {
    id: "cancel-order",
    title: "Cancel one of your open orders",
    success: "Any order cancelled",
    check: (a, since) => a.orders.some((o) => o.status === "cancelled" && (o.closedAt ?? 0) >= since),
  },
  { id: "fees", title: "Find out how much you have paid in fees so far", success: "Tester says the amount (Activity → Fees paid)" },
  { id: "belgian", title: "Find the best-performing Belgian stock today", success: "Tester names it (Invest → Belgium, sort by 24h)" },
  { id: "news", title: "Find out why Tesla moved today, according to the news", success: "Tester finds a Tesla headline" },
  { id: "alert", title: "Make sure you hear about it when Bitcoin drops 5%", success: "A price alert or stop order on BTC" },
];
