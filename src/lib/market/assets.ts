/**
 * The tradable universe.
 *
 * Names and tickers refer to real instruments so the app feels familiar, but every
 * price in this app is SIMULATED (see `simulator.ts`). `refPrice` is only a rough
 * anchor so numbers look plausible; nothing here is real market data.
 *
 * Hackathon tip: add assets here, or replace this list with data from a provider
 * (see `provider.ts`).
 */

export type AssetType = "stock" | "etf" | "crypto";

/** Where it's listed (for stocks) or what it covers (ETFs). */
export type Region = "US" | "Germany" | "Netherlands" | "Belgium" | "Europe" | "Global" | "Crypto";
export const REGIONS: Region[] = ["US", "Germany", "Netherlands", "Belgium", "Europe", "Global", "Crypto"];
export const REGION_FLAG: Record<Region, string> = {
  US: "🇺🇸",
  Germany: "🇩🇪",
  Netherlands: "🇳🇱",
  Belgium: "🇧🇪",
  Europe: "🇪🇺",
  Global: "🌍",
  Crypto: "🪙",
};

export interface Asset {
  symbol: string;
  name: string;
  type: AssetType;
  /** Sector for stocks, index/theme for ETFs, "Crypto" for coins. */
  sector: string;
  region: Region;
  exchange: string;
  /** Rough price anchor in EUR at the simulation reference date. */
  refPrice: number;
  /** Annualised volatility, e.g. 0.3 = 30%. Drives how wild the simulated chart is. */
  volatility: number;
  /** Annualised drift, e.g. 0.08 = +8% a year on average. */
  drift: number;
  /** Brand-neutral accent colour used for the avatar. */
  color: string;
  description: string;
  /** Simulator special: price only ever rises (see the fictional ANTH listing). */
  alwaysUp?: boolean;
}

