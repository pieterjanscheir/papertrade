import type { Feature } from "../types";
import { EsgPanel, PortfolioEsg } from "./components";

export const esg: Feature = {
  id: "esg",
  name: "ESG vibes",
  description: "A comedic, entirely made-up ESG report per asset and for your portfolio (plants, cake and meetings).",
  enabled: true,
  HomeWidget: PortfolioEsg,
  AssetPanel: EsgPanel,
};
