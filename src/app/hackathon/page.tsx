import type { Metadata } from "next";
import { HackathonScreen } from "@/features/hackathon/components";

export const metadata: Metadata = { title: "Hackathon · Papertrade" };

export default function Page() {
  return <HackathonScreen />;
}
