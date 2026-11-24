import { Newspaper } from "lucide-react";
import type { Feature } from "../types";
import { AssetNews, NewsRunner, NewsWidget } from "./components";

export const news: Feature = {
  id: "news",
  name: "News feed",
  description: "Satirical headlines generated from simulated price moves, plus BREAKING news from demo scenarios.",
  enabled: true,
  HomeWidget: NewsWidget,
  AssetPanel: AssetNews,
  Runner: NewsRunner,
  nav: { href: "/news", label: "News", icon: Newspaper },
};
