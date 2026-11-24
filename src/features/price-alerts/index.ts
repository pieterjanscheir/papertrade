import { Bell } from "lucide-react";
import type { Feature } from "../types";
import { AlertPanel, AlertRunner, AlertsWidget } from "./components";

export const priceAlerts: Feature = {
  id: "price-alerts",
  name: "Price alerts",
  description: "Example feature: get notified when an asset crosses a price.",
  enabled: true,
  HomeWidget: AlertsWidget,
  AssetPanel: AlertPanel,
  Runner: AlertRunner,
  nav: { href: "/alerts", label: "Alerts", icon: Bell },
};
