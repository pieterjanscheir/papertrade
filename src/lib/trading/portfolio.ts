"use client";

/**
 * Portfolio valuation with everything included (shares AND options), using live
 * simulated prices. Use these instead of calling `summarize` / `valueHistory`
 * directly from UI code.
 */

import { market } from "../market/provider";
import { multiplier, optionMark } from "../market/options";
import { summarize, valueHistory, type AccountState, type Transaction } from "./engine";

const contractMultiplier = (contract: string) => multiplier(contract.split("|")[0]);

export function portfolioSummary(account: AccountState, now: number) {
  return summarize(account, market.priceAt, now, optionMark, contractMultiplier);
}

export function portfolioHistory(transactions: Transaction[], times: number[]) {
  return valueHistory(transactions, times, market.priceAt, optionMark, contractMultiplier);
}
