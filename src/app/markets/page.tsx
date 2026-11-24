import type { Metadata } from "next";
import { MarketsScreen } from "@/components/screens/markets-screen";

export const metadata: Metadata = { title: "Invest · Papertrade" };

export default function Page() {
  return <MarketsScreen />;
}
