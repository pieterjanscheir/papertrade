import type { Metadata } from "next";
import { TestingScreen } from "@/features/user-testing/components";

export const metadata: Metadata = { title: "User testing · Papertrade" };

export default function Page() {
  return <TestingScreen />;
}
