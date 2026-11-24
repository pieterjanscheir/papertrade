/**
 * Learn tab content.
 *
 * Every lesson is presented as a "video", but there is no video: pressing play
 * shows a joke instead, and the real learning is in the written notes underneath.
 * The notes are genuine (if simplified) basics. The jokes are clearly jokes.
 *
 * One card in the advanced row links to a real Netflix title instead of a lesson
 * (`netflix`). It's meant to be found, not advertised: keep it unremarkable.
 */

export interface Quiz {
  question: string;
  options: string[];
  answer: number;
  explain: string;
}

export interface Lesson {
  id: string;
  title: string;
  /** Fake video length, purely decorative. */
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  /** Thumbnail: a glyph on a gradient. */
  glyph: string;
  hue: number;
  summary: string;
  /** What "plays" when you press play. */
  gag: string;
  notes: string[];
  keyPoints: string[];
  quiz?: Quiz;
  /** Longer lessons: notes split into titled chapters (shown after `notes`). */
  chapters?: { heading: string; body: string[] }[];
  /** Several quiz questions (shown after the single `quiz`, if any). */
  quizzes?: Quiz[];
  /** An interactive widget to embed in the lesson. */
  lab?: "options";
  /** Highlighted at the top of the Learn page. */
  featured?: boolean;
  /** Links out to Netflix instead of being a lesson. */
  netflix?: { title: string; url: string; blurb: string };
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  lessons: Lesson[];
}

