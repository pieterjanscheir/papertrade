"use client";

/**
 * Client-side account store (zustand, persisted to localStorage).
 *
 * The store is a thin wrapper: all rules live in `engine.ts`. If your hackathon
 * team wants a real backend, replace these actions with fetch calls to API routes
 * that run the same engine functions server-side.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { marketNow } from "../demo/store";
import { usePrefsStore } from "../ui/prefs";
import { market } from "../market/provider";
import {
  deposit,
  emptyAccount,
  executeOrder,
  toggleWatch,
  withdraw,
  type AccountState,
  type OrderRequest,
  type Result,
  type Transaction,
} from "./engine";
import {
  cancelOrder,
  placePendingOrder,
  processOrders,
  type OrderEvent,
  type PendingOrderRequest,
} from "./orders";
import { createPresetAccount, type PresetId } from "./seed";
import { multiplier, parseContract, quoteOption } from "../market/options";
import {
  executeOptionOrder,
  settleExpiredOptions,
  type OptionOrderRequest,
  type OptionSettlement,
} from "./options-trading";
import type { Order } from "./engine";

export type StartKind = PresetId;

interface AccountStore {
  account: AccountState | null;
  placeOrder: (req: OrderRequest) => Result<Transaction>;
  placePendingOrder: (req: PendingOrderRequest) => Result<Order>;
  cancelOrder: (id: string) => void;
  placeOptionOrder: (req: OptionOrderRequest) => Result<Transaction>;
  /** Cash-settle options that expired by `now`. */
  settleOptions: (now: number) => OptionSettlement[];
  /** Fill/expire open orders up to `now`. Returns what happened, for notifications. */
  processOrders: (now: number) => OrderEvent[];
  deposit: (amount: number) => Result<null>;
  withdraw: (amount: number) => Result<null>;
  toggleWatch: (symbol: string) => void;
  reset: (kind: StartKind) => void;
}

export const STORAGE_KEY = "papertrade-account-v1";

export const useAccountStore = create<AccountStore>()(
  persist(
    (set, get) => ({
      account: null,

      placeOrder(req) {
        const account = get().account;
        if (!account) return { ok: false, error: "Account not loaded" };
        const now = marketNow();
        const r = executeOrder(account, req, market.priceAt(req.symbol, now), now);
        if (!r.ok) return r;
        set({ account: r.value.state });
        return { ok: true, value: r.value.tx };
      },

      placePendingOrder(req) {
        const account = get().account;
        if (!account) return { ok: false, error: "Account not loaded" };
        const r = placePendingOrder(account, req, marketNow());
        if (!r.ok) return r;
        set({ account: r.value.state });
        return { ok: true, value: r.value.order };
      },

      placeOptionOrder(req) {
        const account = get().account;
        if (!account) return { ok: false, error: "Account not loaded" };
        const now = marketNow();
        const c = parseContract(req.contract);
        const r = executeOptionOrder(account, req, quoteOption(c, now), multiplier(c.symbol), now);
        if (!r.ok) return r;
        set({ account: r.value.state });
        return { ok: true, value: r.value.tx };
      },

      settleOptions(now) {
        const account = get().account;
        if (!account || Object.keys(account.optionPositions ?? {}).length === 0) return [];
        const r = settleExpiredOptions(
          account,
          now,
          (id) => parseContract(id).expiry,
          (id) => quoteOption(parseContract(id), now).intrinsic,
          (id) => multiplier(id.split("|")[0]),
        );
        if (r.settled.length) set({ account: r.state });
        return r.settled;
      },

      cancelOrder(id) {
        const account = get().account;
        if (account) set({ account: cancelOrder(account, id, marketNow()) });
      },

      processOrders(now) {
        const account = get().account;
        if (!account) return [];
        const r = processOrders(account, market.priceAt, now);
        // Only write when something changed, so idle ticks don't touch localStorage.
        if (r.events.length > 0 || r.state.orders.some((o) => o.status === "open")) set({ account: r.state });
        return r.events;
      },

      deposit(amount) {
        const account = get().account;
        if (!account) return { ok: false, error: "Account not loaded" };
        const r = deposit(account, amount, marketNow());
        if (!r.ok) return r;
        set({ account: r.value });
        return { ok: true, value: null };
      },

      withdraw(amount) {
        const account = get().account;
        if (!account) return { ok: false, error: "Account not loaded" };
        const r = withdraw(account, amount, marketNow());
        if (!r.ok) return r;
        set({ account: r.value });
        return { ok: true, value: null };
      },

      toggleWatch(symbol) {
        const account = get().account;
        if (account) set({ account: toggleWatch(account, symbol) });
      },

      reset(kind) {
        const now = marketNow();
        set({ account: createPresetAccount(kind, now, market.priceAt) });
        usePrefsStore.getState().set("account.preset", kind); // context for user-testing feedback
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (s) => ({ account: s.account }),
      version: 3,
      // v1 accounts had no orders; v2 had no options.
      migrate: (persisted, version) => {
        const p = persisted as { account: AccountState | null };
        if (version < 2 && p.account) p.account = { ...p.account, orders: [], ordersCheckedAt: 0 };
        if (version < 3 && p.account) p.account = { ...p.account, optionPositions: {} };
        return p as never;
      },
      // Hydrated manually in <AppProviders> to avoid SSR/client mismatches.
      skipHydration: true,
    },
  ),
);

const EMPTY = emptyAccount();

/**
 * The current account. Before localStorage has loaded (server render, first paint)
 * this is an empty account; <AppProviders> keeps the UI hidden until then.
 */
export function useAccount(): AccountState {
  return useAccountStore((s) => s.account) ?? EMPTY;
}
