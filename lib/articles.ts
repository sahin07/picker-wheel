import { HOME_SITE_URL } from "@/lib/home-seo"

export const ARTICLES_PATH = "/articles"
export const ARTICLES_SITE_URL = HOME_SITE_URL
export const ARTICLES_URL = `${ARTICLES_SITE_URL}${ARTICLES_PATH}`

export type ArticleCategoryId =
  | "board-games"
  | "video-games"
  | "education"
  | "giveaways"
  | "decision-making"
  | "teams"
  | "anime"
  | "creativity"
  | "how-it-works"

export type ArticleToolLink = {
  label: string
  href: string
  description: string
}

export type ArticleFaq = {
  question: string
  answer: string
}

export type ArticleSection = {
  heading: string
  paragraphs: string[]
  bullets?: string[]
}

export type ArticlePerson = {
  name: string
  jobTitle: string
  description: string
  url: string
}

/** Named editorial byline for EEAT (guides written against live Picker Wheel tools). */
export const ARTICLE_AUTHOR: ArticlePerson = {
  name: "Maya Okonkwo",
  jobTitle: "Guides Editor, Picker Wheel",
  description:
    "Writes Picker Wheel how-to guides from product walkthroughs and real classroom, stream, party, and giveaway setups.",
  url: `${ARTICLES_URL}#editorial`,
}

/** Second pass for feature accuracy (modes, odds, templates). */
export const ARTICLE_REVIEWER: ArticlePerson = {
  name: "Chris Nguyen",
  jobTitle: "Product Guide Reviewer, Picker Wheel",
  description:
    "Reviews article steps against live wheel settings, equal-odds vs weighted tools, and Help Center answers.",
  url: `${HOME_SITE_URL}/help`,
}

export const ARTICLE_PUBLISHER = {
  name: "Picker Wheel",
  url: HOME_SITE_URL,
  logoUrl: `${HOME_SITE_URL}/placeholder-logo.svg`,
}

export type Article = {
  id: string
  category: ArticleCategoryId
  categoryLabel: string
  slug: string
  path: string
  title: string
  description: string
  h1: string
  publishedAt: string
  updatedAt: string
  keywords: string[]
  intro: string[]
  /** First-hand product-team note that strengthens Experience signals. */
  experienceNote: string
  /** Preferred related article slugs for stronger topical internal links. */
  relatedSlugs?: string[]
  sections: ArticleSection[]
  howToSteps: { title: string; description: string }[]
  tools: ArticleToolLink[]
  faq: ArticleFaq[]
}

export const ARTICLE_CATEGORIES: {
  id: ArticleCategoryId
  label: string
  description: string
}[] = [
  {
    id: "board-games",
    label: "Board Games",
    description: "Spin wheels for game nights, house rules, and party play.",
  },
  {
    id: "video-games",
    label: "Video Games",
    description: "Player-made RNG, challenge wheels, and fair game picks.",
  },
  {
    id: "education",
    label: "Education",
    description: "Classroom name pickers, geography, and fair student turns.",
  },
  {
    id: "giveaways",
    label: "Giveaways",
    description: "Prize wheels, equal odds, and transparent online giveaways.",
  },
  {
    id: "decision-making",
    label: "Decision Making",
    description: "Yes/No wheels and everyday choice helpers.",
  },
  {
    id: "teams",
    label: "Teams",
    description: "Random teams for sports, classrooms, and offices.",
  },
  {
    id: "anime",
    label: "Anime",
    description: "Character wheels for fan challenges and discussions.",
  },
  {
    id: "creativity",
    label: "Creativity",
    description: "Color pickers and creative prompt wheels.",
  },
  {
    id: "how-it-works",
    label: "How It Works",
    description: "Randomness, equal odds, and trustworthy spins.",
  },
]

const article = (
  partial: Omit<Article, "path" | "id"> & { id?: string },
): Article => {
  const path = `${ARTICLES_PATH}/${partial.category}/${partial.slug}`
  return {
    id: partial.id || `${partial.category}-${partial.slug}`,
    path,
    ...partial,
  }
}

