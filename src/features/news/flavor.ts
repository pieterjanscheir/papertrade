/**
 * Instrument- and sector-specific joke headlines.
 *
 * Placeholders: {name} {symbol} {pct} {dir} ("rises"/"falls") {color} ("green"/"red").
 *
 * House rules for adding jokes: laugh at situations, products in general and
 * trader life. No real people, no accusations of wrongdoing, nothing about
 * patients, accidents or anything that would be awkward if the company saw it.
 */

export interface Quips {
  up: string[];
  down: string[];
  /** Works in either direction; uses {dir}. */
  any?: string[];
}

export const ASSET_QUIPS: Record<string, Quips> = {
  AAPL: {
    up: [
      "Apple up {pct} as a new shade of grey is unveiled to a standing ovation",
      "Apple gains {pct}; somebody finally found the right charging cable",
      "Apple climbs {pct} after fans line up overnight to buy the same thing, but slightly thinner",
    ],
    down: [
      "Apple slips {pct} after critics say the new grey is “basically the old grey”",
      "Apple down {pct}; fans cope by unboxing things very slowly",
    ],
    any: ["Apple {dir} {pct} as analysts debate whether “Pro” still means anything"],
  },
  MSFT: {
    up: [
      "Microsoft climbs {pct} as millions of laptops agree to install updates “later”",
      "Microsoft up {pct}; spreadsheet fans celebrate with a pivot table",
    ],
    down: [
      "Microsoft dips {pct} after a meeting invite goes to the entire company by accident",
      "Microsoft down {pct}; investors stuck on “Working on updates… 33%”",
    ],
    any: ["Microsoft {dir} {pct}; analysts reply-all with their thoughts"],
  },
  NVDA: {
    up: [
      "NVIDIA up {pct}; spy caught smuggling chips out in a suitcase of “very warm laptops”",
      "NVIDIA climbs {pct} after a secret agent infiltrates HQ, then gets distracted benchmarking video games",
      "NVIDIA soars {pct} as the world discovers yet another thing that needs a GPU",
      "NVIDIA up {pct}; gamers still can't find a graphics card, investors don't mind",
      "NVIDIA jumps {pct} after a toaster is announced with “AI-accelerated browning”",
    ],
    down: [
      "NVIDIA drops {pct}; spy's fake moustache recognised instantly by the AI-powered security camera",
      "NVIDIA dips {pct} after a spy steals the chip blueprints and finds they're just a very large export form",
      "NVIDIA drops {pct} after someone runs a spreadsheet on a regular CPU and it works fine",
      "NVIDIA down {pct}; an AI asked to explain why replies with a 40-page essay",
    ],
    any: [
      "NVIDIA {dir} {pct}, a move roughly the size of a small country's economy",
      "NVIDIA {dir} {pct}; the spy disguised as a server rack is now “just part of the team”",
    ],
  },
  AMZN: {
    up: [
      "Amazon up {pct}; parcel arrives before investors finish clicking “buy”",
      "Amazon gains {pct} as global cardboard box supply hits a record high",
    ],
    down: [
      "Amazon slips {pct} after a box arrives containing a smaller box containing a smaller box",
      "Amazon down {pct}; shoppers “just browsing” for the third hour in a row",
    ],
    any: ["Amazon {dir} {pct}. Customers who read this headline also read: the next headline"],
  },
  GOOGL: {
    up: [
      "Alphabet up {pct}; investors search “why is Alphabet up”, results inconclusive",
      "Alphabet gains {pct} as people continue to look things up",
    ],
    down: [
      "Alphabet slips {pct}. Did you mean: buy the dip?",
      "Alphabet down {pct} after an analyst closes 87 browser tabs at once",
    ],
  },
  META: {
    up: [
      "Meta up {pct} as everybody's aunt shares the same sunset photo again",
      "Meta climbs {pct}; virtual meeting avatars finally get legs",
    ],
    down: [
      "Meta dips {pct} after a VR headset is spotted being used as a fruit bowl",
      "Meta slides {pct}; users briefly spend three minutes outside",
    ],
  },
  TSLA: {
    up: [
      "Tesla up {pct}; owners update their car and their portfolio at the same time",
      "Tesla rallies {pct} as the stock accelerates faster than the brochure promised",
    ],
    down: [
      "Tesla drops {pct}; investors reminded “autopilot” doesn't apply to portfolios",
      "Tesla down {pct} as the stock tries out regenerative braking",
    ],
    any: ["Tesla {dir} {pct}, which by Tesla standards counts as a quiet afternoon"],
  },
  NFLX: {
    up: [
      "Netflix up {pct}; investors click “Next episode” without thinking",
      "Netflix gains {pct} as the world agrees to “just one more”",
    ],
    down: [
      "Netflix slips {pct}. Investors asked: “Are you still watching?”",
      "Netflix down {pct} after viewers spend 45 minutes choosing a film, then go to bed",
    ],
  },
  AMD: {
    up: [
      "AMD up {pct}; enthusiasts post benchmark screenshots with zero context",
      "AMD gains {pct} as computers somewhere become slightly faster",
    ],
    down: ["AMD slips {pct}; forum users blame the thermal paste", "AMD down {pct} after someone forgets to press the turbo button"],
  },
  SPOT: {
    up: [
      "Spotify up {pct}; investors add it to their “Gains 2026” playlist",
      "Spotify climbs {pct} as everyone discovers the same song at the same time",
    ],
    down: ["Spotify dips {pct}; shuffle mode blamed", "Spotify down {pct}; analysts stuck in a two-hour podcast about it"],
  },
  KO: {
    up: ["Coca-Cola up {pct}; shareholders report a bubbly mood", "Coca-Cola fizzes {pct} higher in a refreshingly calm session"],
    down: ["Coca-Cola goes a bit flat, down {pct}", "Coca-Cola dips {pct}; investors check if they left the cap off"],
  },
  JPM: {
    up: [
      "JPMorgan Chase up {pct}; bankers celebrate by adding another tab to a spreadsheet",
      "JPMorgan Chase gains {pct} as somebody finally aligns the decimal points",
    ],
    down: ["JPMorgan Chase eases {pct}; a pitch deck was spotted using Comic Sans", "JPMorgan Chase down {pct} after the office runs out of blue shirts"],
  },
  V: {
    up: ["Visa up {pct}; contactless payments mostly used to buy coffee and more coffee", "Visa gains {pct} as the world taps its card a little harder"],
    down: ["Visa dips {pct} after everyone pays in exact change for one confusing afternoon", "Visa slips {pct}; card readers say “please try again”"],
  },
  DIS: {
    up: ["Walt Disney up {pct}; investors sing about it, loudly", "Walt Disney gains {pct}; the queue for the rollercoaster now has a queue"],
    down: ["Walt Disney dips {pct}; analysts advised to “let it go”", "Walt Disney down {pct} as a sequel to the sequel is announced"],
  },
  ASML: {
    up: ["ASML climbs {pct}; its machines remain larger than most apartments", "ASML up {pct} after printing something very, very small"],
    down: ["ASML slips {pct} after someone asks what one machine costs, then sits down", "ASML down {pct}; the lens was just a little smudged"],
  },
  SAP: {
    up: ["SAP up {pct}; consultants celebrate with a three-year implementation roadmap", "SAP gains {pct} as a dropdown menu works on the first try"],
    down: ["SAP dips {pct} after a dropdown menu gets its own dropdown menu", "SAP down {pct}; somebody pressed “F4” and nothing happened"],
  },
  NOVO: {
    up: ["Novo Nordisk up {pct}; Copenhagen office celebrates with an extra round of cinnamon buns", "Novo Nordisk gains {pct} on a crisp, very Danish morning"],
    down: ["Novo Nordisk dips {pct}; analysts blame a shortage of Danish pastries", "Novo Nordisk slips {pct} as the canteen runs out of rye bread"],
  },
  MC: {
    up: ["LVMH up {pct}; a handbag somewhere becomes 4% more exclusive", "LVMH gains {pct}; the move was reportedly hand-stitched in France"],
    down: ["LVMH dips {pct}; luxury shoppers forced to consider the second-most expensive option", "LVMH slips {pct} after a champagne cork lands in the wrong meeting"],
  },
  SIE: {
    up: ["Siemens up {pct}; engineers celebrate with a perfectly calibrated toast", "Siemens gains {pct} with typical precision, to the third decimal"],
    down: ["Siemens dips {pct} after a train arrives one minute early and confuses everyone", "Siemens slips {pct}; the manual for the coffee machine is 300 pages"],
  },
  ALV: {
    up: ["Allianz up {pct}; insurers insure the gains, just in case", "Allianz gains {pct} as risk is, once again, managed"],
    down: ["Allianz dips {pct}; the fine print calls it “an act of markets”", "Allianz slips {pct} as analysts read clause 14b, subsection iv"],
  },
  ADS: {
    up: ["Adidas up {pct}; shares sprint ahead in three stripes", "Adidas gains {pct} after a very good warm-up"],
    down: ["Adidas slips {pct}; stock pulls a hamstring on the way down", "Adidas down {pct} after forgetting to tie its laces"],
  },
  RACE: {
    up: ["Ferrari up {pct}; the stock goes from zero to gains in 2.9 seconds", "Ferrari gains {pct}, in red, obviously"],
    down: ["Ferrari slows {pct}; the pit stop takes longer than planned", "Ferrari dips {pct} as analysts debate tyre strategy for the portfolio"],
  },
  ABI: {
    up: ["AB InBev up {pct}; investors raise a glass, then another", "AB InBev gains {pct} as Friday arrives slightly early"],
    down: ["AB InBev dips {pct}; analysts blame “a slightly flat Tuesday”", "AB InBev slips {pct} after someone orders a mocktail"],
  },
  KBC: {
    up: ["KBC up {pct}; Belgian investors celebrate with fries, as tradition demands", "KBC gains {pct} on the one sunny day in Brussels this month"],
    down: ["KBC eases {pct}; it was raining in Brussels, which explains most things", "KBC slips {pct} as the trading floor debates the correct way to make a waffle"],
  },
  UCB: {
    up: ["UCB up {pct}; the Brussels lab celebrates with waffles", "UCB gains {pct} as Belgium briefly agrees on something"],
    down: ["UCB dips {pct} as the trading floor debates mayonnaise versus ketchup", "UCB slips {pct}; the chocolate supply in the meeting room runs low"],
  },
  VWCE: {
    up: ["FTSE All-World ETF up {pct}; the whole world appears to be having a decent day", "FTSE All-World ETF gains {pct}; owners find out next year, as planned"],
    down: ["FTSE All-World ETF dips {pct}; “the world” is having a moment", "FTSE All-World ETF slips {pct}; holders remain asleep, which is the strategy"],
  },
  IWDA: {
    up: ["MSCI World ETF up {pct}; holders remain blissfully unaware, as intended", "MSCI World ETF gains {pct} while its owners walk the dog"],
    down: ["MSCI World ETF slips {pct}; holders reportedly gardening and not looking", "MSCI World ETF dips {pct}, which nobody will remember in 10 years"],
  },
  CSPX: {
    up: ["S&P 500 ETF up {pct}; 500 companies collectively high-five", "S&P 500 ETF gains {pct}; somebody's dad mentions it at dinner"],
    down: ["S&P 500 ETF slips {pct}; 500 companies collectively shrug", "S&P 500 ETF dips {pct}; dinner-table explanations are prepared"],
  },
  EQQQ: {
    up: ["Nasdaq-100 ETF up {pct}; hoodie sales unaffected", "Nasdaq-100 ETF gains {pct} as tech fans say “told you” in unison"],
    down: ["Nasdaq-100 ETF dips {pct}; tech fans say “it's a buying opportunity” in unison", "Nasdaq-100 ETF slips {pct}; 100 companies close their laptops early"],
  },
  EMIM: {
    up: ["Emerging Markets ETF up {pct}; markets continue emerging, as named", "Emerging Markets ETF gains {pct}, emerging nicely"],
    down: ["Emerging Markets ETF dips {pct}; markets briefly submerge", "Emerging Markets ETF slips {pct}; will re-emerge shortly"],
  },
  ESGW: {
    up: ["Clean Energy ETF up {pct}; the sun shines on its holders, literally", "Clean Energy ETF gains {pct} on a pleasantly windy day"],
    down: ["Clean Energy ETF dips {pct} after a cloudy afternoon", "Clean Energy ETF slips {pct}; wind takes the day off"],
  },
  // --- Fictional ---
  ANTH: {
    up: [
      "Anthropic up {pct}. Again. Analysts check whether the chart is upside down",
      "Anthropic climbs {pct}; the “sell” button was reportedly never found",
      "Anthropic rises {pct} after politely asking the market and the market saying yes",
      "Anthropic up {pct}; the stock's assistant drafted a 3-page memo on why, with caveats",
      "Anthropic gains {pct}. Bears seen updating their LinkedIn to “bulls”",
      "Anthropic up {pct}; gravity reportedly “reviewing its approach”",
    ],
    down: ["Anthropic briefly considers going down, decides that would be unhelpful"],
  },
  // --- More US ---
  WMT: {
    up: ["Walmart up {pct}; shoppers fill their carts and their portfolios", "Walmart gains {pct} as somebody finds the last parking spot"],
    down: ["Walmart dips {pct}; a shopping cart with one wobbly wheel blamed", "Walmart slips {pct} after the self-checkout says “unexpected item in bagging area”"],
  },
  MCD: {
    up: ["McDonald's up {pct}; the ice cream machine works, markets celebrate", "McDonald's gains {pct}; investors say they're “lovin' it”"],
    down: ["McDonald's dips {pct}; the ice cream machine is, once again, being cleaned", "McDonald's slips {pct} after someone orders a salad"],
  },
  COST: {
    up: ["Costco up {pct}; investors buy shares in packs of 48", "Costco gains {pct} as the hot dog stays at the same price for another decade"],
    down: ["Costco dips {pct}; shoppers realise they own 6 kg of mustard", "Costco slips {pct} after the free samples run out at noon"],
  },
  BRKB: {
    up: ["Berkshire Hathaway up {pct}; shareholders celebrate with a cherry soda and a long letter", "Berkshire Hathaway gains {pct}, patiently"],
    down: ["Berkshire Hathaway dips {pct}; shareholders say “we'll check back in 20 years”", "Berkshire Hathaway slips {pct}, nobody panics, as is tradition"],
  },
  XOM: {
    up: ["ExxonMobil up {pct}; analysts say the stock is “well-oiled”", "ExxonMobil gains {pct} as the barrel half full"],
    down: ["ExxonMobil slips {pct}; the barrel turns out to be half empty", "ExxonMobil dips {pct} after a slick session"],
  },
  INTC: {
    up: ["Intel up {pct}; a laptop sticker somewhere glows with pride", "Intel gains {pct}; the comeback tour adds another date"],
    down: ["Intel dips {pct}; engineers look for the missing nanometres", "Intel slips {pct} as the fan in a 2015 laptop spins up in sympathy"],
  },
  CRM: {
    up: ["Salesforce up {pct}; a dashboard about dashboards is unveiled", "Salesforce gains {pct} after a sales call that ends on time"],
    down: ["Salesforce dips {pct}; the CRM forgets who the customer was", "Salesforce slips {pct} after 14 mandatory fields stop a deal"],
  },
  PLTR: {
    up: ["Palantir up {pct}; the data says it would, apparently", "Palantir gains {pct} as fans explain the company at length to nobody in particular"],
    down: ["Palantir dips {pct}; fans call it “an ontology-driven discount”", "Palantir slips {pct}; nobody can fully explain why, which feels on brand"],
  },
  UBER: {
    up: ["Uber up {pct}; investors rate the session five stars", "Uber gains {pct} as surge pricing applies to the stock"],
    down: ["Uber dips {pct}; the stock is “2 minutes away” for 20 minutes", "Uber slips {pct} after taking the scenic route"],
  },
  // --- Germany ---
  DTE: {
    up: ["Deutsche Telekom up {pct}; the stock has full bars for once", "Deutsche Telekom gains {pct}, in a very pink kind of way"],
    down: ["Deutsche Telekom dips {pct}; signal lost in a train tunnel", "Deutsche Telekom slips {pct} while on hold for customer service"],
  },
  MBG: {
    up: ["Mercedes-Benz up {pct}; the stock arrives with heated seats", "Mercedes-Benz gains {pct} with German engineering and a soft-close door"],
    down: ["Mercedes-Benz dips {pct}; parked slightly crooked, investors notice", "Mercedes-Benz slips {pct} after the sat-nav suggests a detour"],
  },
  BAS: {
    up: ["BASF up {pct}; chemistry between buyers and sellers described as “excellent”", "BASF gains {pct} in a reaction nobody can reproduce"],
    down: ["BASF dips {pct}; the experiment needs “one more run”", "BASF slips {pct} as analysts forget to wear their safety goggles"],
  },
  IFX: {
    up: ["Infineon up {pct}; power chips feeling powerful", "Infineon gains {pct} as an electric car somewhere goes slightly further"],
    down: ["Infineon dips {pct}; somebody unplugged it to charge their phone", "Infineon slips {pct} on a low-voltage afternoon"],
  },
  DBK: {
    up: ["Deutsche Bank up {pct}; traders celebrate with an extra pretzel", "Deutsche Bank gains {pct} as Frankfurt has a pleasantly orderly day"],
    down: ["Deutsche Bank dips {pct}; the canteen ran out of currywurst", "Deutsche Bank slips {pct} after a form needs one more stamp"],
  },
  DAX: {
    up: ["DAX ETF up {pct}; 40 German companies agree, after a short meeting, to go up", "DAX ETF gains {pct}, punctually"],
    down: ["DAX ETF dips {pct}; analysts request the minutes of the meeting", "DAX ETF slips {pct} after a train is cancelled for “operational reasons”"],
  },
  // --- Netherlands ---
  ADYEN: {
    up: ["Adyen up {pct}; payments processed, gains processed", "Adyen gains {pct} as every coffee in Amsterdam is paid by phone"],
    down: ["Adyen dips {pct}; a tourist tries to pay with a tulip", "Adyen slips {pct} after a card reader needs a hug"],
  },
  INGA: {
    up: ["ING up {pct}; the orange lion roars, politely", "ING gains {pct} as Dutch savers allow themselves one extra stroopwafel"],
    down: ["ING dips {pct}; the orange is slightly less orange today", "ING slips {pct} after cycling into a headwind"],
  },
  HEIA: {
    up: ["Heineken up {pct}; investors raise a cold one", "Heineken gains {pct} on a terrace with a view of the canal"],
    down: ["Heineken dips {pct}; the beer was a bit warm", "Heineken slips {pct} as Dry January lasts into February"],
  },
  PHIA: {
    up: ["Philips up {pct}; a light bulb moment for investors", "Philips gains {pct}; the electric toothbrush hits the two-minute mark"],
    down: ["Philips dips {pct}; somebody forgot to turn the lights on", "Philips slips {pct} as the smart lamp switches to “mood: neutral”"],
  },
  AD: {
    up: ["Ahold Delhaize up {pct}; investors fill their basket", "Ahold Delhaize gains {pct} after the self-scan works first time"],
    down: ["Ahold Delhaize dips {pct}; random check at the self-scan", "Ahold Delhaize slips {pct} as the hagelslag runs out"],
  },
  AEX: {
    up: ["AEX ETF up {pct}; 25 Dutch companies cycle uphill with ease", "AEX ETF gains {pct}, as direct and to the point as expected"],
    down: ["AEX ETF dips {pct}; Dutch investors call it “just a bit of weather”", "AEX ETF slips {pct} into a canal, climbs out, carries on"],
  },
  // --- Belgium ---
  AGS: {
    up: ["Ageas up {pct}; the gains are reportedly fully insured", "Ageas gains {pct} after a very thorough risk assessment"],
    down: ["Ageas dips {pct}; it's in the small print", "Ageas slips {pct} as an umbrella is forgotten on a Brussels tram"],
  },
  SOLB: {
    up: ["Solvay up {pct}; the chemistry is just right", "Solvay gains {pct} with a fizz of soda ash"],
    down: ["Solvay dips {pct}; the formula needs a pinch more salt", "Solvay slips {pct} after an over-enthusiastic beaker"],
  },
  DIE: {
    up: ["D'Ieteren up {pct}; a windscreen gets repaired just in time", "D'Ieteren gains {pct} as a car gets washed and immediately rained on, as tradition demands"],
    down: ["D'Ieteren dips {pct}; stuck on the Brussels ring road", "D'Ieteren slips {pct} after a stone chip, a small one"],
  },
  ELI: {
    up: ["Elia up {pct}; the grid hums contentedly", "Elia gains {pct} on a very windy day at sea"],
    down: ["Elia dips {pct}; somebody leaves the Christmas lights on in May", "Elia slips {pct} as the wind takes a coffee break"],
  },
  COLR: {
    up: ["Colruyt up {pct}; prices low, shares less so", "Colruyt gains {pct} after a perfectly packed shopping bag"],
    down: ["Colruyt dips {pct}; the till receipt was very long", "Colruyt slips {pct} as somebody forgets their shopping list"],
  },
  BMW: {
    up: ["BMW up {pct}; the stock indicates before overtaking, analysts stunned", "BMW gains {pct} with the sheer driving pleasure of a green candle"],
    down: ["BMW dips {pct}; parked in two spots at once", "BMW slips {pct} after the indicator stops working, as foretold"],
  },
  VOW3: {
    up: ["Volkswagen up {pct}; 10 brands agree on something for a change", "Volkswagen gains {pct} as the Beetle-shaped chart finds its feet"],
    down: ["Volkswagen dips {pct}; the meeting to align all the brands is still going", "Volkswagen slips {pct} while the sat-nav recalculates"],
  },
  DHL: {
    up: ["DHL up {pct}; the gains were delivered while you were out", "DHL gains {pct}, signed for by a neighbour"],
    down: ["DHL dips {pct}; we tried to deliver your profits but nobody was home", "DHL slips {pct}; parcel left “in a safe place”, location unknown"],
  },
  MUV2: {
    up: ["Munich Re up {pct}; insurance for insurers feeling very reassured", "Munich Re gains {pct} as somebody reinsures the reinsurance"],
    down: ["Munich Re dips {pct}; risk was taken, then re-taken", "Munich Re slips {pct} after a very long spreadsheet about rain"],
  },
  ZAL: {
    up: ["Zalando up {pct}; investors scream with joy, as the advert taught them", "Zalando gains {pct} after a shoe fits on the first try"],
    down: ["Zalando dips {pct}; 40% of the gains were returned free of charge", "Zalando slips {pct} after three sizes are ordered and two sent back"],
  },
  EOAN: {
    up: ["E.ON up {pct}; the meter spins in the right direction", "E.ON gains {pct} as somebody finally switches the heating off when leaving"],
    down: ["E.ON dips {pct}; a phone charger left plugged in all weekend", "E.ON slips {pct} on a low-wattage afternoon"],
  },
  HEN3: {
    up: ["Henkel up {pct}; the gains stick, as advertised", "Henkel gains {pct}; analysts call it “sticky growth”"],
    down: ["Henkel dips {pct}; the glue needs 24 hours to set", "Henkel slips {pct} after the laundry comes out pink"],
  },
  BAYN: {
    up: ["Bayer up {pct}; headache over, for now", "Bayer gains {pct} as the crop of buyers comes in"],
    down: ["Bayer dips {pct}; investors reach for the medicine cabinet", "Bayer slips {pct} on a cloudy day for crops"],
  },
  PRX: {
    up: ["Prosus up {pct}; owning bits of the internet pays off, again", "Prosus gains {pct} after a stake in a stake in a stake does well"],
    down: ["Prosus dips {pct}; the internet is having an off day", "Prosus slips {pct} as the org chart gets another arrow"],
  },
  WKL: {
    up: ["Wolters Kluwer up {pct}; tax season, but make it profitable", "Wolters Kluwer gains {pct}, footnoted and fully referenced"],
    down: ["Wolters Kluwer dips {pct}; somebody skipped the appendix", "Wolters Kluwer slips {pct} pending a review of the review"],
  },
  ASM: {
    up: ["ASM International up {pct}; layers deposited, gains deposited", "ASM International gains {pct}, one atom at a time"],
    down: ["ASM International dips {pct}; the layer was a single atom too thin", "ASM International slips {pct}; deposition is a slow art"],
  },
  BESI: {
    up: ["BE Semiconductor up {pct}; chips packed, gains bonded", "BESI gains {pct} as the hybrid bonding forms a hybrid bond with investors"],
    down: ["BESI dips {pct}; bubble wrap shortage suspected", "BESI slips {pct} after a chip is put in upside down, briefly"],
  },
  KPN: {
    up: ["KPN up {pct}; the Wi-Fi works upstairs too", "KPN gains {pct} with four bars in the polder"],
    down: ["KPN dips {pct}; the router is being turned off and on again", "KPN slips {pct} after a call drops in a tunnel under the IJ"],
  },
  NN: {
    up: ["NN Group up {pct}; pensions looking pensively happy", "NN Group gains {pct} for your 80-year-old self"],
    down: ["NN Group dips {pct}; future-you shrugs, it's a long game", "NN Group slips {pct}; actuaries remain calm, statistically"],
  },
  RAND: {
    up: ["Randstad up {pct}; hiring the right people pays", "Randstad gains {pct} as a temp becomes permanently profitable"],
    down: ["Randstad dips {pct}; the stock is between jobs", "Randstad slips {pct}; CV updated, interviews scheduled"],
  },
  UMG: {
    up: ["Universal Music up {pct}; the chart climbs the charts", "Universal Music gains {pct} on a catchy chorus"],
    down: ["Universal Music dips {pct}; the B-side didn't land", "Universal Music slips {pct}; the remix nobody asked for"],
  },
  LOTB: {
    up: ["Lotus Bakeries up {pct}; every coffee in Europe gets its little biscuit", "Lotus Bakeries gains {pct}; at this share price, the biscuit is the cheap part"],
    down: ["Lotus Bakeries dips {pct}; someone ate the biscuit before the coffee arrived", "Lotus Bakeries slips {pct} after the coffee comes without a biscuit"],
  },
  UMI: {
    up: ["Umicore up {pct}; recycled metals, recycled optimism", "Umicore gains {pct} as batteries recharge investor moods"],
    down: ["Umicore dips {pct}; battery at 12%, please connect a charger", "Umicore slips {pct}; the catalyst didn't catalyse"],
  },
  PROX: {
    up: ["Proximus up {pct}; signal found behind the sofa", "Proximus gains {pct} as Belgian Wi-Fi reaches the garden"],
    down: ["Proximus dips {pct}; buffering…", "Proximus slips {pct} while the technician arrives between 8:00 and 18:00"],
  },
  GBLB: {
    up: ["GBL up {pct}; holding companies holding up nicely", "GBL gains {pct} as its stakes enjoy a good steak dinner"],
    down: ["GBL dips {pct}; holding steady, slightly less", "GBL slips {pct} as one of its holdings has an off day"],
  },
  ARGX: {
    up: ["argenx up {pct}; Ghent lab celebrates with a coffee that's actually hot", "argenx gains {pct} after a very long and very careful meeting"],
    down: ["argenx dips {pct}; the lab's coffee machine is on strike", "argenx slips {pct} on a grey Ghent afternoon"],
  },
  BAR: {
    up: ["Barco up {pct}; the projector works on the first try", "Barco gains {pct}, displayed in glorious 4K"],
    down: ["Barco dips {pct}; nobody can find the right HDMI adapter", "Barco slips {pct} as the presenter says “can everyone see my screen?”"],
  },
  MELE: {
    up: ["Melexis up {pct}; sensors detect gains", "Melexis gains {pct}, measured to the millivolt"],
    down: ["Melexis dips {pct}; sensor reports “mild disappointment”", "Melexis slips {pct} after a calibration nap"],
  },
  BPOST: {
    up: ["bpost up {pct}; the letter arrived the same week", "bpost gains {pct}, delivered with a hand-written note"],
    down: ["bpost dips {pct}; your profits will be delivered between Monday and later", "bpost slips {pct}; card left: “sorry we missed you”"],
  },
  BEL20: {
    up: ["BEL 20 ETF up {pct}; 20 Belgian companies celebrate with fries and a compromise", "BEL 20 ETF gains {pct}; all three language communities agree for once"],
    down: ["BEL 20 ETF dips {pct}; it rained, it's Belgium", "BEL 20 ETF slips {pct} while a government is still being formed"],
  },
  BTC: {
    up: [
      "Bitcoin up {pct}; uncle at the barbecue says “I told you” four times",
      "Bitcoin climbs {pct}; laser eyes return to profile pictures worldwide",
    ],
    down: ["Bitcoin down {pct}; holders explain it's “a feature, not a bug”", "Bitcoin slips {pct}; somebody checks the old laptop for their password again"],
    any: ["Bitcoin {dir} {pct} because it is a day ending in “y”"],
  },
  ETH: {
    up: ["Ethereum up {pct}; someone explains smart contracts at a party and the room stays", "Ethereum gains {pct}; gas fees briefly forgiven"],
    down: ["Ethereum dips {pct}; gas fees blamed for something, as always", "Ethereum slips {pct} while an upgrade is “nearly ready”"],
  },
  SOL: {
    up: ["Solana up {pct}; holders say “fast” 14 times in one sentence", "Solana gains {pct} before you finish reading this headline"],
    down: ["Solana dips {pct}; holders say it's “just resting”", "Solana slips {pct}, very quickly, as advertised"],
  },
};