export const COURSES: Course[] = [
  {
    id: "basics",
    title: "Start here",
    subtitle: "The basics, explained without a single Lamborghini",
    lessons: [
      {
        id: "what-is-a-stock",
        title: "What is a stock, really?",
        duration: "4:12",
        level: "Beginner",
        glyph: "🧩",
        hue: 210,
        summary: "Owning a tiny slice of a company, and why its price moves.",
        gag: "🎬 The presenter dropped the slide clicker into a cup of coffee at minute one. The remaining 4:11 is a man looking for a towel. The notes below are better.",
        notes: [
          "A share is a tiny piece of ownership in a company. Own one Apple share and you own a very, very small part of Apple, including a claim on its future profits.",
          "The price moves because buyers and sellers continuously agree on new prices. Good news, bad news, interest rates and plain mood all change what people are willing to pay.",
          "In the short run prices are noisy. Over long periods, they tend to follow how much money the company actually makes.",
        ],
        keyPoints: ["A share = partial ownership", "Price = what the last buyer and seller agreed on", "Short term: noise. Long term: profits"],
        quiz: {
          question: "You buy one share of a company. What do you own?",
          options: ["A loan to the company", "A tiny part of the company", "A coupon for its products"],
          answer: 1,
          explain: "Shares are ownership. Lending money to a company is a bond.",
        },
      },
      {
        id: "etfs",
        title: "ETFs: ordering the whole buffet",
        duration: "5:30",
        level: "Beginner",
        glyph: "🍱",
        hue: 150,
        summary: "Why one fund holding thousands of companies is a popular start.",
        gag: "🎬 This video was filmed at an actual buffet. It is 5 minutes and 30 seconds of the camera operator choosing between three types of potato salad.",
        notes: [
          "An ETF (exchange-traded fund) is a basket of investments you buy as one thing. A world ETF like VWCE holds thousands of companies across dozens of countries.",
          "Spreading money over many companies means one bad apple barely matters. That's diversification, and it's the main reason ETFs are a common first investment.",
          "ETFs charge a small yearly cost (often 0.1–0.3%). It sounds tiny, but compare it with other funds, because costs compound too.",
        ],
        keyPoints: ["One purchase, many companies", "Diversification lowers single-company risk", "Check the yearly cost"],
        quiz: {
          question: "Main benefit of a broad world ETF?",
          options: ["It can't go down", "It spreads risk over many companies", "It pays a fixed interest"],
          answer: 1,
          explain: "ETFs can and do fall, but one company's trouble matters much less.",
        },
      },
      {
        id: "candles",
        title: "Reading candlesticks without crying",
        duration: "6:05",
        level: "Beginner",
        glyph: "🕯️",
        hue: 30,
        summary: "Open, high, low, close: what each little bar on the chart means.",
        gag: "🎬 Our presenter tried to explain candlesticks using real candles. The fire alarm went off at 0:47. The fire brigade's explanation, honestly, was pretty good.",
        notes: [
          "Each candle covers one period (15 minutes, a day…). The thick body runs from the opening price to the closing price; the thin wicks show the highest and lowest price.",
          "Green means it closed higher than it opened; red means lower. Long wicks mean the price swung a lot but came back.",
          "In this app: switch an asset chart to Candles and hover to see O, H, L and C. Moving averages (MA 20/50) smooth out the noise.",
        ],
        keyPoints: ["Body = open to close", "Wicks = high and low", "Green up, red down"],
      },
      {
        id: "diversify",
        title: "Don't put all your eggs in one GPU",
        duration: "4:48",
        level: "Beginner",
        glyph: "🥚",
        hue: 50,
        summary: "Diversification, and why your best idea shouldn't be your only idea.",
        gag: "🎬 We put all our eggs in one basket to film this. Unfortunately we also put the basket on the edge of the table. The video ends abruptly at 0:31.",
        notes: [
          "If one investment is most of your portfolio, its bad day is your bad day. Spreading money over companies, sectors and regions smooths the ride.",
          "Check Home → Allocation to see how concentrated you are by asset, type and sector.",
          "Diversifying doesn't guarantee profit; it reduces the chance that a single surprise wrecks everything.",
        ],
        keyPoints: ["Concentration = bigger swings", "Spread over assets, sectors, regions", "Use the Allocation card"],
      },
    ],
  },
  {
    id: "orders",
    title: "Placing orders",
    subtitle: "Buttons, explained before you press them",
    lessons: [
      {
        id: "order-types",
        title: "Market, limit and stop orders",
        duration: "5:20",
        level: "Beginner",
        glyph: "🎛️",
        hue: 270,
        summary: "Buy now, buy at your price, or act when the price breaks a level.",
        gag: "🎬 The presenter placed a market order for coffee, a limit order for a cheaper coffee, and a stop order to leave if the meeting ran late. The video ends when the stop order triggers.",
        notes: [
          "Market order: buy or sell right now at the current price. Fast, but you take whatever the price is.",
          "Limit order: only at your price or better. A limit buy at €90 waits until the price is €90 or lower.",
          "Stop order: when the price crosses a level, trade at market. A stop sell below the current price is a classic stop-loss.",
          "Here, limit and stop orders even fill while the app is closed, at the minute they would have triggered.",
        ],
        keyPoints: ["Market = now", "Limit = my price or better", "Stop = act when a level breaks"],
        quiz: {
          question: "A stock is at €100. You want to sell automatically if it falls to €90. Which order?",
          options: ["Limit sell at €90", "Stop sell at €90", "Market sell"],
          answer: 1,
          explain: "A limit sell at €90 would fill immediately (€100 is better than €90). A stop sell waits for the drop.",
        },
      },
      {
        id: "fees",
        title: "Fees: the €1 that compounds",
        duration: "3:10",
        level: "Beginner",
        glyph: "🪙",
        hue: 90,
        summary: "Why small costs matter more when you trade often.",
        gag: "🎬 This video costs €1 to watch. Just kidding. The real cost is that it doesn't exist.",
        notes: [
          "Every trade here costs €1. On a €1,000 buy that's 0.1%; on a €20 buy it's 5%. Small, frequent trades get expensive fast.",
          "Activity shows your total fees paid. Trading less is often the cheapest strategy available.",
        ],
        keyPoints: ["Fee as % of trade size", "Frequent small trades add up", "Check Activity → Fees paid"],
      },
    ],
  },
  {
    id: "options",
    title: "Options, gently",
    subtitle: "Calls, puts and the ice cube of time decay",
    lessons: [
      {
        id: "options-deep-dive",
        title: "Options, explained properly",
        duration: "24:00",
        level: "Intermediate",
        glyph: "🧇",
        hue: 38,
        featured: true,
        summary: "The full tour: calls, puts, premiums, the Greeks and the traps. With waffles.",
        gag: "🎬 This was meant to be a 24-minute masterclass. The presenter got as far as “so a call option is a bit like a waffle…” and has been in the kitchen ever since. Luckily, they left very good notes.",
        notes: [
          "This is the long one. Grab a coffee (and, if you're in Belgium, a waffle). By the end you'll be able to read an options chain, work out what a trade can make or lose, and spot the most common ways people lose money with options.",
          "Throughout, we'll use Waffle Corp (WAFL), a completely made-up company currently trading at exactly €100 a share. Play with it in the Options Lab further down.",
        ],
        chapters: [
          {
            heading: "1. The whole idea in one sentence",
            body: [
              "An option is a contract that gives you the right, but not the obligation, to buy or sell something at a fixed price before a certain date. You pay for that right up front. That payment is the premium.",
              "Real-life version: you love a second-hand bike listed at €300. You give the seller €20 to hold it for you at €300 for a month. If a better bike shows up, you walk away and lose only the €20. If bike prices suddenly jump to €400, you still buy it at €300. That €20 reservation is an option.",
              "The person on the other side (the seller, or “writer”) keeps your €20 whatever happens, but must honour the deal if you want it.",
            ],
          },
          {
            heading: "2. Calls and puts",
            body: [
              "A call is the right to buy at the agreed price. You buy calls when you think the price will go up. A WAFL call with a €110 strike becomes valuable if WAFL climbs above €110.",
              "A put is the right to sell at the agreed price. You buy puts when you think the price will go down, or as insurance for shares you already own. A WAFL put with a €90 strike becomes valuable if WAFL falls below €90.",
              "Memory trick: you call someone up (calls like the price going up) and you put something down (puts like the price going down).",
            ],
          },
          {
            heading: "3. The five words on every option",
            body: [
              "Underlying: what the option is about (WAFL shares).",
              "Strike: the agreed price (say €105).",
              "Expiry: the last day the right exists (say the third Friday of next month).",
              "Premium: what you pay per share for the right (say €2.40).",
              "Contract size: how many shares one contract covers. Usually 100. So one contract at €2.40 costs €240. Here in Papertrade it's 100 for stocks and ETFs, and 1 for crypto.",
            ],
          },
          {
            heading: "4. In, at and out of the money",
            body: [
              "In the money: the option would be worth something if it expired right now. A call is in the money when the share price is above the strike; a put when the share price is below the strike.",
              "At the money: strike roughly equals the share price. Out of the money: it would expire worthless right now.",
              "The premium is made of two parts: intrinsic value (what it's worth if exercised right now) and time value (paying for the chance that things get better before expiry).",
              "Example: WAFL is €100. A call with a €95 strike costs €7. Its intrinsic value is €5 (100 − 95), so the other €2 is time value. An out-of-the-money call is pure time value: all hope, no substance.",
            ],
          },
          {
            heading: "5. What happens at expiry (the maths that matters)",
            body: [
              "At expiry, time value is gone. An option is then worth exactly its intrinsic value, or zero.",
              "Say you buy one WAFL call, strike €100, for €3 per share. That costs €300 (plus the €1 fee here). Your breakeven is strike + premium = €103.",
              "If WAFL ends at €110, the call is worth €10 per share = €1,000. Profit: €700, more than double your money. If WAFL ends at €102, it's worth €200: you lose €100 despite being “right” about the direction. If WAFL ends at €95, it's worth €0: you lose the full €300.",
              "Puts work in mirror image. A put with strike €100 bought for €4 breaks even at €96. At €90 it's worth €1,000 (profit €600). At €100 or above, you lose the €400.",
              "The golden rule for buyers: the most you can lose is the premium you paid. The Options Lab below draws this as a hockey-stick shaped line.",
            ],
          },
          {
            heading: "6. What moves the price before expiry: the Greeks",
            body: [
              "Options professionals describe price sensitivity with Greek letters. You only need four, and only roughly.",
              "Delta: how much the option moves when the share moves €1. A call with a delta of 0.30 gains about €0.30 per share (€30 per contract) when WAFL rises €1. Delta also works as a rough guess of the chance the option ends in the money.",
              "Theta: time decay. How much value the option loses per day if nothing happens. It speeds up in the final weeks, like an ice cube melting faster as it gets smaller. The trade sheet here shows it per day.",
              "Vega and implied volatility: options are pricier when big moves are expected. Before big news, premiums swell; after the news, they often collapse (“volatility crush”), even if the share moved your way.",
              "Gamma: how fast delta itself changes. It's highest for at-the-money options near expiry, which is why those can swing wildly.",
            ],
          },
          {
            heading: "7. Buying versus selling options",
            body: [
              "Buying an option: limited loss (the premium), potentially large gain, but you fight time decay every day.",
              "Selling (writing) an option: you collect the premium up front and time decay works for you, but you take on the obligation. Selling a call without owning the shares has, in theory, unlimited risk, because there's no ceiling on how high a price can go.",
              "That's why Papertrade only lets you buy options and sell the ones you own. Writing options with proper margin rules is a great hackathon challenge.",
            ],
          },
          {
            heading: "8. Four classic strategies (in one line each)",
            body: [
              "Protective put: own the shares, buy a put below the current price. Insurance against a big drop, paid for with the premium.",
              "Covered call: own the shares, sell a call above the current price. Extra income, but you give up gains above the strike.",
              "Straddle: buy a call and a put at the same strike. You profit from a big move in either direction, and lose if nothing happens.",
              "Spread: buy one option and sell another at a different strike. Cheaper than a single option, with capped profit and capped loss.",
            ],
          },
          {
            heading: "9. How people actually lose money with options",
            body: [
              "Lottery tickets: buying far out-of-the-money options because they're cheap. Cheap means unlikely. Most expire worthless. (Load “The Options Gambler” in Account to see this play out.)",
              "Ignoring time: being right about direction but too late. The option expired before the move came.",
              "Sizing too big: an option can go to zero in days. Only spend what you're fine losing completely.",
              "Buying right before big news: high implied volatility means you overpay, then the premium deflates after the announcement.",
            ],
          },
          {
            heading: "10. Try it yourself (with play money)",
            body: [
              "Open any stock, scroll to Options, and tap an ask price to open the trade sheet. Look at the payoff chart, the breakeven, delta and time decay before you buy.",
              "Then open the demo controls (Shift + D), jump a week ahead and watch the time value melt. Or trigger a Rally and see your call wake up.",
              "Congratulations: you now know more about options than most people who confidently talk about them at parties.",
            ],
          },
        ],
        keyPoints: [
          "An option is a right, not an obligation, bought for a premium",
          "Calls gain when prices rise, puts when prices fall",
          "Premium = intrinsic value + time value",
          "Breakeven for a bought call = strike + premium",
          "When buying, the maximum loss is the premium",
          "Time decay (theta) works against buyers, every day",
        ],
        lab: "options",
        quizzes: [
          {
            question: "You bought a put with strike €50. At expiry the stock is €42. What's the put worth per share?",
            options: ["€0", "€8", "€42"],
            answer: 1,
            explain: "A put lets you sell at €50 while the market price is €42: €50 − €42 = €8 per share.",
          },
          {
            question: "A call with strike €120 costs €6. Where is the breakeven at expiry?",
            options: ["€114", "€120", "€126"],
            answer: 2,
            explain: "For a bought call: strike + premium = €120 + €6 = €126.",
          },
          {
            question: "The stock goes nowhere for two weeks. What usually happens to an option you bought?",
            options: ["It gains value", "It loses value", "It stays exactly the same"],
            answer: 1,
            explain: "Time decay (theta): every day without a move, part of the time value disappears.",
          },
          {
            question: "A call has a delta of 0.60. The stock rises €2. Roughly what does one contract (100 shares) gain?",
            options: ["€60", "€120", "€200"],
            answer: 1,
            explain: "0.60 × €2 = €1.20 per share, × 100 shares = €120. Delta is an estimate, so “roughly”.",
          },
          {
            question: "Which position has a limited maximum loss?",
            options: ["Buying a call", "Selling a call without owning the shares", "Both"],
            answer: 0,
            explain: "A buyer can lose at most the premium. A naked call seller's loss has no ceiling.",
          },
        ],
      },
      {
        id: "calls-puts",
        title: "Calls and puts in plain English",
        duration: "7:45",
        level: "Intermediate",
        glyph: "📞",
        hue: 160,
        summary: "The right, but not the obligation, to buy or sell at a set price.",
        gag: "🎬 We tried to make a call about calls. It went to voicemail. The rest of the video is hold music.",
        notes: [
          "A call option gives you the right to buy the underlying at the strike price until expiry. It gains value when the price rises above the strike.",
          "A put option gives you the right to sell at the strike. It gains value when the price falls below the strike, so it's often used as insurance.",
          "You pay a premium for that right. When you buy an option, the most you can lose is that premium.",
          "Here, options are European-style and cash-settled: at expiry you simply receive the value, if any. 1 contract = 100 shares (1 unit for crypto).",
        ],
        keyPoints: ["Call = bet on up (right to buy)", "Put = bet on down / insurance (right to sell)", "Buyer's max loss = the premium"],
        quiz: {
          question: "You expect NVDA to rise a lot within a month. Which option fits?",
          options: ["Buy a put", "Buy a call", "Buy both and hope"],
          answer: 1,
          explain: "Calls gain when the price rises above the strike. Buying both is a real strategy (a straddle), but it bets on movement, not direction.",
        },
      },
      {
        id: "strike-expiry",
        title: "Premium, strike and expiry",
        duration: "6:30",
        level: "Intermediate",
        glyph: "🎯",
        hue: 200,
        summary: "How to read an option chain without your eyes glazing over.",
        gag: "🎬 The chain in this video was so long the presenter is still scrolling. We'll upload part 2 when they reach the bottom.",
        notes: [
          "Strike: the agreed price. Expiry: the date the right ends. Premium: what you pay per share for the right.",
          "In the money: a call with strike below the current price (or a put with strike above). It has intrinsic value. The chain shades these.",
          "Breakeven for a bought call = strike + premium. The trade sheet shows it, together with a payoff chart.",
          "Delta (Δ) roughly says how much the option price moves when the stock moves €1, and it's a rough guess at the chance of ending in the money.",
        ],
        keyPoints: ["Strike, expiry, premium", "In/out of the money", "Breakeven and delta"],
      },
      {
        id: "theta",
        title: "Time decay: the ice cube in your portfolio",
        duration: "4:15",
        level: "Intermediate",
        glyph: "🧊",
        hue: 190,
        summary: "Why an option loses value every day, even if nothing happens.",
        gag: "🎬 We filmed an ice cube to illustrate time decay. By the time we pressed record, it was a puddle. Which, to be fair, illustrates time decay.",
        notes: [
          "Part of an option's price is time value: the chance that something good happens before expiry. Every day that passes, there's less time left, so that value shrinks.",
          "This decay (theta) speeds up near expiry. The trade sheet shows the estimated loss per day.",
          "Try it: buy a short-dated option, then use the demo controls to jump a week ahead and watch it melt.",
        ],
        keyPoints: ["Time value shrinks daily", "Faster near expiry", "Theta = cost of waiting"],
      },
      {
        id: "expire-worthless",
        title: "Why so many options expire worthless",
        duration: "5:05",
        level: "Intermediate",
        glyph: "🎈",
        hue: 0,
        summary: "Being right isn't enough: you need to be right by enough, and in time.",
        gag: "🎬 This video expired before you could watch it. Fitting, really.",
        notes: [
          "To profit from a bought call, the price must rise above the breakeven before expiry, not just rise a little or rise next month.",
          "Out-of-the-money options are cheap because they usually expire at zero. Cheap isn't the same as good value.",
          "Size positions so that losing the whole premium is fine. That's the realistic worst case, and a common one.",
        ],
        keyPoints: ["Direction + size + timing", "Cheap options are cheap for a reason", "Only risk premiums you can lose"],
        quiz: {
          question: "You bought a call for €2 with strike €100. At expiry the stock is €101. Profit per share?",
          options: ["+€1", "−€1", "+€3"],
          answer: 1,
          explain: "Intrinsic value is €1 (101 − 100), minus the €2 premium = −€1. Right direction, not far enough.",
        },
      },
    ],
  },
  {
    id: "mindset",
    title: "Brain vs. market",
    subtitle: "The hardest part of investing sits between chair and keyboard",
    lessons: [
      {
        id: "fomo",
        title: "FOMO, and how to mute the group chat",
        duration: "4:40",
        level: "Beginner",
        glyph: "📱",
        hue: 320,
        summary: "Why buying because everyone else is buying feels great, briefly.",
        gag: "🎬 We started recording, but the presenter's phone buzzed 212 times with 🚀 emojis. They left to buy something. They have not come back.",
        notes: [
          "Fear of missing out pushes people to buy after big rises, which is often the most expensive moment.",
          "A simple rule helps: decide your plan before you look at today's movers, and write down why you're buying.",
          "Try the News tab: the headlines always sound sure of themselves. They're also always written after the move.",
        ],
        keyPoints: ["Big rises feel urgent", "Plan first, then look at prices", "Headlines explain moves after the fact"],
      },
      {
        id: "stop-loss",
        title: "Stop-losses: seatbelts, not crystal balls",
        duration: "3:55",
        level: "Intermediate",
        glyph: "🛟",
        hue: 20,
        summary: "Limiting damage, and why stops can fill below your price.",
        gag: "🎬 The crash-test dummy in this video was wearing a seatbelt and is fine. The camera was not.",
        notes: [
          "A stop sell below the current price limits how much you lose if things go wrong. It doesn't predict anything; it just acts.",
          "In a fast drop, the order fills at the next available price, which can be below your stop (slippage). Try a Flash dip in the demo controls to see it.",
        ],
        keyPoints: ["Stops limit damage", "They can fill below the stop", "Decide the level before you need it"],
      },
      {
        id: "compound",
        title: "Compound interest, explained by a snowball",
        duration: "3:33",
        level: "Beginner",
        glyph: "⛄",
        hue: 220,
        summary: "Returns on returns, and why time does the heavy lifting.",
        gag: "🎬 We rolled a snowball down a hill for this video. It's now considerably larger than the film crew and heading towards a village. We'll update you.",
        notes: [
          "If you earn 7% a year and reinvest it, next year you earn 7% on the larger amount. Over decades, that growth on growth becomes most of the total.",
          "Starting earlier usually matters more than picking the perfect moment.",
        ],
        keyPoints: ["Returns earn returns", "Time matters most", "Costs compound too"],
      },
    ],
  },
  {
    id: "masterclass",
    title: "Masterclass",
    subtitle: "Advanced techniques from people who definitely know what they're doing",
    lessons: [
      {
        id: "ruler",
        title: "Technical analysis with a ruler and hope",
        duration: "12:00",
        level: "Advanced",
        glyph: "📏",
        hue: 260,
        summary: "Draw enough lines on a chart and one of them will be right.",
        gag: "🎬 Twelve minutes of someone drawing lines on a chart until one matches what already happened. Inspiring stuff.",
        notes: [
          "Chart patterns can describe what traders did, but they predict far less than they seem to in hindsight.",
          "If you test a pattern, test it on data you didn't use to find it. The simulator's history is perfect for that.",
        ],
        keyPoints: ["Hindsight makes patterns look obvious", "Test on unseen data"],
      },
      {
        id: "case-study",
        title: "Case study: scaling a fintech, fast",
        duration: "6 parts",
        level: "Advanced",
        glyph: "🏦",
        hue: 0,
        summary: "What hypergrowth looks like from the inside.",
        gag: "",
        notes: [
          "If a company's growth looks too good to be true, ask boring questions: where does the money come from, and who checked?",
          "Hype is not an audit. Read the reports, not just the headlines.",
        ],
        keyPoints: ["Ask boring questions", "Hype is not an audit"],
        netflix: {
          title: "King of Stonks",
          url: "https://www.netflix.com/search?q=King%20of%20Stonks",
          blurb: "Plot twist: this isn't a lesson. It's King of Stonks, a Netflix comedy series about a fintech start-up that grows a little too fast. Consider it required viewing on what not to do.",
        },
      },
      {
        id: "tea-leaves",
        title: "Predicting the market with tea leaves",
        duration: "9:41",
        level: "Advanced",
        glyph: "🫖",
        hue: 120,
        summary: "An ancient technique with a track record roughly equal to most forecasts.",
        gag: "🎬 The tea leaves predicted the market would “go somewhere”. Technically correct. Ten out of ten.",
        notes: [
          "Short-term market forecasts are notoriously unreliable, whoever makes them. A plan that works without a forecast is more robust than one that needs one.",
        ],
        keyPoints: ["Forecasts are unreliable", "Prefer plans that don't need one"],
      },
      {
        id: "backtest",
        title: "Backtesting: time travel for spreadsheets",
        duration: "8:20",
        level: "Advanced",
        glyph: "⏳",
        hue: 40,
        summary: "Testing an idea on the past before betting on the future.",
        gag: "🎬 We backtested this video. In the past it got 10 million views. Results may vary.",
        notes: [
          "A backtest runs a rule on historical prices to see how it would have done. In this app, prices exist for any past moment via market.priceAt.",
          "Beware overfitting: a rule tuned to the past often fails in the future. Keep rules simple and include fees.",
        ],
        keyPoints: ["Test rules on history", "Include fees", "Beware overfitting"],
      },
    ],
  },
];

export const ALL_LESSONS = COURSES.flatMap((c) => c.lessons);
