import type { Metadata } from "next";
import { NewsScreen } from "@/features/news/components";

export const metadata: Metadata = { title: "News · Papertrade" };

export default function Page() {
  return <NewsScreen />;
}