/** Fallback jokes per sector, for any asset in that sector. */
export const SECTOR_QUIPS: Record<string, string[]> = {
  Telecom: ["{name} {dir} {pct}; analysts say the move is “breaking up a bit, can you repeat”"],
  Chemicals: ["{name} {dir} {pct} in what lab staff call “a reaction”"],
  Energy: ["{name} {dir} {pct}; analysts describe the session as “high octane”"],
  Utilities: ["{name} {dir} {pct}, which for a utility is basically a rollercoaster"],
  "Health technology": ["{name} {dir} {pct} after a very long meeting about meetings"],
  Technology: [
    "{name} {dir} {pct}; IT suggests turning the stock off and on again",
    "{name} {dir} {pct} after a product launch with 11 uses of the word “seamless”",
  ],
  Semiconductors: [
    "{name} {dir} {pct}; chip analysts measure the move in nanometres",
    "{name} {dir} {pct} as the word “wafer” is said with a straight face again",
  ],
  Financials: [
    "{name} {dir} {pct}; spreadsheet cells turn {color} right on cue",
    "{name} {dir} {pct} after a quarterly meeting that could have been an email",
  ],
  Automotive: ["{name} {dir} {pct}; analysts say the stock “handles well in corners”", "{name} {dir} {pct} with the windows down"],
  "Consumer Staples": ["{name} {dir} {pct}; staples remain, as ever, staples", "{name} {dir} {pct} in what experts call “aggressively normal” trading"],
  Consumer: ["{name} {dir} {pct}; shoppers continue to shop", "{name} {dir} {pct} as a loyalty card reaches its tenth stamp"],
  Media: ["{name} {dir} {pct}; critics give the move three and a half stars", "{name} {dir} {pct}; plot twist reportedly “saw it coming”"],
  Luxury: ["{name} {dir} {pct}; the move was available by appointment only", "{name} {dir} {pct}, gracefully, in a very nice coat"],
  Industrials: ["{name} {dir} {pct} with engineering precision, to the third decimal", "{name} {dir} {pct}; the conveyor belt keeps conveying"],
  Healthcare: ["{name} {dir} {pct}; analysts prescribe “rest and fluids” for their spreadsheets", "{name} {dir} {pct} after a very long meeting about meetings"],
};