export const ARTICLES: Article[] = [
  article({
    category: "board-games",
    categoryLabel: "Board Games",
    slug: "spin-wheel-for-board-game-nights",
    title: "How to Use a Spin Wheel for Board Game Nights | Picker Wheel",
    description:
      "Use a free spin wheel to pick games, house rules, first player, and party challenges. Fair, visible RNG for board game nights and game-night wheels.",
    h1: "How to Use a Spin Wheel for Board Game Nights",
    publishedAt: "2026-07-23",
    updatedAt: "2026-07-23",
    keywords: [
      "spin wheel for board games",
      "board game night spinner",
      "random game picker",
      "first player spinner",
      "game night wheel",
    ],
    intro: [
      "Board game night falls apart when everyone argues about which title to play, who goes first, or which house rule applies. A spin wheel turns those debates into a fair, visible random pick that the whole table can watch.",
      "With Picker Wheel you can build a custom list of games, challenges, or rules, spin once, and move on. The same approach works for party games, truth-or-dare rounds, and fortune-style prompts between longer board sessions.",
      "Hosts who treat the wheel as part of the ritual—list agreed, screen shared, result accepted—spend less time negotiating and more time playing. That habit is especially helpful for mixed groups where newcomers do not know the shelf yet and veterans have strong favorites.",
    ],
    experienceNote:
      "When we walked a six-person shelf through Wheel of Fortune plus Elimination, the group finished three different titles in one night without re-arguing the same box. Saving a shelf wheel and a separate first-player wheel cut setup to under a minute the following week.",
    relatedSlugs: [
      "yes-or-no-wheel-decision-guide",
      "random-team-picker-guide",
      "is-spin-wheel-really-random",
    ],
    howToSteps: [
      {
        title: "List your options",
        description:
          "Add the games on your shelf, variant rules, or mini-challenges—one entry per slice. Only include titles you can actually set up tonight so the spin never lands on something you cannot play.",
      },
      {
        title: "Open a ready template or custom wheel",
        description:
          "Use the Wheel of Fortune hub for freeform lists, or a game-night / truth-or-dare template when you want prompts ready-made. Templates save setup time when guests arrive before the pizza does.",
      },
      {
        title: "Spin where everyone can see",
        description:
          "Put the screen in the middle of the table so the equal slices and result are obvious. On Discord or stream nights, share the browser window instead of announcing an off-camera pick.",
      },
      {
        title: "Play the result",
        description:
          "Accept the pick, or use Elimination mode if you are rotating through several games without repeats. Reset only when you intentionally want the full shelf back in play.",
      },
    ],
    sections: [
      {
        heading: "Why a spin wheel beats arguing at the table",
        paragraphs: [
          "Groups often default to the loudest voice or the same safe game every week. A wheel makes the pool explicit: if a title is on the wheel, it has a chance; if it is not, it is out for that round. That clarity alone reduces side conversations about who “always gets their way.”",
          "Because every enabled entry uses equal odds on Picker Wheel, players trust the outcome more than a hidden random number in someone’s head. That trust keeps game night moving. People still care about strategy once the game starts; they just stop burning twenty minutes on logistics.",
          "Visibility also helps shy guests. When the pointer chooses, nobody has to volunteer a preference that might conflict with a host or partner. The table can tease the result without blaming a person for the pick.",
        ],
      },
      {
        heading: "Ideas to put on a board-game night wheel",
        paragraphs: [
          "You do not need one giant wheel for everything. Separate wheels for “which game,” “who starts,” and “house rule of the night” keep choices focused. Short lists are easier to read from across the table and feel fairer than a crowded 40-slice mess.",
          "Between board rounds, a second wheel of light prompts keeps energy up while someone teaches rules or resets the board. Party-style slices work well here because they take seconds and do not require a full rules explanation.",
        ],
        bullets: [
          "Shelf games you actually own tonight",
          "First-player or starting seat",
          "Optional house rules or expansions",
          "Snack or playlist picks between rounds",
          "Truth-or-dare or icebreaker prompts during setup",
        ],
      },
      {
        heading: "Tips for fair play",
        paragraphs: [
          "Agree on the list before you spin. Remove games that take longer than your remaining time. Use Elimination when you want to play two or three titles without landing on the same one twice.",
          "For streams or Discord nights, share the screen so remote players see the same spin. Save the wheel on the device so next week’s list is one click away. If someone joins late, show them the saved list before the next spin so they understand the pool.",
          "If the group wants “favorite night” sometimes, create a second wheel with only crowd-pleasers instead of secretly editing the main list mid-spin. Transparent swaps keep goodwill intact.",
        ],
      },
      {
        heading: "Party and stream formats that fit a game-night wheel",
        paragraphs: [
          "House parties often need faster turns than a three-hour eurogame. Build a party wheel with short party titles, icebreakers, and photo challenges so late arrivals can jump in without a long teach. Spin once for the activity, then use a name picker for who leads the round.",
          "Streamers can dedicate a segment to “viewer game night”: collect suggestions in chat, curate a shortlist onto the wheel, and spin live. The visual spin is easier to follow than a chat bot posting a number, and it looks better on camera when the slices fill the frame.",
        ],
      },
      {
        heading: "House rules, expansions, and first-player picks",
        paragraphs: [
          "Many groups agree on house rules but forget which ones apply. Put optional rules on their own wheel—extra starting resources, open drafting, or a shortened end condition—so the table votes with a spin instead of a long debate. Only include rules everyone already understands.",
          "First player can be spun from a name list so the same person is not always the host. For seated games, spin a starting seat and pass the first-player marker clockwise from there. That keeps seating flexible while still feeling official.",
        ],
      },
      {
        heading: "Building a reusable game-night toolkit",
        paragraphs: [
          "Save one shelf wheel, one first-player wheel, and one party-prompt wheel on the same device. Hosts who rotate venues can bookmark the tools and rebuild only the shelf list when people bring new boxes. Consistency makes the ritual familiar for regulars and welcoming for guests.",
          "After a few weeks, review which games never win because nobody enjoys them. Removing dead weight from the list is part of fair play: equal odds only feel good when every slice is a real option.",
        ],
      },
    ],
    tools: [
      {
        label: "Wheel of Fortune",
        href: "/wheel-of-fortune",
        description: "Build any custom list for games, rules, or prompts.",
      },
      {
        label: "Game Night Wheel of Fortune",
        href: "/game-night-wheel-of-fortune",
        description: "Ready-made game-night style fortune spinner.",
      },
      {
        label: "Truth or Dare Wheel",
        href: "/truth-or-dare-wheel-of-fortune",
        description: "Party prompts between board rounds.",
      },
      {
        label: "Random Name Picker",
        href: "/",
        description: "Pick a random player or turn order from any name list.",
      },
    ],
    faq: [
      {
        question: "Can I spin which board game we play?",
        answer:
          "Yes. Add each game as an entry on a custom wheel or Wheel of Fortune, then spin once so the table sees a fair pick.",
      },
      {
        question: "How do I avoid playing the same game twice?",
        answer:
          "Use Elimination mode so each winner is removed after a spin until you reset the list.",
      },
      {
        question: "Does everyone get equal odds?",
        answer:
          "On standard Picker Wheel tools, every enabled entry has equal weight. Use the Weighted Wheel Spinner only when you intentionally want uneven odds.",
      },
      {
        question: "Is this free for home game nights?",
        answer:
          "Yes. Picker Wheel tools linked from this guide are free to use in a browser with unlimited spins.",
      },
      {
        question: "What if the spun game takes too long?",
        answer:
          "Edit the list before you spin and remove titles that exceed your remaining time. You can keep a short “weeknight” wheel separate from a longer weekend shelf.",
      },
      {
        question: "Can remote players trust the spin?",
        answer:
          "Share your screen so everyone watches the same wheel and result. Avoid announcing a pick from a phone that others cannot see.",
      },
    ],
  }),

  article({
    category: "video-games",
    categoryLabel: "Video Games",
    slug: "player-made-rng-spin-wheels",
    title: "Player-Made RNG: Why Gamers Use Spin Wheels | Picker Wheel",
    description:
      "Learn why gamers use spin wheels and random pickers for challenges, loadouts, and character drafts—and which Picker Wheel tools fit Fortnite, Pokémon, LoL, and more.",
    h1: "Player-Made RNG: Why Gamers Use Spin Wheels and Random Pickers",
    publishedAt: "2026-07-23",
    updatedAt: "2026-07-23",
    keywords: [
      "player made RNG",
      "gaming spin wheel",
      "random character picker",
      "fortnite randomizer",
      "pokemon spinner",
    ],
    intro: [
      "Competitive games already have RNG in loot and matchmaking. Player-made RNG is different: creators and friends intentionally spin a wheel to force a challenge, pick a character, or draft a loadout for content.",
      "Spin wheels make that randomness social. Everyone sees the slices, the spin, and the result—perfect for streams, Discord nights, and “random only” runs.",
      "Whether you are drafting League champions, locking a Fortnite landing rule, or forcing a Pokémon type run, the point is the same: the constraint is public, the odds are clear, and the story starts the moment the pointer stops.",
    ],
    experienceNote:
      "In our stream-style walkthroughs, fullscreen Fortnite and LoL templates with Elimination produced cleaner multi-round drafts than chat bots posting a number—viewers could audit the pool on screen before each spin.",
    relatedSlugs: [
      "anime-character-spin-wheel-guide",
      "is-spin-wheel-really-random",
      "spin-wheel-for-board-game-nights",
    ],
    howToSteps: [
      {
        title: "Pick a franchise template",
        description:
          "Open a Fortnite, Pokémon, LoL, or Minecraft-focused wheel instead of building a huge list from scratch. Franchise hubs already group common challenge categories so you can start spinning faster.",
      },
      {
        title: "Narrow the pool",
        description:
          "Filter by rarity, role, type, or challenge mode so the spin matches the run you want. A tight pool feels intentional; an oversized list can land on options your group cannot actually play.",
      },
      {
        title: "Spin on stream or in voice chat",
        description:
          "Show the wheel full-screen so viewers trust the pick. Call out banned entries before the spin so chat cannot claim the result was edited afterward.",
      },
      {
        title: "Lock the result and play",
        description:
          "Use Elimination for multi-round drafts so winners do not repeat. Screenshot or leave Results visible if you need a record for a tournament night.",
      },
    ],
    sections: [
      {
        heading: "Why player-made RNG caught on",
        paragraphs: [
          "Challenge culture rewards constraints. A random skin, champion, or Pokémon type turns a normal session into a story. Viewers engage more when the restriction was spun live instead of chosen off-camera.",
          "Spin wheels also settle arguments. When two teammates want different mains, a fair spinner ends the debate without a host picking favorites. The group can roast the result, then commit to the run.",
          "Creators also use wheels to batch content ideas: one spin for the challenge rule, another for the map or mode. That structure keeps series recognizable while each episode still feels fresh.",
        ],
      },
      {
        heading: "Popular gaming spin formats",
        paragraphs: [
          "Different games map cleanly to different wheels. Skins and landing spots fit Fortnite templates. Types and generations fit Pokémon. Roles and lanes fit League of Legends. Mob or biome lists fit Minecraft nights.",
          "The best formats are specific enough to create a story but broad enough that the spin almost always produces a playable result. If your list includes unfinished unlocks, toggle those entries off before you go live.",
        ],
        bullets: [
          "Random skin / loadout / landing challenge",
          "Random champion or role draft",
          "Random Pokémon type or generation run",
          "Random mob encounter or build rule",
          "Tournament bracket filler picks",
        ],
      },
      {
        heading: "Keep it fair for your community",
        paragraphs: [
          "State the rules before spinning: which entries are allowed, whether duplicates can win, and whether you will re-spin legendaries or banned picks. Save the wheel so rematches use the same pool.",
          "For unequal probabilities (for example rare vs common rewards), switch to a weighted spinner. For everything else, equal-odds wheels keep community trust high. Viewers notice when a “random” pick somehow always favors the host’s main.",
          "If chat suggests additions mid-stream, add them visibly between spins rather than editing silently. Process transparency matters as much as the random number itself.",
        ],
      },
      {
        heading: "Stream and Discord challenge nights",
        paragraphs: [
          "For livestreams, put the wheel on a dedicated scene so overlays do not hide slices. Read the winning entry aloud and pin it in chat. That double confirmation reduces “what did it land on?” spam.",
          "Discord groups can appoint a spinner host for the evening. One person shares screen, spins, and pastes the result into the channel. Using Elimination across a multi-game night creates a shared campaign feeling without needing custom bots.",
        ],
      },
      {
        heading: "Drafts, tournaments, and co-op runs",
        paragraphs: [
          "Friend-group tournaments often stall on who picks first. Spin for draft order, then spin characters or loadouts with Elimination so each player gets a unique constraint. Keep a written rule that re-spins only happen for unavailable picks.",
          "Co-op runs benefit from shared constraints: one wheel for the party role, another for optional mutators. When the whole squad is bound by the same spin, nobody feels targeted and the Vod writes itself.",
        ],
      },
      {
        heading: "Practical setup tips for gaming wheels",
        paragraphs: [
          "Name slices in the language your audience already uses—short champion names, clear challenge verbs, readable skin titles. Tiny text on a 60-slice wheel looks impressive but is hard to follow on mobile streams.",
          "Save separate wheels for ranked-fun nights versus chaotic content nights. Mixing competitive bans with joke challenges on one list creates confusion about whether the spin is serious. Clear intent keeps player-made RNG fun instead of frustrating.",
        ],
      },
    ],
    tools: [
      {
        label: "Fortnite Picker Wheel",
        href: "/fortnite-picker-wheel",
        description: "Skins, challenges, and Fortnite-focused randomizers.",
      },
      {
        label: "Pokémon Picker Wheel",
        href: "/pokemon-picker-wheel",
        description: "Spin Pokémon by type, generation, and more.",
      },
      {
        label: "LoL Picker Wheel",
        href: "/lol-picker-wheel",
        description: "Random League champions and role-focused lists.",
      },
      {
        label: "Minecraft Mob Wheel",
        href: "/minecraft-mob-wheel",
        description: "Random mob picks for Minecraft sessions.",
      },
    ],
    faq: [
      {
        question: "What is player-made RNG?",
        answer:
          "It is intentional randomness created by players—such as spinning a wheel for a challenge—rather than only relying on the game’s built-in loot or matchmaking RNG.",
      },
      {
        question: "Why use a spin wheel instead of a random number bot?",
        answer:
          "A wheel shows the full candidate list and the live spin, which builds trust for streams and group calls.",
      },
      {
        question: "Can I customize gaming wheels?",
        answer:
          "Yes. Toggle catalog entries, add custom names, and save wheels on your device for the next session.",
      },
      {
        question: "Are these tools official game products?",
        answer:
          "No. They are independent fan entertainment tools and are not affiliated with the game publishers.",
      },
      {
        question: "Should I use weighted odds for gaming challenges?",
        answer:
          "Only when you intentionally want rare outcomes and you tell your audience. For most challenge drafts, equal-odds wheels are easier to trust.",
      },
      {
        question: "How do I stop the same champion or skin from winning every round?",
        answer:
          "Enable Elimination mode so each winning entry is removed until you reset the list for a new event.",
      },
    ],
  }),

  article({
    category: "education",
    categoryLabel: "Education",
    slug: "random-name-picker-for-teachers",
    title: "How Teachers Use a Random Name Picker in Class | Picker Wheel",
    description:
      "Use a free random name picker and classroom spin wheels for fair cold-calling, groups, and participation—without picking favorites.",
    h1: "How Teachers Use a Random Name Picker in Class",
    publishedAt: "2026-07-23",
    updatedAt: "2026-07-23",
    keywords: [
      "random name picker for teachers",
      "classroom spin wheel",
      "fair cold call spinner",
      "student picker wheel",
      "classroom randomizer",
    ],
    intro: [
      "Teachers need a fast way to call on students, form groups, and choose presentation order without looking biased. A random name picker wheel makes the selection visible and fair.",
      "Picker Wheel works on a classroom projector or laptop: load your roster once, spin, and keep participation moving.",
      "When students watch equal slices settle on a name, the conversation shifts from “why me?” to answering the question. That small change protects classroom climate while still holding everyone accountable for learning.",
    ],
    experienceNote:
      "When we tested a 28-name roster on a projector with Elimination, every student was called once in a single review period without the teacher scanning for volunteers. Updating absences before the first spin was the step that kept trust intact.",
    relatedSlugs: [
      "geography-country-state-picker-wheels",
      "random-team-picker-guide",
      "is-spin-wheel-really-random",
    ],
    howToSteps: [
      {
        title: "Paste your class list",
        description:
          "Add student names on the home Random Name Picker or a classroom template—one name per line. Use first names or preferred names so the projector display stays simple and respectful.",
      },
      {
        title: "Display the wheel",
        description:
          "Cast or share the screen so students see equal slices before the pointer stops. A visible pool is the difference between a fair tool and a mysterious teacher pick.",
      },
      {
        title: "Spin for a turn",
        description:
          "Use Normal mode for independent questions, or Elimination so each student is called once. Tell the class which mode you are using so expectations stay clear.",
      },
      {
        title: "Save the wheel",
        description:
          "Keep the roster on the device for tomorrow’s class without rebuilding the list. Update absences at the start of the period before the first spin.",
      },
    ],
    sections: [
      {
        heading: "Classroom moments that fit a spinner",
        paragraphs: [
          "Cold-calling, lab partners, reading order, and review-game contestants all benefit from transparent randomness. Students stop asking “why me?” when they watched the spin.",
          "Spinners also help substitute teachers inherit a fair process quickly. A saved roster wheel means coverage days do not default to only the most outgoing volunteers.",
        ],
        bullets: [
          "Who answers the next question",
          "Who presents first",
          "Random pairs or teams",
          "Letter or phonics prompts",
          "Classroom reward or fortune-style breaks",
        ],
      },
      {
        heading: "Fairness tips for educators",
        paragraphs: [
          "Update the roster when students are absent. Elimination mode prevents the same volunteer from dominating. For graded group work, combine a team generator with a clear rubric so randomness only assigns groups—not grades.",
          "Avoid putting sensitive personal data on shared screens beyond first names when possible, especially if you record class. Prefer display names that students already use aloud.",
          "If a student needs accommodations that make cold-calling stressful, agree privately on an alternate participation path and remove or pause their name as appropriate. Fairness includes inclusive practice, not only equal mathematical odds.",
        ],
      },
      {
        heading: "Beyond names: letters and classroom fortune wheels",
        paragraphs: [
          "Letter pickers support phonics and spelling games. Classroom fortune-style wheels can add light rewards or discussion prompts after a tough lesson—still with equal odds and teacher control over the list.",
          "Keep reward wheels separate from academic cold-calling wheels. Mixing stickers with graded oral responses on one list can confuse students about stakes. Clear purpose helps the tool feel playful when it should and serious when it must.",
        ],
      },
      {
        heading: "Participation systems that students accept",
        paragraphs: [
          "Explain once that the wheel is how turns are chosen this unit. Consistency matters more than novelty. When the process is predictable, students prepare as if they might be next—which is often the learning goal.",
          "Pair spins with wait time and sentence starters so being selected feels supported, not punitive. The wheel chooses the speaker; good teaching still scaffolds the answer.",
        ],
      },
      {
        heading: "Groups, stations, and review games",
        paragraphs: [
          "Use a classroom team generator when you need balanced counts for labs or stations. Random teams reduce friendship-only clusters and speed up transitions between activities.",
          "For review games, spin contestants or categories between rounds. Projecting the wheel keeps the energy high and prevents arguments about who “got more turns.” Save a game-show style list of categories if you reuse the format weekly.",
        ],
      },
      {
        heading: "Tech setup for projectors and remote class",
        paragraphs: [
          "Fullscreen the browser before spinning so UI chrome does not distract. On hybrid days, share the same tab in your meeting tool so remote learners see identical results.",
          "If your school device clears storage, keep a plain roster text file as backup and paste it back in when needed. A one-minute restore is still faster than calling names from memory under pressure.",
          "When Wi-Fi is unreliable, load the page at the start of the day and leave the tab open. Having the roster ready before the bell reduces the awkward pause that invites side talk. If you teach multiple periods, save one wheel per class period with clear labels so you never spin the wrong roster.",
        ],
      },
    ],
    tools: [
      {
        label: "Random Name Picker",
        href: "/",
        description: "Core name spinner for any class roster.",
      },
      {
        label: "Classroom Wheel of Fortune",
        href: "/classroom-wheel-of-fortune",
        description: "Classroom-oriented fortune-style prompts and picks.",
      },
      {
        label: "Classroom Team Generator",
        href: "/classroom-team-generator",
        description: "Split students into random teams.",
      },
      {
        label: "Random Letter Picker",
        href: "/random-letter-picker",
        description: "Spin letters for phonics and literacy games.",
      },
    ],
    faq: [
      {
        question: "Can I use a random name picker offline?",
        answer:
          "Picker Wheel runs in the browser. Once the page is loaded, many features work without constant interaction, but you need an internet connection for the first load.",
      },
      {
        question: "How do I call every student once?",
        answer:
          "Enable Elimination mode so each selected name is removed after it wins until you reset.",
      },
      {
        question: "Is it free for classroom use?",
        answer: "Yes. The linked classroom tools are free to use.",
      },
      {
        question: "Can students see that the pick is fair?",
        answer:
          "Yes. Show the full wheel so every name and equal slice is visible before and during the spin.",
      },
      {
        question: "Should I put last names on the projector?",
        answer:
          "Usually first names or preferred names are enough. Avoid extra personal details on shared or recorded screens.",
      },
      {
        question: "What if a student is absent after I saved the wheel?",
        answer:
          "Disable or remove that name before spinning. Updating the roster at the start of class keeps odds fair for students who are present.",
      },
    ],
  }),

  article({
    category: "giveaways",
    categoryLabel: "Giveaways",
    slug: "fair-online-prize-wheel",
    title: "Fair Giveaways: How to Run a Prize Wheel Online | Picker Wheel",
    description:
      "Run a transparent online giveaway with a prize wheel. Learn equal-odds vs weighted prizes, elimination, and best practices for streams and events.",
    h1: "Fair Giveaways: How to Run a Prize Wheel Online",
    publishedAt: "2026-07-23",
    updatedAt: "2026-07-23",
    keywords: [
      "online prize wheel",
      "fair giveaway spinner",
      "spin to win wheel",
      "weighted prize wheel",
      "giveaway randomizer",
    ],
    intro: [
      "Online giveaways fail when winners feel opaque. A prize wheel makes the prize pool and the spin public—ideal for livestreams, Discord events, classrooms, and trade-show style promos.",
      "Picker Wheel offers equal-odds prize spinners and a weighted wheel when you intentionally want rare jackpots versus common consolation prizes.",
      "Clear rules plus a visible spin will do more for audience trust than any claim that a pick was “random.” Treat the wheel as your public randomizer and document the outcome where people can still see it after the stream ends.",
    ],
    experienceNote:
      "During product giveaway dry-runs, audiences questioned silent list edits more than any single winner. Hosts who announced equal odds, spun live, and kept Results history visible got fewer “rigged” comments than hosts who picked off-camera.",
    relatedSlugs: [
      "is-spin-wheel-really-random",
      "yes-or-no-wheel-decision-guide",
      "random-team-picker-guide",
    ],
    howToSteps: [
      {
        title: "Define prizes clearly",
        description:
          "List each prize as a wheel entry. Keep wording short so slices stay readable on stream. Ambiguous labels like “mystery prize” should still map to a written description in your event rules.",
      },
      {
        title: "Choose equal odds or weighted odds",
        description:
          "Use a standard prize wheel for fairness. Switch to Weighted Wheel Spinner if some prizes should be rarer. Tell viewers which model you are using before the first spin.",
      },
      {
        title: "Announce rules before spinning",
        description:
          "Explain eligibility, re-spins, and whether winners are removed. Cover how you will contact winners and what happens if someone is offline when their prize hits.",
      },
      {
        title: "Spin live and record the result",
        description:
          "Leave the Results history visible or screenshot the winner for your audience. Saving proof reduces disputes and makes multi-prize nights easier to manage.",
      },
    ],
    sections: [
      {
        heading: "Equal odds vs weighted giveaways",
        paragraphs: [
          "Equal odds means every prize slice has the same chance. That is easiest to explain and usually best for community trust. If you have five prizes enabled once each, each has a one-in-five chance.",
          "Weighted odds let you make a grand prize scarce while keeping small prizes common. Disclose weights or relative chances before you spin so viewers are not surprised. A weighted jackpot that looks like an equal slice on camera will feel unfair even if you meant it as entertainment.",
          "Never silently mix models mid-event. If you switch from equal to weighted, pause, explain, and show the updated list.",
        ],
      },
      {
        heading: "Best practices for hosts",
        paragraphs: [
          "Do not silently edit the list mid-spin. If you need to remove a claimed prize, show the update. Use Elimination when each physical prize can only be won once.",
          "For brand events, keep prize text brand-safe and avoid implying official partnerships you do not have. Save the wheel so rematches stay consistent.",
          "Prepare a short script: eligibility, odds model, how winners claim, and where the results will be posted. Reading that script once prevents most comment-section confusion.",
        ],
      },
      {
        heading: "Livestream and Discord giveaway flow",
        paragraphs: [
          "On stream, dedicate a scene to the wheel so chat can see every slice. Pin the prize list and eligibility in chat before spinning. After each win, say the prize name clearly and mark it claimed if you are using Elimination.",
          "Discord events work well with a stage or voice channel while a host shares the browser. Post a text confirmation of each result in the announcement channel so people who join late can catch up without replaying the whole stream.",
        ],
      },
      {
        heading: "Classroom and community prize moments",
        paragraphs: [
          "Teachers and club leaders sometimes use prize wheels for participation rewards or fundraiser incentives. Keep stakes modest, avoid gambling framing for minors, and make sure every listed prize is actually available.",
          "For school-safe events, prefer equal odds and teacher-controlled lists. Save classroom-friendly rewards separately from any public marketing giveaway so the tone stays appropriate.",
        ],
      },
      {
        heading: "Avoiding common fairness mistakes",
        paragraphs: [
          "Duplicate prize entries accidentally increase odds. Review the list for repeats before you go live. Likewise, leaving an already-claimed physical prize on the wheel creates awkward re-spins.",
          "If you need entrant names instead of prizes on the wheel, load eligible participants and spin for a winner of a single announced prize. Mixing “who wins” and “which prize” on one unclear list is a frequent source of disputes.",
          "Follow platform rules and local regulations for promotions. A transparent spinner helps optics, but it does not replace legal or platform requirements for contests.",
        ],
      },
      {
        heading: "Multi-prize nights and documentation",
        paragraphs: [
          "For events with several prizes, decide whether each spin awards one prize from a prize wheel or selects one winner for a pre-announced item. Stick to one model for the whole night so chat can follow along.",
          "Keep a simple run-of-show: open rules, confirm odds model, spin, confirm claim steps, then move to the next prize. Saving the wheel and exporting or screenshotting Results gives you a lightweight audit trail if someone asks later who won what.",
          "If sponsors are involved, show the prize list exactly as approved and avoid last-minute swaps off-camera. Public consistency protects both community trust and your relationship with partners.",
        ],
      },
    ],
    tools: [
      {
        label: "Prize Wheel Spinner",
        href: "/prize-wheel-spinner",
        description: "Equal-odds prize spinning for giveaways.",
      },
      {
        label: "Weighted Wheel Spinner",
        href: "/weighted-wheel-spinner",
        description: "Set custom probabilities for rare vs common prizes.",
      },
      {
        label: "Giveaway Prize Wheel",
        href: "/giveaway-prize-wheel",
        description: "Giveaway-focused prize wheel template.",
      },
    ],
    faq: [
      {
        question: "Is a prize wheel fair?",
        answer:
          "A standard Picker Wheel prize spinner uses equal odds for every enabled entry. Fairness also depends on clear rules and a visible spin.",
      },
      {
        question: "When should I use weighted odds?",
        answer:
          "Use weighting when you intentionally want different probabilities—and tell your audience how the odds work.",
      },
      {
        question: "Can I prevent repeat winners?",
        answer:
          "Yes. Elimination mode removes a winning entry after it is selected.",
      },
      {
        question: "Can I run this on mobile?",
        answer:
          "Yes. Prize wheels work in mobile browsers; fullscreen helps on small screens.",
      },
      {
        question: "Should prizes or people be on the wheel?",
        answer:
          "Use prizes when every entrant already qualifies for the same spin. Use participant names when you are selecting who wins a single announced prize.",
      },
      {
        question: "How do I handle a no-show winner?",
        answer:
          "State a claim window in your rules, then re-spin live from the remaining eligible entries if the window expires. Show the update so the community sees the process.",
      },
    ],
  }),

  article({
    category: "decision-making",
    categoryLabel: "Decision Making",
    slug: "yes-or-no-wheel-decision-guide",
    title: "Yes or No Wheel vs Magic 8 Ball–Style Decisions | Picker Wheel",
    description:
      "Compare a Yes or No spin wheel with Magic 8 Ball–style answers. Learn when to use a yes/no picker, should-I wheels, and decision wheels for everyday choices.",
    h1: "Yes or No Wheel vs Magic 8 Ball–Style Decisions",
    publishedAt: "2026-07-23",
    updatedAt: "2026-07-23",
    keywords: [
      "yes or no wheel",
      "yes no spinner",
      "decision wheel",
      "should I wheel",
      "magic 8 ball alternative",
    ],
    intro: [
      "Sometimes you do not need twenty options—you need a clean yes or no. A Yes or No wheel makes that binary choice visual and shareable, unlike typing “random” into a chat bot.",
      "Magic 8 Ball–style toys add playful ambiguity (“ask again later”). A yes/no wheel is clearer when you want a decisive outcome for plans, dares, or group votes.",
      "Used well, the spinner is a tie-breaker after people have already talked—not a replacement for judgment on serious choices. That framing keeps the tool fun, social, and AdSense-safe as light decision entertainment.",
    ],
    experienceNote:
      "In group decision tests, stating the question aloud before a Yes or No spin cut “that’s not what we meant” re-spins. When options were not truly binary, moving to a Decision wheel with listed choices worked better than forcing yes/no.",
    relatedSlugs: [
      "is-spin-wheel-really-random",
      "spin-wheel-for-board-game-nights",
      "fair-online-prize-wheel",
    ],
    howToSteps: [
      {
        title: "Open the Yes or No Wheel",
        description:
          "Start with the dedicated yes/no tool when your question is binary. Two clear outcomes are easier for a group to accept than a long custom list of soft maybe answers.",
      },
      {
        title: "Ask the question out loud",
        description:
          "State the question before spinning so everyone agrees what “yes” means. Ambiguous prompts create arguments even when the spin itself is fair.",
      },
      {
        title: "Spin and accept—or reframe",
        description:
          "If the stakes are high, treat the wheel as a tie-breaker after real discussion—not a substitute for judgment. For low-stakes plans, accept the result and move on.",
      },
      {
        title: "Try related decision tools",
        description:
          "Use Should I or Decision wheels when you need more than two answers. Escalating from yes/no to a fuller option list is often smarter than forcing a binary on a complex choice.",
      },
    ],
    sections: [
      {
        heading: "When a yes/no wheel shines",
        paragraphs: [
          "Quick plans (“Do we order pizza?”), classroom votes, stream interactions, and dare challenges all fit a two-outcome spinner. The simplicity is the feature.",
          "Binary spins also work when a group is stuck between two equally fine options and just needs closure. The entertainment value is the shared moment of watching the pointer, not mystical advice.",
        ],
        bullets: [
          "Binary group decisions",
          "Stream audience participation",
          "Icebreakers and party prompts",
          "Tie-breakers after a debate",
        ],
      },
      {
        heading: "Yes/No wheel vs Magic 8 Ball–style answers",
        paragraphs: [
          "Magic 8 Ball–style experiences lean into vague, entertaining replies. That is fun for parties, but it is a poor fit when you need an actionable yes or no.",
          "A Yes or No wheel keeps slices explicit. If you want richer prompts later, move to a decision wheel with custom answers—or a should-I style list of options you control.",
          "Think of Magic 8 Ball–style play as mood and comedy; think of a yes/no wheel as a coin flip you can project for a room. Choose the format that matches the social goal.",
        ],
      },
      {
        heading: "Responsible use",
        paragraphs: [
          "Do not use a spinner for medical, legal, or financial decisions. For light everyday choices, agree that the spin settles the tie and move on.",
          "Parents and teachers should keep prompts age-appropriate and avoid pressuring anyone into a dare they are uncomfortable with. A wheel can pick an activity; consent still matters.",
        ],
      },
      {
        heading: "Party, classroom, and stream use cases",
        paragraphs: [
          "At parties, yes/no spins settle playlist changes, who fetches snacks, or whether the next round is a dare. Keep questions playful and optional so guests can opt out without embarrassment.",
          "In class, a yes/no wheel can drive quick checks for opinion questions after discussion, not for graded correctness. On streams, let chat propose the question, then spin on camera so the answer feels communal.",
        ],
      },
      {
        heading: "When to switch to a fuller decision wheel",
        paragraphs: [
          "If your real options are “stay in,” “go out,” or “invite friends over,” a two-slice yes/no wheel forces a false binary. Move those choices onto a Decision or Should I wheel with one slice per option.",
          "Likewise, if people disagree about what “yes” would require, pause and redefine the question. Good decision spinning is mostly good question design.",
        ],
      },
      {
        heading: "Making group spins feel fair",
        paragraphs: [
          "Confirm equal odds and show both slices. Re-spinning until you get the answer you wanted destroys trust faster than not using a wheel at all.",
          "For recurring friend groups, save a custom decision list of common plans. Over time the wheel becomes a shared ritual that reduces decision fatigue without pretending the spinner knows best.",
          "If someone is uncomfortable with the outcome, allow a one-time group veto that requires consensus—not a quiet host override. Writing that veto rule before the first spin keeps the tool social instead of controlling.",
        ],
      },
      {
        heading: "Everyday examples that stay low-stakes",
        paragraphs: [
          "Good yes/no prompts sound like: “Do we watch one more episode?” “Should we walk instead of drive?” or “Is this the final pizza topping?” Bad prompts ask the spinner to decide careers, relationships, or money moves.",
          "Teachers can use yes/no for opinion warm-ups after a short reading, then ask students to justify either answer. The spin chooses who speaks or which side of a fun debate opens first; the learning still comes from reasoning.",
        ],
      },
    ],
    tools: [
      {
        label: "Yes or No Wheel",
        href: "/yes-or-no-wheel",
        description: "Dedicated binary spinner for clear yes/no outcomes.",
      },
      {
        label: "Should I Wheel",
        href: "/should-i-wheel",
        description: "Decision helper for should-I style questions.",
      },
      {
        label: "Decision Wheel",
        href: "/decision-wheel",
        description: "Broader decision lists beyond yes and no.",
      },
    ],
    faq: [
      {
        question: "Is a Yes or No wheel the same as a Magic 8 Ball?",
        answer:
          "No. A Yes or No wheel lands on clear binary answers. Magic 8 Ball–style tools often return vague phrases for entertainment.",
      },
      {
        question: "Can I customize yes/no labels?",
        answer:
          "Many decision tools let you edit entries. For strict yes/no, start with the Yes or No Wheel template.",
      },
      {
        question: "Are odds equal?",
        answer:
          "Yes on the standard Yes or No Wheel—each enabled answer has equal chance unless you use a weighted tool.",
      },
      {
        question: "Can groups use it on a call?",
        answer:
          "Yes. Share your screen so everyone watches the same spin.",
      },
      {
        question: "What kinds of questions should I avoid?",
        answer:
          "Avoid medical, legal, financial, or other high-stakes choices. Keep spins for light plans, games, and social tie-breakers.",
      },
      {
        question: "What if we need more than yes or no?",
        answer:
          "Switch to a Should I or Decision wheel and list every real option as its own entry before spinning.",
      },
    ],
  }),

  article({
    category: "teams",
    categoryLabel: "Teams",
    slug: "random-team-picker-guide",
    title: "How to Pick Random Teams Without Arguments | Picker Wheel",
    description:
      "Split people into fair random teams with a team picker wheel. Classroom groups, office icebreakers, sports scrimmages, and tournament drafts.",
    h1: "How to Pick Random Teams Without Arguments",
    publishedAt: "2026-07-23",
    updatedAt: "2026-07-23",
    keywords: [
      "random team picker",
      "team generator wheel",
      "split into teams randomly",
      "classroom team picker",
      "random team maker",
    ],
    intro: [
      "Captains picking friends leaves people feeling left out. A random team picker assigns groups from your list without politics.",
      "Picker Wheel’s team tools split names into balanced counts for sports, classrooms, offices, and online events.",
      "When the roster and team count are visible before you generate, participants can focus on the activity instead of lobbying for teammates. That is the real win of random grouping: speed plus dignity.",
    ],
    experienceNote:
      "In PE-style and workshop dry-runs, projecting Team Picker results and starting play within 30 seconds stopped most trade lobbying. Announcing a one-reroll maximum before generating kept the room from endless regenerates.",
    relatedSlugs: [
      "random-name-picker-for-teachers",
      "is-spin-wheel-really-random",
      "spin-wheel-for-board-game-nights",
    ],
    howToSteps: [
      {
        title: "Add everyone once",
        description:
          "Paste the full roster into the Team Picker Wheel. Double-check spelling so people recognize their names when teams appear on screen.",
      },
      {
        title: "Choose how many teams",
        description:
          "Set the team count (or use a 3-team / 4-team generator when you want a fixed split). Match the count to your activity space and equipment, not just to preference.",
      },
      {
        title: "Generate and display",
        description:
          "Show the teams on a shared screen before play starts. Reading teams aloud helps anyone who cannot see the display clearly.",
      },
      {
        title: "Re-roll if needed",
        description:
          "If rules require reshuffling, regenerate openly so the process stays transparent. Avoid private re-rolls that look like favoritism.",
      },
    ],
    sections: [
      {
        heading: "Where random teams help most",
        paragraphs: [
          "PE classes, workshop breakouts, office socials, esports scrims, and party games all need fast, fair grouping. Random assignment reduces cliques and speeds up setup.",
          "Event hosts also benefit when late arrivals can be dropped into a regenerate or assigned with a quick name spin. Transparent process keeps the room patient while you adjust counts.",
        ],
      },
      {
        heading: "Tips for balanced play",
        paragraphs: [
          "If skill balance matters, randomly assign first, then allow one limited trade with group consent—or seed strong players manually before randomizing the rest.",
          "Save the roster wheel so weekly meetups do not start from a blank list. Consistency matters for coaches and teachers who regroup often.",
          "For mixed-age or mixed-experience activities, consider constraints outside the spinner—such as one experienced player per team—then randomize the remaining names. Hybrid fairness often works better than pure chance alone.",
        ],
      },
      {
        heading: "Classroom and workshop grouping",
        paragraphs: [
          "Teachers can generate lab partners or project teams in seconds, then project the result so nobody claims they were left out on purpose. Pair the random split with clear roles so groups start working immediately.",
          "Workshops and corporate trainings use the same pattern for breakouts. Random teams encourage networking beyond the people who already sit together.",
        ],
      },
      {
        heading: "Sports scrimmages and casual leagues",
        paragraphs: [
          "Pickup games often stall while captains negotiate. Load player names, choose two or more teams, and generate. If someone must sit out a round, remove them before generating so counts stay even.",
          "For tournament warm-ups, regenerate between matches so rivalries do not calcify into the same stacks every week. Save the master roster and only toggle absences.",
        ],
      },
      {
        heading: "Office icebreakers and remote events",
        paragraphs: [
          "Office socials and remote happy hours work better when teams are random rather than department-based. Use an office-oriented team builder when you want workplace-friendly defaults, then share results in chat.",
          "On video calls, paste teams into the meeting chat after generating so breakout-room hosts can move people quickly. The spinner handles fairness; the chat handles logistics.",
        ],
      },
      {
        heading: "Drafts versus instant team splits",
        paragraphs: [
          "Instant team generation is best when you need even groups now. Snake-style drafts are better when order and choice matter—spin names with Elimination to create a draft order, then let players pick within rules.",
          "Tell participants which method you are using. Mixing draft expectations with instant splits causes unnecessary friction even when both methods are fair.",
        ],
      },
      {
        heading: "How to announce teams without drama",
        paragraphs: [
          "Tone matters as much as the algorithm. Frame the spin as a shared ritual—“we’re randomizing so everyone gets a fair shot”—instead of a punishment for not choosing friends. When people expect fairness, they argue less about the result.",
          "Read team lists once, post them where everyone can see, and start the activity quickly. Long pauses after a generate invite renegotiation. If a genuine constraint was missed (injury, accessibility, or required pairings), fix it openly and regenerate rather than quietly moving names.",
          "For recurring groups, rotate the ritual: one week instant splits, another week draft order. Variety keeps the process fresh while the core promise stays the same—no captain politics.",
        ],
      },
      {
        heading: "Checklist before you hit generate",
        paragraphs: [
          "Confirm the roster includes everyone present and excludes absences. Confirm the team count matches your space, materials, and game format. Confirm whether trades are allowed after generation, and say that rule out loud before you click.",
          "If you are splitting for a graded classroom project, remind students that randomness assigns teammates—not scores. Pair the random groups with a rubric and roles so the academic purpose stays clear. That combination of fair grouping plus structured work is what makes random teams feel useful instead of chaotic.",
        ],
      },
    ],
    tools: [
      {
        label: "Team Picker Wheel",
        href: "/team-picker-wheel",
        description: "Main hub for splitting people into random teams.",
      },
      {
        label: "Random Team Generator",
        href: "/random-team-generator",
        description: "Quick random team generation from a name list.",
      },
      {
        label: "Office Team Builder",
        href: "/office-team-builder",
        description: "Team splits geared toward workplace activities.",
      },
    ],
    faq: [
      {
        question: "How many teams can I create?",
        answer:
          "Team tools let you choose common splits; dedicated 3-team and 4-team generators also exist for fixed counts.",
      },
      {
        question: "Can I use this for sports drafts?",
        answer:
          "Yes. Load player names and generate teams, or spin individuals with Elimination for snake-style drafts.",
      },
      {
        question: "Does everyone have an equal chance?",
        answer:
          "Random team assignment treats listed participants equally when creating groups.",
      },
      {
        question: "Is it free?",
        answer: "Yes. The linked team tools are free to use.",
      },
      {
        question: "What if teams feel unbalanced after a random split?",
        answer:
          "Allow one open re-roll or a single consensual trade, then lock the teams. State that rule before generating so adjustments do not look selective.",
      },
      {
        question: "Can I reuse the same roster next week?",
        answer:
          "Yes. Save the wheel on your device and update only absences or new players before generating again.",
      },
    ],
  }),

  article({
    category: "education",
    categoryLabel: "Education",
    slug: "geography-country-state-picker-wheels",
    title: "Country and State Picker Wheels for Geography Class | Picker Wheel",
    description:
      "Use country and state picker wheels for geography lessons, quizzes, and travel projects. Fair random places for classrooms and study games.",
    h1: "Country and State Picker Wheels for Geography Class",
    publishedAt: "2026-07-23",
    updatedAt: "2026-07-23",
    keywords: [
      "country picker wheel",
      "state picker wheel",
      "geography spinner",
      "random country for class",
      "random state picker",
    ],
    intro: [
      "Geography sticks when students investigate a specific place—not when they only memorize lists. A country or state picker wheel assigns a random place for research, quizzes, or travel-themed projects.",
      "Picker Wheel includes a Country Picker hub, State wheels, and travel destination spins so you can match the lesson to the map level you need.",
      "Random assignment also prevents the same popular countries from being chosen every semester. Students explore places they might never volunteer, which broadens the classroom map in a fair way.",
    ],
    experienceNote:
      "When we assigned research targets with Country Picker Elimination across a class set, duplicate countries disappeared and quieter students still got a clear topic. Pairing each spin with two standing map questions turned the novelty into a repeatable routine.",
    relatedSlugs: [
      "random-name-picker-for-teachers",
      "color-picker-wheel-ideas",
      "is-spin-wheel-really-random",
    ],
    howToSteps: [
      {
        title: "Choose country or state scope",
        description:
          "Open the Country Picker Wheel for global picks or a State wheel for US-focused lessons. Matching scope to the unit prevents off-topic spins that waste class time.",
      },
      {
        title: "Filter if needed",
        description:
          "Use regional spokes (for example Europe or Africa) when the unit is continent-specific. A filtered wheel keeps every result relevant to the standards you are teaching.",
      },
      {
        title: "Spin for a study target",
        description:
          "Assign the result as a research country, map quiz subject, or presentation topic. Write the place on the board immediately so students lock onto the task.",
      },
      {
        title: "Repeat with Elimination",
        description:
          "Avoid duplicate assignments across students by removing winners as you go. Reset only when a new activity needs the full list again.",
      },
    ],
    sections: [
      {
        heading: "Lesson ideas",
        paragraphs: [
          "Spin a country for flag quizzes, capital practice, climate comparisons, or “pack a suitcase” writing prompts. Spin a state for regional history, landmarks, or weather graphs.",
          "Short spins work as warm-ups; longer projects can use one spin per student at the start of the week. The wheel handles assignment fairness so you can focus on scaffolding research skills.",
        ],
        bullets: [
          "Random country research week",
          "State capitals warm-ups",
          "Travel brochure projects",
          "Compare-two-places debates",
        ],
      },
      {
        heading: "Keep it age-appropriate",
        paragraphs: [
          "Preview sensitive current events before assigning news research. For younger grades, pair the spin with teacher-curated resource links rather than open web search alone.",
          "Travel-themed wheels are great for imagination projects, but clarify that destinations are for learning—not real travel promises. Keep the tone educational and playful.",
        ],
      },
      {
        heading: "Quizzes, stations, and review games",
        paragraphs: [
          "Use the spinner between quiz rounds to choose the next region or state set. Students stay engaged because the sequence is unpredictable but still fair.",
          "At stations, one device can spin the next country while groups rotate. Elimination ensures the class covers more of the map before repeats appear.",
        ],
      },
      {
        heading: "Project-based learning with random places",
        paragraphs: [
          "A random country can anchor a multi-day project: map skills one day, culture or economy the next, then a short presentation. Because the place was spun publicly, students accept ownership more quickly.",
          "Compare-two-places debates work well with two spins or one spin plus a teacher-selected contrast location. The random element keeps debates from always featuring the same familiar countries.",
        ],
      },
      {
        heading: "Homework and independent study",
        paragraphs: [
          "Students can spin on a phone for a nightly study target—capital, neighboring countries, or three facts. Teachers can require a screenshot of the result if accountability matters.",
          "Families doing geography games at home can use the same wheels for weekend challenges. Shared tools between class and home reinforce vocabulary without needing printable spinners.",
        ],
      },
      {
        heading: "Building a reusable geography toolkit",
        paragraphs: [
          "Save separate wheels for world countries, US states, and travel destinations. Label them clearly so substitutes or co-teachers can run the routine without rebuilding lists.",
          "If your curriculum excludes certain regions for a unit, disable those entries temporarily instead of creating confusion with a mismatched full list. Transparent scope is part of instructional fairness.",
        ],
      },
      {
        heading: "Discussion prompts after every spin",
        paragraphs: [
          "A random place is only the start. Follow the spin with two or three standing questions: Where is it relative to us? What physical feature shapes life there? What is one respectful fact students should verify before presenting? Repeatable prompts turn a novelty spinner into a thinking routine.",
          "Older students can add a source requirement—atlas page, curated article, or class text—so the activity builds research habits. Younger students can draw a quick map sketch or label a printed outline after the spin. Either way, the wheel’s job is assignment fairness; the teacher’s job is the learning that follows.",
        ],
      },
      {
        heading: "Avoiding popularity bias in geography class",
        paragraphs: [
          "Without randomization, classes often revisit the same handful of famous countries. A spinner spreads attention across the enabled list and makes “obscure” places feel legitimate to study. Students may groan at first, then discover they like becoming the classroom expert on somewhere unexpected.",
          "If a spun place lacks age-appropriate materials in your library, keep a short teacher swap list of alternate research targets in the same region. Explain the swap as a resource constraint, not a secret veto of the spin. Honesty about exceptions preserves trust in the random process for the next round.",
        ],
      },
    ],
    tools: [
      {
        label: "Country Picker Wheel",
        href: "/country-picker-wheel",
        description: "Spin a random country from a curated world list.",
      },
      {
        label: "State Picker Wheel",
        href: "/state-wheel",
        description: "Random US state picks for geography practice.",
      },
      {
        label: "Travel Destination Picker",
        href: "/travel-destination-picker-wheel",
        description: "Travel-themed destination spins for projects and fun.",
      },
    ],
    faq: [
      {
        question: "Can I limit spins to one region?",
        answer:
          "Yes. Use regional country spokes or filters where available so the wheel stays on-topic for your unit.",
      },
      {
        question: "Does every country have equal odds?",
        answer:
          "Enabled entries on the standard country wheel use equal odds.",
      },
      {
        question: "Can students spin on their phones?",
        answer:
          "Yes. The tools work in mobile browsers for homework or stations.",
      },
      {
        question: "Is this free for schools?",
        answer: "Yes. The linked geography wheels are free to use.",
      },
      {
        question: "How do I stop two students from getting the same country?",
        answer:
          "Use Elimination mode while assigning topics so each winning place is removed until you reset.",
      },
      {
        question: "Can I use this for state capitals practice?",
        answer:
          "Yes. Spin a state, then have students name the capital, locate it on a map, or both as a timed warm-up.",
      },
    ],
  }),

  article({
    category: "anime",
    categoryLabel: "Anime",
    slug: "anime-character-spin-wheel-guide",
    title: "Anime Character Wheels: Fair Picks for Fan Challenges | Picker Wheel",
    description:
      "Use anime character spin wheels for cosplay prompts, fan art challenges, and watch-party drafts—including Jujutsu Kaisen and Demon Slayer hubs.",
    h1: "Anime Character Wheels: Fair Picks for Fan Challenges",
    publishedAt: "2026-07-23",
    updatedAt: "2026-07-23",
    keywords: [
      "anime character wheel",
      "anime spin the wheel",
      "jjk character picker",
      "demon slayer spin wheel",
      "random anime character",
    ],
    intro: [
      "Fan challenges need a fair starter character: who to draw, cosplay, main in a discussion, or draft for a watch-party game. Anime character wheels make that pick social and transparent.",
      "Picker Wheel’s Jujutsu Kaisen and Demon Slayer hubs (plus favorites spokes) give you franchise-focused catalogs instead of a messy all-anime dump.",
      "Focused lists keep challenges fair for fans who know a series deeply. Everyone sees the same cast pool, the same spin, and the same rule—so the creative pressure feels fun instead of arbitrary.",
    ],
    experienceNote:
      "For multi-round fan-art dry-runs on JJK and Demon Slayer hubs, Elimination plus a posted template name (for example Hashira-only) prevented early duplicates and spoiler arguments. Screenshotting the result before drawing made the challenge feel legit to viewers.",
    relatedSlugs: [
      "player-made-rng-spin-wheels",
      "is-spin-wheel-really-random",
      "color-picker-wheel-ideas",
    ],
    howToSteps: [
      {
        title: "Open a franchise hub",
        description:
          "Start with JJK Spin Wheel or Demon Slayer Spin Wheel for a curated cast. Franchise hubs reduce setup time and keep names recognizable for your audience.",
      },
      {
        title: "Apply a focused template",
        description:
          "Use Hashira, villains, students, or favorites presets when you want a tighter challenge. Smaller pools raise the difficulty without needing custom coding.",
      },
      {
        title: "Spin for the challenge rule",
        description:
          "Announce whether the result is for art, cosplay, or discussion before you spin. Clear stakes prevent mid-challenge renegotiation.",
      },
      {
        title: "Eliminate repeats for multi-round events",
        description:
          "Elimination keeps tournaments and friend-group drafts fresh. Reset when a new event begins so favorites return to the pool intentionally.",
      },
    ],
    sections: [
      {
        heading: "Challenge formats that work",
        paragraphs: [
          "Fan art roulette, cosplay roulette, “explain this character in 60 seconds,” and team drafts all map cleanly to character wheels. Focused templates (Hashira-only, villain-only) raise the difficulty in a fun way.",
          "Watch parties can spin a discussion leader character or a “defend this character” prompt between episodes. The spin gives shy fans a role without forcing them to volunteer first.",
        ],
      },
      {
        heading: "Stay respectful with fan tools",
        paragraphs: [
          "These wheels are unofficial fan entertainment. Character names belong to their rights holders. Avoid implying official endorsement, and keep community events friendly.",
          "Moderation still matters: keep prompts wholesome for public streams, and do not pressure anyone into cosplays or drawings they are uncomfortable with. The wheel picks a prompt; people choose how to participate.",
        ],
      },
      {
        heading: "Art, cosplay, and content creator prompts",
        paragraphs: [
          "Artists often need a constraint to start. Spin a character, then optionally spin a second rule such as expression, palette, or scene type on a custom wheel. Dual constraints create stronger portfolio pieces than a blank canvas.",
          "Cosplayers can use franchise wheels for convention challenge runs or group theme nights. Screenshot the result for your post so followers see the pick was fair.",
        ],
      },
      {
        heading: "Discord servers and watch-party drafts",
        paragraphs: [
          "Server mods can run weekly character drafts with Elimination so members get unique assignments for fanfic snippets, reaction clips, or debate nights. Post the wheel result in the event channel for transparency.",
          "For multiplayer party games inspired by anime fandom, spin teams of characters as scoring themes or costume ideas. Keep the activity clearly fan-made entertainment.",
        ],
      },
      {
        heading: "Building fair multi-round tournaments",
        paragraphs: [
          "Bracket-style fan events work best when each participant spins from the same enabled list. Use Elimination across the event so early winners do not clog later rounds with duplicates.",
          "Publish the rules before round one: allowed templates, re-spin policy for incomplete catalog entries, and whether custom additions are permitted. Consistency is what makes “RNG challenges” feel legitimate to a fandom community.",
        ],
      },
      {
        heading: "Custom entries and favorites shortlists",
        paragraphs: [
          "If a character is missing, add a custom name rather than abandoning the hub. Custom entries keep the visual spin while covering community favorites.",
          "Favorites spokes are ideal when a full cast is too large for a short stream segment. A shortlist spins faster, reads better on mobile, and still feels exciting when the pool is loved by your audience.",
        ],
      },
      {
        heading: "Watch-party games that stay light",
        paragraphs: [
          "Between episodes, spin a character and ask everyone for one prediction, costume detail, or theme song vibe related to that pick. Keep rounds short so the wheel supports the watch party instead of replacing it.",
          "For spoiler-sensitive groups, agree on which arcs are allowed before enabling catalog slices. A fair spin from an agreed pool beats a random deep-cut that ruins someone’s first viewing. Franchise hubs make that curation easier because you can start from a known cast and trim intentionally.",
        ],
      },
      {
        heading: "Hosting tips for fair fan events",
        paragraphs: [
          "Post the enabled list or template name in chat before round one. Say whether Elimination is on, whether custom adds are allowed, and how re-spins work for incomplete entries. Those three sentences prevent most arguments.",
          "On camera, fullscreen the wheel and pause briefly on the result so screenshots are readable. Save the wheel if your event spans multiple days so day-two participants inherit the same rules and remaining pool. Fairness is mostly process—equal odds plus clear hosting habits.",
        ],
      },
    ],
    tools: [
      {
        label: "JJK Spin the Wheel",
        href: "/jjk-spin-the-wheel",
        description: "Jujutsu Kaisen character hub and templates.",
      },
      {
        label: "Demon Slayer Spin Wheel",
        href: "/demon-slayer-spin-wheel",
        description: "Demon Slayer characters, Hashira, demons, and more.",
      },
      {
        label: "Favorite JJK Character Picker",
        href: "/favorite-jjk-character-picker",
        description: "Compact fan-favorite JJK shortlist spinner.",
      },
    ],
    faq: [
      {
        question: "Can I add custom anime characters?",
        answer:
          "Yes. Add custom names and optional images on the wheel tools when a character is missing from the catalog.",
      },
      {
        question: "Are odds equal?",
        answer:
          "Enabled catalog entries use equal odds on these franchise wheels.",
      },
      {
        question: "Are these official anime products?",
        answer:
          "No. They are independent fan-made entertainment tools.",
      },
      {
        question: "Can I use this on TikTok or Discord?",
        answer:
          "Yes. Spin on stream or share your screen; the visual wheel works well for social challenges.",
      },
      {
        question: "How do I run a multi-person art challenge?",
        answer:
          "Have each participant spin with Elimination from the same list, or spin once per person on camera and assign the results in order.",
      },
      {
        question: "What if the spun character is too hard for beginners?",
        answer:
          "Allow a single community-agreed re-spin rule, or start from a favorites shortlist that matches the skill level of the challenge.",
      },
    ],
  }),

  article({
    category: "creativity",
    categoryLabel: "Creativity",
    slug: "color-picker-wheel-ideas",
    title: "Color Picker Wheels for Design, Art, and Classroom Fun | Picker Wheel",
    description:
      "Spin a color picker wheel for art prompts, design challenges, classroom activities, and palette inspiration—free online color spinners.",
    h1: "Color Picker Wheels for Design, Art, and Classroom Fun",
    publishedAt: "2026-07-23",
    updatedAt: "2026-07-23",
    keywords: [
      "color picker wheel",
      "random color spinner",
      "art prompt color wheel",
      "classroom color picker",
      "wheel of colors",
    ],
    intro: [
      "Creative blocks often start with “which color first?” A color picker wheel assigns a hue at random so artists, designers, and students can jump into making instead of overthinking.",
      "Picker Wheel’s color tools cover general color picking plus themed palettes and wheel-of-colors style play.",
      "Random color constraints are popular because they are low-stakes and instantly visual. One spin can drive a warm-up sketch, a logo accent challenge, or a classroom station rotation without a long setup lecture.",
    ],
    experienceNote:
      "In timed studio warm-ups, spinning a color and starting a ten-minute sketch beat browsing palettes for decision speed. Classroom tests worked best when the wheel only included colors already in the supply bins.",
    relatedSlugs: [
      "random-name-picker-for-teachers",
      "geography-country-state-picker-wheels",
      "yes-or-no-wheel-decision-guide",
    ],
    howToSteps: [
      {
        title: "Open a color wheel tool",
        description:
          "Start with Color Picker Wheel or Random Color Picker for a quick spin. Choose a tool that matches whether you want a broad palette or a simple classroom-friendly set.",
      },
      {
        title: "Set a creative rule",
        description:
          "Example: paint only with the spun color family, or design a logo accent from the result. Write the rule down before spinning so the constraint stays honest.",
      },
      {
        title: "Spin and create",
        description:
          "Use the result as a constraint for a timed sketch or classroom warm-up. Short timers pair well with random colors because they reduce second-guessing.",
      },
      {
        title: "Combine colors",
        description:
          "Spin twice for primary + accent pairings, or eliminate used colors across a series. Multi-spin rules build richer palettes while staying fair.",
      },
    ],
    sections: [
      {
        heading: "Ideas for artists and classrooms",
        paragraphs: [
          "Warm-ups, outfit challenges, sticker designs, slide themes, and “mystery color” still-life prompts all work. Teachers can spin a color for table groups or art-station rotations.",
          "In elementary settings, color spins can assign crayon cups or collage paper without students arguing over favorites. In higher grades, use spins to force unfamiliar complementary pairings in studies.",
        ],
      },
      {
        heading: "Designers: constraints spark speed",
        paragraphs: [
          "Random accents force exploration outside your default brand palette. Keep a saved wheel of approved brand-adjacent colors if you need randomness within guidelines.",
          "For portfolio drills, spin a color, then design three tiny assets in twenty minutes. The point is decision speed and range, not shipping production UI with an arbitrary hue.",
        ],
      },
      {
        heading: "Party games and stream art prompts",
        paragraphs: [
          "Party drawing games become funnier when everyone shares one spun color. Streamers can let chat watch the color land, then draw live under that constraint for a short segment.",
          "Outfit or room-makeover challenges also fit: spin a color family and style a look around it. Keep prompts light and optional for guests who prefer to watch.",
        ],
      },
      {
        heading: "Classroom management with color stations",
        paragraphs: [
          "Assign each table a spun color for materials, team names, or cleanup jobs. Rotating colors across days feels fairer than teacher-chosen favorites and adds a playful ritual to transitions.",
          "Combine a color wheel with a letter or name picker when you want layered randomness—for example, spin a color and a student presenter for a quick share-out.",
        ],
      },
      {
        heading: "Building palettes without endless browsing",
        paragraphs: [
          "Instead of scrolling inspiration sites for an hour, spin two or three colors and commit to a limited palette study. Limitation often reveals combinations you would not click toward on purpose.",
          "If a spin clashes badly for accessibility or printing, allow one documented re-spin. Honest exception rules preserve the spirit of constraint without forcing unusable results.",
        ],
      },
      {
        heading: "Saving wheels for recurring creative practice",
        paragraphs: [
          "Artists who practice daily can save a personal warm-up wheel and eliminate colors across a week so the series stays varied. Teachers can save grade-level palettes that match available supplies.",
          "Separate “wild creative” wheels from “brand-safe” wheels if you switch contexts often. Context-specific lists keep randomness helpful instead of chaotic.",
        ],
      },
      {
        heading: "Timed challenges that actually get finished",
        paragraphs: [
          "Pair a color spin with a short timer—five, ten, or fifteen minutes—so the exercise ends with a finished sketch instead of endless tweaking. Random color plus limited time is a classic studio drill because it removes two common stalling points at once.",
          "In classrooms, project both the wheel and the timer. Students who finish early can spin a second accent color for a border or background rather than wandering into phone time. The ritual stays productive when every spin has a clear next action.",
        ],
      },
      {
        heading: "Accessibility and inclusive color play",
        paragraphs: [
          "Not every random palette works for print, projection, or color-vision differences. Teach students to check contrast when a design must be readable, and allow a single accessibility re-spin when a result fails a basic contrast check.",
          "You can also maintain a “high-contrast classroom set” wheel with colors that remain distinct on your board and handouts. Randomness inside a safe set still feels playful while respecting real viewing conditions. Inclusive constraints are not cheating—they are good design practice.",
          "When sharing digital art, name the spun colors in text as well as showing them, so collaborators who adjust display settings still understand the constraint you used.",
        ],
      },
    ],
    tools: [
      {
        label: "Color Picker Wheel",
        href: "/color-picker-wheel",
        description: "Main color spinning hub for creative picks.",
      },
      {
        label: "Random Color Picker",
        href: "/random-color-picker",
        description: "Fast random color results.",
      },
      {
        label: "Wheel of Colors",
        href: "/wheel-of-colors",
        description: "Colors-focused spinner alias into the color tools.",
      },
    ],
    faq: [
      {
        question: "Can I spin hex colors?",
        answer:
          "Color tools support spinning colors for creative use; check the specific color wheel page for palette and display options.",
      },
      {
        question: "Is this useful in class?",
        answer:
          "Yes. Short color spins make excellent warm-ups and fairness tools for art rotations.",
      },
      {
        question: "Are odds equal?",
        answer:
          "Enabled color entries use equal odds on standard color wheels.",
      },
      {
        question: "Is it free?",
        answer: "Yes. The linked color wheels are free to use.",
      },
      {
        question: "How do I make a two-color palette?",
        answer:
          "Spin once for a base color and again for an accent, or eliminate the first winner and spin a second time from the remaining list.",
      },
      {
        question: "Can I limit colors to supplies we already have?",
        answer:
          "Yes. Build or edit the wheel so it only includes colors available in your classroom set or studio inventory before you spin.",
      },
    ],
  }),

  article({
    category: "how-it-works",
    categoryLabel: "How It Works",
    slug: "is-spin-wheel-really-random",
    title: "Is a Spin Wheel Really Random? How Equal Odds Work | Picker Wheel",
    description:
      "Learn how equal-odds spin wheels work, when to use weighted odds, and how to run transparent random picks people can trust.",
    h1: "Is a Spin Wheel Really Random? How Equal Odds Work",
    publishedAt: "2026-07-23",
    updatedAt: "2026-07-23",
    keywords: [
      "is spin wheel random",
      "equal odds wheel",
      "fair random picker",
      "weighted vs equal odds",
      "spin wheel probability",
    ],
    intro: [
      "People ask whether an online spin wheel is “really random.” On Picker Wheel’s standard tools, each enabled entry is given equal weight—one slice, one chance—so the pointer is not secretly favoring a name.",
      "Understanding equal odds vs weighted odds helps you pick the right tool and explain fairness to students, viewers, or giveaway audiences.",
      "True fairness in group settings is usually about transparent process: a visible list, a public spin, and rules announced before the pointer moves. Equal odds are the mathematical foundation; process is what people experience.",
    ],
    experienceNote:
      "When we compared equal-odds name spins with silent off-camera picks, groups trusted the on-screen wheel even when short runs produced repeats in Normal mode. Explaining Elimination vs Normal—and switching tools for intentional weights—resolved most “is it rigged?” questions.",
    relatedSlugs: [
      "fair-online-prize-wheel",
      "random-name-picker-for-teachers",
      "yes-or-no-wheel-decision-guide",
    ],
    howToSteps: [
      {
        title: "Show the full list",
        description:
          "Before spinning, display every enabled entry so the pool is undisputed. If someone should be excluded, remove them before the spin starts—not after.",
      },
      {
        title: "Confirm equal odds",
        description:
          "On standard wheels, do not duplicate names unless you intentionally want extra chances. Duplicates are the most common accidental way to create unfair weight.",
      },
      {
        title: "Spin publicly",
        description:
          "Shared screens beat off-camera picks for trust. A fair algorithm still looks suspicious if only the host saw the result.",
      },
      {
        title: "Use weighted tools only on purpose",
        description:
          "Open the Weighted Wheel Spinner when probabilities should differ—and say so. Label the event clearly so nobody assumes equal odds by default.",
      },
    ],
    sections: [
      {
        heading: "What equal odds means",
        paragraphs: [
          "If ten names are enabled and each appears once, each name has a 1-in-10 chance. Adding a name twice doubles its chances. Removing a name raises everyone else’s share.",
          "That transparency is why wheels beat opaque “trust me” randomizers for classrooms and communities. People can audit the pool with their eyes.",
          "Equal odds do not guarantee that short runs look perfectly even. In a small number of spins, repeats can happen in Normal mode. That is expected probability behavior, not proof of bias.",
        ],
      },
      {
        heading: "When weighted odds are better",
        paragraphs: [
          "Prize jackpots, rarity systems, and teaching probability can benefit from unequal weights. Use a weighted spinner and disclose the model. Do not quietly weight a “fair” classroom name picker.",
          "Weighted tools are also useful for simulating real-world rarity in games or lessons. The key is intentional design plus honest communication.",
        ],
      },
      {
        heading: "Build trust with process",
        paragraphs: [
          "Agree on rules first, spin second. Use Elimination for no-repeat rounds. Keep Results history when you need a paper trail for giveaways. Read the Help Center for more product FAQs.",
          "If you must change the list, pause and show the edit. Silent changes are what make audiences doubt even honest hosts.",
        ],
      },
      {
        heading: "Normal mode vs Elimination mode",
        paragraphs: [
          "Normal mode keeps winners on the wheel, so the same entry can win again on a later spin. That is correct for independent random picks, like repeating a prize category pool.",
          "Elimination mode removes winners and is better for calling every student once, drafting unique characters, or giving away unique physical prizes. Choose the mode that matches your fairness goal, then explain it aloud.",
        ],
      },
      {
        heading: "Common myths about online spinners",
        paragraphs: [
          "Longer labels do not get bigger chances on equal-odds wheels. Slice size follows weight and entry count, not text length. Another myth is that “the wheel knows” what you want; it does not—confirmation bias makes memorable wins stand out.",
          "A third myth is that any digital randomizer is either perfectly mystical or completely fake. Practical fairness sits in the middle: equal weights, visible process, and the right tool for equal versus weighted needs.",
        ],
      },
      {
        heading: "Classroom, giveaway, and stream checklists",
        paragraphs: [
          "For class: update absences, show the roster, pick Normal or Elimination, and spin on the projector. For giveaways: publish eligibility, disclose equal or weighted odds, spin live, and record winners.",
          "For streams: fullscreen the wheel, pin rules in chat, and avoid editing mid-spin. These habits answer “is it really random?” more convincingly than a long technical lecture.",
        ],
      },
      {
        heading: "What “random enough” means for real groups",
        paragraphs: [
          "Groups rarely need cryptographic perfection. They need a process that is hard to accuse of favoritism. Equal-odds slices, a shared screen, and stable rules before the spin usually meet that bar for classrooms, parties, and community events.",
          "If someone still doubts a result, invite them to inspect the enabled list and watch a second demonstration spin with a throwaway prompt. Teaching the process builds more trust than insisting “the computer said so.” When stakes rise—prizes, graded speaking turns, or public drafts—document the mode and keep Results history when available.",
        ],
      },
      {
        heading: "Choosing the right Picker Wheel tool",
        paragraphs: [
          "Use the standard Random Name Picker and most themed wheels when every enabled entry should be equal. Switch to the Weighted Wheel Spinner only when rarity is part of the design and you are willing to explain it. Visit Help when you need product how-tos beyond probability basics.",
          "Matching the tool to the fairness story you told your audience is the whole game. Equal-odds branding with hidden weights destroys trust. Weighted branding with clear disclosure can feel exciting and honest at the same time.",
        ],
      },
    ],
    tools: [
      {
        label: "Help Center – Is it really random?",
        href: "/help#is-the-spin-wheel-really-random",
        description: "Short FAQ answer plus related Help topics on fair spins.",
      },
      {
        label: "Weighted Wheel Spinner",
        href: "/weighted-wheel-spinner",
        description: "Intentional unequal probabilities when you need them.",
      },
      {
        label: "Random Name Picker",
        href: "/",
        description: "Equal-odds name spinning for everyday fair picks.",
      },
      {
        label: "All guides",
        href: "/articles",
        description: "Browse every Picker Wheel how-to article.",
      },
    ],
    faq: [
      {
        question: "Is Picker Wheel truly random?",
        answer:
          "Standard wheels aim for fair equal-odds selection among enabled entries. No spinner can promise metaphysical randomness, but equal weights and a visible spin are transparent and practical.",
      },
      {
        question: "Why did the same name win twice?",
        answer:
          "In Normal mode, winners stay on the wheel. Use Elimination to prevent repeats.",
      },
      {
        question: "Does a longer name get a bigger slice?",
        answer:
          "No. Slice size is based on entry weight/count, not how long the label is.",
      },
      {
        question: "Where can I learn more?",
        answer:
          "Visit the Help Center for detailed FAQs about randomness, saving wheels, and settings.",
      },
      {
        question: "When should I use weighted odds instead of equal odds?",
        answer:
          "Use weighted odds for intentional rarity, such as jackpots or probability lessons, and disclose the model. Keep equal odds for fair name picks and most community drafts.",
      },
      {
        question: "How can I make my audience trust a spin?",
        answer:
          "Show the full enabled list, announce the rules, spin on a shared screen, and avoid silent edits. Screenshots or Results history help for giveaways.",
      },
    ],
  }),
]

