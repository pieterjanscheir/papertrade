import type { Metadata } from "next";
import { AccountScreen } from "@/components/screens/account-screen";

export const metadata: Metadata = { title: "Account · Papertrade" };

export default function Page() {
  return <AccountScreen />;
}
