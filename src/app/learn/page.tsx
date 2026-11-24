import type { Metadata } from "next";
import { LearnScreen } from "@/features/learn/components";

export const metadata: Metadata = { title: "Learn · Papertrade" };

export default function Page() {
  return <LearnScreen />;
}
