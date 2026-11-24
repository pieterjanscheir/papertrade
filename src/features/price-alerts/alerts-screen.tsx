"use client";

import { Card, EmptyState } from "@/components/ui";
import { useNow } from "@/lib/ui/clock";
import { AlertList } from "./components";
import { useAlerts } from "./store";

export function AlertsScreen() {
  const now = useNow();
  const { alerts, remove } = useAlerts();
  const active = alerts.filter((a) => !a.triggeredAt);
  const done = alerts.filter((a) => a.triggeredAt);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">Price alerts</h1>
      <Card className="p-5">
        <p className="mb-2 text-sm font-semibold text-muted">Active</p>
        {active.length === 0 ? (
          <EmptyState title="No active alerts" body="Open any asset and add an alert in the Price alerts panel." />
        ) : (
          <AlertList alerts={active} now={now} onRemove={remove} />
        )}
      </Card>
      {done.length > 0 && (
        <Card className="p-5">
          <p className="mb-2 text-sm font-semibold text-muted">Triggered</p>
          <AlertList alerts={done} now={now} onRemove={remove} />
        </Card>
      )}
    </div>
  );
}
