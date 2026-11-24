import { Suspense } from "react";
import type { Metadata } from "next";
import { ActivityScreen } from "@/components/screens/activity-screen";

export const metadata: Metadata = { title: "Activity · Papertrade" };

export default function Page() {
  // useSearchParams (for ?tab=orders) needs a Suspense boundary.
  return (
    <Suspense>
      <ActivityScreen />
    </Suspense>
  );
}