export const ASSETS: Asset[] = [
  // --- US tech ---
  { symbol: "AAPL", name: "Apple", type: "stock", sector: "Technology", region: "US", exchange: "NASDAQ", refPrice: 215, volatility: 0.26, drift: 0.09, color: "#8e8e93", description: "Consumer electronics, software and services, best known for the iPhone and Mac." },
  { symbol: "MSFT", name: "Microsoft", type: "stock", sector: "Technology", region: "US", exchange: "NASDAQ", refPrice: 410, volatility: 0.24, drift: 0.1, color: "#00a4ef", description: "Software, cloud computing (Azure) and productivity tools." },
  { symbol: "NVDA", name: "NVIDIA", type: "stock", sector: "Semiconductors", region: "US", exchange: "NASDAQ", refPrice: 125, volatility: 0.48, drift: 0.18, color: "#76b900", description: "Graphics processors and accelerated computing chips used for AI workloads." },
  { symbol: "AMZN", name: "Amazon", type: "stock", sector: "Consumer", region: "US", exchange: "NASDAQ", refPrice: 190, volatility: 0.3, drift: 0.1, color: "#ff9900", description: "E-commerce marketplace and the AWS cloud platform." },
  { symbol: "GOOGL", name: "Alphabet", type: "stock", sector: "Technology", region: "US", exchange: "NASDAQ", refPrice: 165, volatility: 0.28, drift: 0.09, color: "#4285f4", description: "Parent company of Google Search, YouTube and Google Cloud." },
  { symbol: "META", name: "Meta Platforms", type: "stock", sector: "Technology", region: "US", exchange: "NASDAQ", refPrice: 520, volatility: 0.36, drift: 0.11, color: "#0866ff", description: "Social networks and messaging apps, plus VR/AR hardware." },
  { symbol: "TSLA", name: "Tesla", type: "stock", sector: "Automotive", region: "US", exchange: "NASDAQ", refPrice: 230, volatility: 0.6, drift: 0.06, color: "#e82127", description: "Electric vehicles, batteries and energy storage." },
  { symbol: "NFLX", name: "Netflix", type: "stock", sector: "Media", region: "US", exchange: "NASDAQ", refPrice: 640, volatility: 0.38, drift: 0.08, color: "#e50914", description: "Subscription video streaming." },
  { symbol: "AMD", name: "Advanced Micro Devices", type: "stock", sector: "Semiconductors", region: "US", exchange: "NASDAQ", refPrice: 150, volatility: 0.5, drift: 0.12, color: "#ed1c24", description: "CPUs and GPUs for PCs, data centres and consoles." },
  { symbol: "SPOT", name: "Spotify", type: "stock", sector: "Media", region: "US", exchange: "NYSE", refPrice: 330, volatility: 0.42, drift: 0.1, color: "#1db954", description: "Audio streaming for music and podcasts." },
  // --- US other ---
  { symbol: "KO", name: "Coca-Cola", type: "stock", sector: "Consumer Staples", region: "US", exchange: "NYSE", refPrice: 58, volatility: 0.15, drift: 0.05, color: "#f40009", description: "Non-alcoholic beverages sold worldwide." },
  { symbol: "JPM", name: "JPMorgan Chase", type: "stock", sector: "Financials", region: "US", exchange: "NYSE", refPrice: 190, volatility: 0.22, drift: 0.07, color: "#5b6b7a", description: "Global investment bank and consumer banking." },
  { symbol: "V", name: "Visa", type: "stock", sector: "Financials", region: "US", exchange: "NYSE", refPrice: 255, volatility: 0.18, drift: 0.08, color: "#1a1f71", description: "Card payments network." },
  { symbol: "DIS", name: "Walt Disney", type: "stock", sector: "Media", region: "US", exchange: "NYSE", refPrice: 95, volatility: 0.28, drift: 0.04, color: "#113ccf", description: "Entertainment studios, theme parks and streaming." },
  // --- Europe ---
  { symbol: "ASML", name: "ASML Holding", type: "stock", sector: "Semiconductors", region: "Netherlands", exchange: "Euronext Amsterdam", refPrice: 820, volatility: 0.38, drift: 0.11, color: "#10069f", description: "Lithography machines used to manufacture advanced chips." },
  { symbol: "SAP", name: "SAP", type: "stock", sector: "Technology", region: "Germany", exchange: "XETRA", refPrice: 185, volatility: 0.24, drift: 0.09, color: "#0070f2", description: "Enterprise resource planning and business software." },
  { symbol: "NOVO", name: "Novo Nordisk", type: "stock", sector: "Healthcare", region: "Europe", exchange: "Copenhagen", refPrice: 110, volatility: 0.32, drift: 0.07, color: "#001965", description: "Pharmaceuticals focused on diabetes and obesity care." },
  { symbol: "MC", name: "LVMH", type: "stock", sector: "Luxury", region: "Europe", exchange: "Euronext Paris", refPrice: 720, volatility: 0.27, drift: 0.06, color: "#a67c52", description: "Luxury goods group spanning fashion, wine & spirits and jewellery." },
  { symbol: "SIE", name: "Siemens", type: "stock", sector: "Industrials", region: "Germany", exchange: "XETRA", refPrice: 170, volatility: 0.24, drift: 0.07, color: "#009999", description: "Industrial automation, infrastructure and digital industries." },
  { symbol: "ALV", name: "Allianz", type: "stock", sector: "Financials", region: "Germany", exchange: "XETRA", refPrice: 260, volatility: 0.2, drift: 0.07, color: "#003781", description: "Insurance and asset management." },
  { symbol: "ADS", name: "Adidas", type: "stock", sector: "Consumer", region: "Germany", exchange: "XETRA", refPrice: 205, volatility: 0.32, drift: 0.05, color: "#2b2b2b", description: "Sportswear, footwear and equipment." },
  { symbol: "RACE", name: "Ferrari", type: "stock", sector: "Automotive", region: "Europe", exchange: "Borsa Italiana", refPrice: 390, volatility: 0.24, drift: 0.1, color: "#da291c", description: "Luxury sports cars and Formula 1." },
  { symbol: "ABI", name: "AB InBev", type: "stock", sector: "Consumer Staples", region: "Belgium", exchange: "Euronext Brussels", refPrice: 57, volatility: 0.24, drift: 0.04, color: "#c8a2c8", description: "The world's largest brewer." },
  { symbol: "KBC", name: "KBC Group", type: "stock", sector: "Financials", region: "Belgium", exchange: "Euronext Brussels", refPrice: 68, volatility: 0.24, drift: 0.06, color: "#00aeef", description: "Belgian bank-insurance group." },
  { symbol: "UCB", name: "UCB", type: "stock", sector: "Healthcare", region: "Belgium", exchange: "Euronext Brussels", refPrice: 150, volatility: 0.3, drift: 0.08, color: "#ff6b35", description: "Biopharma focused on immunology and neurology." },

  // --- More US ---
  { symbol: "WMT", name: "Walmart", type: "stock", sector: "Consumer Staples", region: "US", exchange: "NYSE", refPrice: 72, volatility: 0.18, drift: 0.08, color: "#0071ce", description: "Supermarkets and discount stores, plus a big online shop." },
  { symbol: "MCD", name: "McDonald's", type: "stock", sector: "Consumer", region: "US", exchange: "NYSE", refPrice: 265, volatility: 0.17, drift: 0.07, color: "#e0a800", description: "Fast-food restaurants, mostly run by franchisees." },
  { symbol: "COST", name: "Costco", type: "stock", sector: "Consumer Staples", region: "US", exchange: "NASDAQ", refPrice: 830, volatility: 0.2, drift: 0.1, color: "#e31837", description: "Membership warehouse stores that sell things in very large packs." },
  { symbol: "BRKB", name: "Berkshire Hathaway", type: "stock", sector: "Financials", region: "US", exchange: "NYSE", refPrice: 420, volatility: 0.16, drift: 0.08, color: "#3a3a8c", description: "Conglomerate owning insurers, railways, energy firms and a large stock portfolio." },
  { symbol: "XOM", name: "ExxonMobil", type: "stock", sector: "Energy", region: "US", exchange: "NYSE", refPrice: 105, volatility: 0.24, drift: 0.05, color: "#ed1b2d", description: "Oil and gas exploration, refining and chemicals." },
  { symbol: "INTC", name: "Intel", type: "stock", sector: "Semiconductors", region: "US", exchange: "NASDAQ", refPrice: 28, volatility: 0.42, drift: 0.0, color: "#0071c5", description: "Processors for PCs and servers, and chip manufacturing." },
  { symbol: "CRM", name: "Salesforce", type: "stock", sector: "Technology", region: "US", exchange: "NYSE", refPrice: 260, volatility: 0.3, drift: 0.08, color: "#00a1e0", description: "Cloud software for sales, service and marketing teams." },
  { symbol: "PLTR", name: "Palantir", type: "stock", sector: "Technology", region: "US", exchange: "NASDAQ", refPrice: 70, volatility: 0.65, drift: 0.15, color: "#3d3d3d", description: "Data analysis software for governments and companies." },
  { symbol: "UBER", name: "Uber", type: "stock", sector: "Technology", region: "US", exchange: "NYSE", refPrice: 68, volatility: 0.38, drift: 0.1, color: "#276ef1", description: "Ride-hailing and food delivery apps." },
  { symbol: "ANTH", name: "Anthropic", type: "stock", sector: "AI", region: "US", exchange: "Imaginary Exchange", refPrice: 420, volatility: 0.12, drift: 0.9, color: "#d97757", alwaysUp: true, description: "Fictional listing, just for fun: Anthropic is privately held and not traded anywhere. In this simulator it only ever goes up." },
  // --- Germany ---
  { symbol: "DTE", name: "Deutsche Telekom", type: "stock", sector: "Telecom", region: "Germany", exchange: "XETRA", refPrice: 28, volatility: 0.18, drift: 0.06, color: "#e20074", description: "Mobile and fixed-line telecoms across Europe and the US." },
  { symbol: "MBG", name: "Mercedes-Benz Group", type: "stock", sector: "Automotive", region: "Germany", exchange: "XETRA", refPrice: 60, volatility: 0.28, drift: 0.04, color: "#5a5a5a", description: "Premium cars and vans." },
  { symbol: "BAS", name: "BASF", type: "stock", sector: "Chemicals", region: "Germany", exchange: "XETRA", refPrice: 45, volatility: 0.26, drift: 0.03, color: "#21a0d2", description: "Chemicals used in almost everything, from plastics to farming." },
  { symbol: "IFX", name: "Infineon", type: "stock", sector: "Semiconductors", region: "Germany", exchange: "XETRA", refPrice: 33, volatility: 0.4, drift: 0.09, color: "#0a8276", description: "Power chips for cars, industry and energy." },
  { symbol: "DBK", name: "Deutsche Bank", type: "stock", sector: "Financials", region: "Germany", exchange: "XETRA", refPrice: 16, volatility: 0.32, drift: 0.05, color: "#0018a8", description: "Investment and corporate banking, plus retail banking in Germany." },
  // --- Netherlands ---
  { symbol: "ADYEN", name: "Adyen", type: "stock", sector: "Financials", region: "Netherlands", exchange: "Euronext Amsterdam", refPrice: 1400, volatility: 0.45, drift: 0.1, color: "#0abf53", description: "Payment processing for online shops and stores." },
  { symbol: "INGA", name: "ING Groep", type: "stock", sector: "Financials", region: "Netherlands", exchange: "Euronext Amsterdam", refPrice: 15.5, volatility: 0.26, drift: 0.06, color: "#ff6200", description: "Retail and business banking, mostly in Europe." },
  { symbol: "HEIA", name: "Heineken", type: "stock", sector: "Consumer Staples", region: "Netherlands", exchange: "Euronext Amsterdam", refPrice: 85, volatility: 0.2, drift: 0.04, color: "#00843d", description: "Brewer with beers sold in most countries." },
  { symbol: "PHIA", name: "Philips", type: "stock", sector: "Health technology", region: "Netherlands", exchange: "Euronext Amsterdam", refPrice: 24, volatility: 0.3, drift: 0.03, color: "#0b5ed7", description: "Health technology and personal care products." },
  { symbol: "AD", name: "Ahold Delhaize", type: "stock", sector: "Consumer Staples", region: "Netherlands", exchange: "Euronext Amsterdam", refPrice: 31, volatility: 0.16, drift: 0.05, color: "#00a0e2", description: "Supermarket chains in Europe and the US." },
  // --- Belgium ---
  { symbol: "AGS", name: "Ageas", type: "stock", sector: "Financials", region: "Belgium", exchange: "Euronext Brussels", refPrice: 47, volatility: 0.2, drift: 0.05, color: "#b5121b", description: "Insurance group based in Brussels." },
  { symbol: "SOLB", name: "Solvay", type: "stock", sector: "Chemicals", region: "Belgium", exchange: "Euronext Brussels", refPrice: 30, volatility: 0.3, drift: 0.03, color: "#2d6cdf", description: "Chemicals, from soda ash to specialty materials." },
  { symbol: "DIE", name: "D'Ieteren", type: "stock", sector: "Consumer", region: "Belgium", exchange: "Euronext Brussels", refPrice: 190, volatility: 0.26, drift: 0.07, color: "#003a70", description: "Car distribution in Belgium and car glass repair worldwide." },
  { symbol: "ELI", name: "Elia", type: "stock", sector: "Utilities", region: "Belgium", exchange: "Euronext Brussels", refPrice: 90, volatility: 0.22, drift: 0.05, color: "#e3007d", description: "Runs the high-voltage electricity grid in Belgium and part of Germany." },
  { symbol: "COLR", name: "Colruyt", type: "stock", sector: "Consumer Staples", region: "Belgium", exchange: "Euronext Brussels", refPrice: 40, volatility: 0.2, drift: 0.02, color: "#f39200", description: "Belgian supermarket chain known for low prices." },
  // --- ETFs ---
  { symbol: "VWCE", name: "FTSE All-World ETF", type: "etf", sector: "Global equity", region: "Global", exchange: "XETRA", refPrice: 120, volatility: 0.14, drift: 0.07, color: "#96151d", description: "Tracks thousands of large and mid-cap companies across developed and emerging markets." },
  { symbol: "IWDA", name: "MSCI World ETF", type: "etf", sector: "Developed markets", region: "Global", exchange: "Euronext Amsterdam", refPrice: 95, volatility: 0.14, drift: 0.075, color: "#000000", description: "Tracks large and mid-cap companies in developed markets." },
  { symbol: "CSPX", name: "S&P 500 ETF", type: "etf", sector: "US equity", region: "US", exchange: "London", refPrice: 540, volatility: 0.16, drift: 0.085, color: "#3c3c3c", description: "Tracks the 500 largest US listed companies." },
  { symbol: "EQQQ", name: "Nasdaq-100 ETF", type: "etf", sector: "US tech", region: "US", exchange: "XETRA", refPrice: 450, volatility: 0.22, drift: 0.1, color: "#0996c7", description: "Tracks the 100 largest non-financial Nasdaq companies." },
  { symbol: "EMIM", name: "Emerging Markets ETF", type: "etf", sector: "Emerging markets", region: "Global", exchange: "Euronext Amsterdam", refPrice: 32, volatility: 0.17, drift: 0.05, color: "#6d2077", description: "Tracks companies in emerging economies." },
  { symbol: "DAX", name: "DAX ETF", type: "etf", sector: "German equity", region: "Germany", exchange: "XETRA", refPrice: 180, volatility: 0.17, drift: 0.07, color: "#c8102e", description: "Tracks the DAX: the 40 largest companies on the Frankfurt stock exchange." },
  { symbol: "AEX", name: "AEX ETF", type: "etf", sector: "Dutch equity", region: "Netherlands", exchange: "Euronext Amsterdam", refPrice: 90, volatility: 0.17, drift: 0.07, color: "#f36c21", description: "Tracks the AEX: the 25 largest companies on Euronext Amsterdam." },
  { symbol: "BEL20", name: "BEL 20 ETF", type: "etf", sector: "Belgian equity", region: "Belgium", exchange: "Euronext Brussels", refPrice: 40, volatility: 0.15, drift: 0.05, color: "#fdda24", description: "Tracks the BEL 20: the 20 largest companies on Euronext Brussels." },
  { symbol: "ESGW", name: "Clean Energy ETF", type: "etf", sector: "Thematic", region: "Global", exchange: "XETRA", refPrice: 8, volatility: 0.3, drift: 0.03, color: "#2e7d32", description: "Thematic basket of renewable-energy companies." },
  // --- Crypto ---
  { symbol: "BTC", name: "Bitcoin", type: "crypto", sector: "Crypto", region: "Crypto", exchange: "24/7", refPrice: 62000, volatility: 0.55, drift: 0.15, color: "#f7931a", description: "The first and largest cryptocurrency by market value." },
  { symbol: "ETH", name: "Ethereum", type: "crypto", sector: "Crypto", region: "Crypto", exchange: "24/7", refPrice: 3100, volatility: 0.65, drift: 0.12, color: "#627eea", description: "Programmable blockchain powering smart contracts." },
  { symbol: "SOL", name: "Solana", type: "crypto", sector: "Crypto", region: "Crypto", exchange: "24/7", refPrice: 150, volatility: 0.85, drift: 0.1, color: "#9945ff", description: "High-throughput blockchain for apps and payments." },
];

export const ASSETS_BY_SYMBOL: Record<string, Asset> = Object.fromEntries(
  ASSETS.map((a) => [a.symbol, a]),
);

export function getAsset(symbol: string): Asset | undefined {
  return ASSETS_BY_SYMBOL[symbol.toUpperCase()];
}

export const ASSET_TYPE_LABEL: Record<AssetType, string> = {
  stock: "Stocks",
  etf: "ETFs",
  crypto: "Crypto",
};