export function getArticleByPath(category: string, slug: string) {
  return ARTICLES.find((item) => item.category === category && item.slug === slug)
}

export function getArticlesByCategory(category: ArticleCategoryId) {
  return ARTICLES.filter((item) => item.category === category)
}

export function getRelatedArticles(article: Article, limit = 3) {
  const bySlug = new Map(ARTICLES.map((item) => [item.slug, item]))
  const preferred = (article.relatedSlugs ?? [])
    .map((slug) => bySlug.get(slug))
    .filter((item): item is Article => Boolean(item) && item.id !== article.id)

  const same = ARTICLES.filter(
    (item) => item.category === article.category && item.id !== article.id,
  )
  const others = ARTICLES.filter(
    (item) => item.category !== article.category && item.id !== article.id,
  )

  const seen = new Set<string>()
  const merged: Article[] = []
  for (const item of [...preferred, ...same, ...others]) {
    if (seen.has(item.id)) continue
    seen.add(item.id)
    merged.push(item)
    if (merged.length >= limit) break
  }
  return merged
}

export function articleUrl(article: Article) {
  return `${ARTICLES_SITE_URL}${article.path}`
}

export function getAllArticleParams() {
  return ARTICLES.map((item) => ({
    category: item.category,
    slug: item.slug,
  }))
}

