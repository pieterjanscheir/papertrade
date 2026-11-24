import type { Metadata } from "next";
import { DesignScreen } from "@/components/screens/design-screen";

export const metadata: Metadata = { title: "Design system · Papertrade" };

export default function Page() {
  return <DesignScreen />;
}
