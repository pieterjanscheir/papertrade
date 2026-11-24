import type { Metadata } from "next";
import { AlertsScreen } from "@/features/price-alerts/alerts-screen";

export const metadata: Metadata = { title: "Alerts · Papertrade" };

/** Example of a page that belongs to a feature. */
export default function Page() {
  return <AlertsScreen />;
}