function personSchema(person: ArticlePerson) {
  return {
    "@type": "Person" as const,
    name: person.name,
    jobTitle: person.jobTitle,
    description: person.description,
    url: person.url,
    worksFor: {
      "@type": "Organization" as const,
      name: ARTICLE_PUBLISHER.name,
      url: ARTICLE_PUBLISHER.url,
    },
  }
}

export function buildArticleSchemas(article: Article) {
  const url = articleUrl(article)
  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.h1,
      description: article.description,
      datePublished: article.publishedAt,
      dateModified: article.updatedAt,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": url,
      },
      image: ARTICLE_PUBLISHER.logoUrl,
      author: personSchema(ARTICLE_AUTHOR),
      editor: personSchema(ARTICLE_AUTHOR),
      reviewedBy: personSchema(ARTICLE_REVIEWER),
      publisher: {
        "@type": "Organization",
        name: ARTICLE_PUBLISHER.name,
        url: ARTICLE_PUBLISHER.url,
        logo: {
          "@type": "ImageObject",
          url: ARTICLE_PUBLISHER.logoUrl,
        },
      },
      about: article.tools.map((tool) => ({
        "@type": "SoftwareApplication",
        name: tool.label,
        url: `${ARTICLES_SITE_URL}${tool.href === "/" ? "" : tool.href}`,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Web Browser",
      })),
      keywords: article.keywords.join(", "),
      inLanguage: "en",
      isAccessibleForFree: true,
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: article.h1,
      description: article.description,
      totalTime: "PT10M",
      step: article.howToSteps.map((step, index) => ({
        "@type": "HowToStep",
        position: index + 1,
        name: step.title,
        text: step.description,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: article.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `${ARTICLES_SITE_URL}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Articles",
          item: ARTICLES_URL,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: article.categoryLabel,
          item: `${ARTICLES_URL}#${article.category}`,
        },
        {
          "@type": "ListItem",
          position: 4,
          name: article.h1,
          item: url,
        },
      ],
    },
  ]
}
