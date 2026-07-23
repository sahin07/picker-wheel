export type FaqChipVariant = "green" | "amber" | "red" | "gray" | "blue" | "purple"

export type FaqInlinePart =
  | { type: "text"; value: string }
  | {
      type: "chip"
      label: string
      variant?: FaqChipVariant
      href?: string
    }

export type FaqStep = {
  parts: FaqInlinePart[]
}

export type HelpFaqItem = {
  id: string
  question: string
  answer: string[]
  steps?: FaqStep[]
  links?: { label: string; href: string }[]
}

export type HelpFaqSection = {
  id: string
  title: string
  intro: string
  items: HelpFaqItem[]
}

export const HELP_FAQ_SECTIONS: HelpFaqSection[] = [
  {
    id: "general",
    title: "Getting started",
    intro:
      "Practical answers for first-time visitors and regular users who want a fair, simple way to pick something at random.",
    items: [
      {
        id: "what-is-picker-wheel",
        question: "What is Picker Wheel?",
        answer: [
          "Picker Wheel is a free online decision tool. You add options to a colorful wheel, spin it, and let chance choose one result for you.",
          "People use it for classroom name draws, team splits, giveaways, lunch picks, game challenges, and any moment when a manual choice feels slow or unfair. Alongside the main name picker, you will also find specialized wheels for numbers, letters, colors, images, dates, sports teams, game characters, and travel destinations.",
          "We keep the experience lightweight on purpose: open the page, build your list, and spin. No account is required to start.",
        ],
        links: [
          { label: "Open the main picker", href: "/" },
          { label: "Browse all wheel categories", href: "/spin-wheels" },
        ],
      },
      {
        id: "how-to-create-a-wheel",
        question: "How do I create my own wheel?",
        answer: [
          "You can build a custom wheel in your browser in a few short steps. Use either a blank list or an existing tool as a starting point.",
        ],
        steps: [
          {
            parts: [
              { type: "text", value: "Open the home page and look for " },
              {
                type: "chip",
                label: "File",
                variant: "gray",
              },
              { type: "text", value: " → " },
              {
                type: "chip",
                label: "New Wheel",
                variant: "green",
              },
              {
                type: "text",
                value: " in the header, or start typing options in the Inputs panel.",
              },
            ],
          },
          {
            parts: [
              {
                type: "text",
                value: "Add your choices one by one, or open ",
              },
              { type: "chip", label: "Bulk Add", variant: "blue" },
              {
                type: "text",
                value: " and paste a full list with one option per line.",
              },
            ],
          },
          {
            parts: [
              {
                type: "text",
                value: "Want ideas instead of typing? Switch to ",
              },
              { type: "chip", label: "AI-Powered", variant: "purple" },
              {
                type: "text",
                value: ", generate a draft list, then edit anything that does not fit.",
              },
            ],
          },
          {
            parts: [
              {
                type: "text",
                value: "When the list looks right, press ",
              },
              { type: "chip", label: "Spin", variant: "green" },
              {
                type: "text",
                value: " in the center of the wheel to pick a result.",
              },
            ],
          },
          {
            parts: [
              {
                type: "text",
                value: "Need a second list for another group? Use ",
              },
              { type: "chip", label: "Switch Wheel", variant: "gray" },
              {
                type: "text",
                value: " to create or open another wheel without losing the first one.",
              },
            ],
          },
        ],
        links: [{ label: "Create a wheel now", href: "/" }],
      },
      {
        id: "common-use-cases",
        question: "What can I use the wheel for?",
        answer: [
          "Teachers often spin for who answers next, who presents first, or which student joins a group. It keeps selection transparent and keeps energy in the room.",
          "At home or with friends, the wheel works well for dinner choices, movie night, chore rotation, or party games. Teams use it to break ties, assign roles, or pick a random challenge.",
          "If you already know the theme, jump into a ready-made tool instead of starting from a blank list—numbers, yes/no, colors, team assignment, MLB/NBA teams, Fortnite skins, Pokemon, League champions, countries, and U.S. states are all available.",
        ],
        links: [
          { label: "Yes or No wheel", href: "/yes-or-no-wheel" },
          { label: "Team picker", href: "/team-picker-wheel" },
        ],
      },
      {
        id: "how-to-add-options",
        question: "How do I add names or options?",
        answer: [
          "Everything starts in the Inputs panel. You can build the list one entry at a time or import several names at once.",
        ],
        steps: [
          {
            parts: [
              { type: "text", value: "Stay on " },
              { type: "chip", label: "Manual Input", variant: "gray" },
              {
                type: "text",
                value: ", type a name or option, then add it to the wheel.",
              },
            ],
          },
          {
            parts: [
              { type: "text", value: "For a long roster, click " },
              { type: "chip", label: "Bulk Add", variant: "blue" },
              {
                type: "text",
                value: " and paste one option per line.",
              },
            ],
          },
          {
            parts: [
              {
                type: "text",
                value: "Clean the list with ",
              },
              { type: "chip", label: "Remove Duplicates", variant: "amber" },
              { type: "text", value: ", " },
              { type: "chip", label: "Shuffle", variant: "gray" },
              { type: "text", value: ", or sort A–Z before you spin." },
            ],
          },
          {
            parts: [
              {
                type: "text",
                value: "On image-friendly wheels, attach a picture to an entry so the slice is easier to recognize.",
              },
            ],
          },
        ],
      },
      {
        id: "how-to-spin",
        question: "How do I spin the wheel?",
        answer: [
          "Once your options are on the wheel, spinning takes one click. The result is random and is stored in your session history.",
        ],
        steps: [
          {
            parts: [
              { type: "text", value: "Click the center " },
              { type: "chip", label: "Spin", variant: "green" },
              {
                type: "text",
                value: " button. The wheel rotates and settles on one option.",
              },
            ],
          },
          {
            parts: [
              { type: "text", value: "Open " },
              { type: "chip", label: "Settings", variant: "gray" },
              {
                type: "text",
                value: " to change speed, duration, Mystery Spin, or manual stop.",
              },
            ],
          },
          {
            parts: [
              {
                type: "text",
                value: "After the spin ends, review the winner popup, then open ",
              },
              { type: "chip", label: "Results", variant: "blue" },
              {
                type: "text",
                value: " anytime you need the recent outcome list.",
              },
            ],
          },
        ],
      },
      {
        id: "is-it-free",
        question: "Is Picker Wheel free to use?",
        answer: [
          "Yes. You can create wheels, spin, adjust settings, and use the available tools without paying. Core decision features stay free so classrooms, families, and small groups can rely on them without setup friction.",
        ],
      },
      {
        id: "is-it-truly-random",
        question: "Are the results truly random?",
        answer: [
          "Each spin picks an endpoint using the browser’s random number generation. On a standard wheel, every option has an equal chance of winning.",
          "That means the wheel is not reading prior results to “even things out,” and it is not favoring a favorite entry. Over a short stretch you may see repeats—that is normal for true random draws, the same way a fair coin can land on heads twice in a row.",
        ],
      },
      {
        id: "can-results-be-rigged",
        question: "Can someone secretly rig the outcome?",
        answer: [
          "Picker Wheel does not include a hidden “force win” control for everyday spinning. There is also no weight editor that quietly makes one slice more likely than another.",
          "If you are running a giveaway or classroom draw, we recommend keeping the screen visible while you spin so everyone can see the same process from start to finish.",
        ],
      },
      {
        id: "are-there-limits",
        question: "Is there a limit on wheels or options?",
        answer: [
          "You can keep multiple wheels for the tools you use and add a generous number of options to a list. Extremely large lists can make the wheel harder to read and slightly slower on older devices, so for big groups it helps to split into shorter wheels or remove options after they have already been chosen.",
        ],
      },
      {
        id: "where-is-data-stored",
        question: "Where is my wheel data stored?",
        answer: [
          "Your lists and settings are saved in your browser so they are ready the next time you return on the same device. You can also use Save in the header to store wheel data through the app’s save endpoints.",
          "There is no login account yet, so treat Save as a convenience on the device and browser you are using. Clearing site data or switching browsers can remove locally kept wheels unless you have saved them again.",
        ],
      },
      {
        id: "how-to-find-more-wheels",
        question: "How do I find other wheel tools?",
        answer: [
          "Categories group tools into Tools, Sports, Video Games, and Travel & World so you can jump straight to the picker you need.",
        ],
        steps: [
          {
            parts: [
              { type: "text", value: "Click " },
              { type: "chip", label: "All Wheels", variant: "green", href: "/spin-wheels" },
              {
                type: "text",
                value: " in the header, or open the Spin Wheels directory.",
              },
            ],
          },
          {
            parts: [
              {
                type: "text",
                value: "Pick a category, then open the tool you want to spin.",
              },
            ],
          },
        ],
        links: [
          { label: "Spin Wheels categories", href: "/spin-wheels" },
          { label: "All wheels", href: "/spin-wheels/all-wheels" },
        ],
      },
      {
        id: "mobile-and-devices",
        question: "Does this work on phones and tablets?",
        answer: [
          "Yes. Picker Wheel runs in a mobile browser—there is no separate app install required. Use an up-to-date browser, keep the page open while spinning, and rotate to landscape if you want a larger wheel view on a small screen.",
        ],
      },
      {
        id: "sharing-and-embed",
        question: "Can I share or embed a wheel?",
        answer: [
          "Public share links and website embeds are not available yet. For now, the practical approach is to build the wheel on the device you will use during the activity, or recreate the same option list on another device.",
          "We know sharing matters for teachers and streamers, and it is on our roadmap. Until then, we prefer to be clear rather than promise a feature that is not ready.",
        ],
      },
      {
        id: "coin-flip-dice-roll",
        question: "Do you have Coin Flip or Dice Roll?",
        answer: [
          "Those tools are listed as coming soon. Until they launch, you can approximate a coin flip with the Yes or No wheel, or roll values with the Number Picker by setting the range you need.",
        ],
        links: [
          { label: "Yes or No picker", href: "/yes-or-no-wheel" },
          { label: "Number picker", href: "/number-picker-wheel" },
        ],
      },
    ],
  },
  {
    id: "editor",
    title: "Wheel settings & editing",
    intro:
      "How to customize spin behavior, sounds, colors, and the options on your wheel—based on the controls that exist in the app today.",
    items: [
      {
        id: "how-to-save-wheel",
        question: "How do I save my wheel?",
        answer: [
          "Your current list and settings stay in the browser automatically. You can also save deliberately before a class or event.",
        ],
        steps: [
          {
            parts: [
              { type: "text", value: "Click " },
              { type: "chip", label: "File", variant: "gray" },
              { type: "text", value: " in the header, then choose " },
              { type: "chip", label: "Save", variant: "green" },
              { type: "text", value: "." },
            ],
          },
          {
            parts: [
              {
                type: "text",
                value: "Do a quick test with ",
              },
              { type: "chip", label: "Spin", variant: "green" },
              {
                type: "text",
                value: " so you know the list and settings are ready before people arrive.",
              },
            ],
          },
        ],
      },
      {
        id: "manage-multiple-wheels",
        question: "How do I switch between multiple wheels?",
        answer: [
          "Keeping separate wheels is useful when morning and afternoon groups need different lists, or when games need their own options.",
        ],
        steps: [
          {
            parts: [
              { type: "text", value: "Open " },
              { type: "chip", label: "Switch Wheel", variant: "gray" },
              {
                type: "text",
                value: " in the header.",
              },
            ],
          },
          {
            parts: [
              {
                type: "text",
                value: "Create a new wheel, rename one, delete one you no longer need, or jump to another saved list.",
              },
            ],
          },
        ],
      },
      {
        id: "bulk-add-and-cleanup",
        question: "How can I paste a full list at once?",
        answer: [
          "Bulk import is the fastest way to move a roster from notes, email, or a spreadsheet into the wheel.",
        ],
        steps: [
          {
            parts: [
              { type: "text", value: "Click " },
              { type: "chip", label: "Bulk Add", variant: "blue" },
              {
                type: "text",
                value: " and paste your options with each item on its own line.",
              },
            ],
          },
          {
            parts: [
              { type: "text", value: "Use " },
              { type: "chip", label: "Remove Duplicates", variant: "amber" },
              {
                type: "text",
                value: " if the paste included repeats.",
              },
            ],
          },
          {
            parts: [
              { type: "text", value: "Click " },
              { type: "chip", label: "Shuffle", variant: "gray" },
              {
                type: "text",
                value: " or sort the list, then press ",
              },
              { type: "chip", label: "Spin", variant: "green" },
              { type: "text", value: "." },
            ],
          },
        ],
      },
      {
        id: "ai-powered-input",
        question: "What is AI-Powered input?",
        answer: [
          "AI-Powered input helps you draft option lists from a short prompt—useful when you want starter ideas for themes, challenges, or categories.",
        ],
        steps: [
          {
            parts: [
              { type: "text", value: "Switch to the " },
              { type: "chip", label: "AI-Powered", variant: "purple" },
              { type: "text", value: " tab." },
            ],
          },
          {
            parts: [
              {
                type: "text",
                value: "Generate suggestions, then review the list and remove anything off-topic before you spin.",
              },
            ],
          },
        ],
      },
      {
        id: "spin-behavior-settings",
        question: "How do I change spin speed or duration?",
        answer: [
          "Shorter spins feel snappy for quick classroom draws. Longer spins build anticipation for giveaways and party games.",
        ],
        steps: [
          {
            parts: [
              { type: "text", value: "Open " },
              { type: "chip", label: "Settings", variant: "gray" },
              { type: "text", value: " from the header." },
            ],
          },
          {
            parts: [
              {
                type: "text",
                value: "Under Spin Behavior, adjust speed and duration. Turn on Mystery Spin, show a spin count, or enable manual stop if you want more control.",
              },
            ],
          },
        ],
      },
      {
        id: "sound-and-confetti",
        question: "How do I control sound and confetti?",
        answer: [
          "Mute is useful in quiet libraries or meeting rooms. Keep sound on when the celebration moment is part of the fun.",
        ],
        steps: [
          {
            parts: [
              { type: "text", value: "Open " },
              { type: "chip", label: "Settings", variant: "gray" },
              { type: "text", value: ", then go to Confetti & Sound." },
            ],
          },
          {
            parts: [
              {
                type: "text",
                value: "Enable or disable celebration effects, mute the spin sound, and change volume.",
              },
            ],
          },
        ],
      },
      {
        id: "change-colors-and-background",
        question: "How do I customize colors and background?",
        answer: [
          "Appearance controls change how the page looks without changing the odds of any option.",
        ],
        steps: [
          {
            parts: [
              { type: "text", value: "Open " },
              { type: "chip", label: "Settings", variant: "gray" },
              {
                type: "text",
                value: " and edit Tool Colors, background color, background image, Spin button style, or banner/logo upload.",
              },
            ],
          },
        ],
      },
      {
        id: "remove-or-edit-options",
        question: "How do I edit or delete an option?",
        answer: [
          "After someone has already been chosen, many hosts remove that name so the next spin only includes people who still need a turn.",
        ],
        steps: [
          {
            parts: [
              {
                type: "text",
                value: "In the Inputs list, select an entry to edit its text.",
              },
            ],
          },
          {
            parts: [
              { type: "text", value: "Click " },
              { type: "chip", label: "Remove", variant: "red" },
              {
                type: "text",
                value: " beside an option to delete it from the wheel.",
              },
            ],
          },
          {
            parts: [
              { type: "text", value: "Use " },
              { type: "chip", label: "Clear All", variant: "amber" },
              {
                type: "text",
                value: " when you want an empty list and a fresh start.",
              },
            ],
          },
        ],
      },
      {
        id: "results-history",
        question: "Where can I see previous spin results?",
        answer: [
          "Results history helps you confirm who already won or review a sequence of draws during a session.",
        ],
        steps: [
          {
            parts: [
              { type: "text", value: "Click " },
              { type: "chip", label: "Results", variant: "blue" },
              {
                type: "text",
                value: " on the wheel screen to open the recent outcome list.",
              },
            ],
          },
        ],
      },
      {
        id: "equal-chance-reminder",
        question: "Can I give one option a higher chance of winning?",
        answer: [
          "Not at the moment. Every option on a standard wheel is treated equally. If you need a special rule—for example, giving a prize two tickets—add that option twice as separate entries so the odds stay visible to everyone watching.",
        ],
      },
    ],
  },
  {
    id: "features",
    title: "Tools, games & rewards",
    intro:
      "A closer look at the shared features available across every Picker Wheel tool—games, achievements, results, settings, and the specialized geography pickers.",
    items: [
      {
        id: "home-page-features",
        question: "What features come with every Picker Wheel?",
        answer: [
          "Every picker pairs the spinner with an option editor. Depending on the tool you can add entries individually, paste a list in bulk, attach images, edit labels, remove duplicates, shuffle or sort the list, and switch between multiple saved wheels.",
          "Across all wheels you also get Results history, Settings for spin and appearance, game modes for short activities, achievements with points and unlockable themes, and analytics that summarize your recent spins.",
          "These extras are optional. When you only need a quick decision, open any wheel, set your list, and spin as usual.",
        ],
        links: [
          { label: "Open the Random Name Picker", href: "/" },
          { label: "Browse all wheels", href: "/spin-wheels/all-wheels" },
        ],
      },
      {
        id: "which-wheels-have-games",
        question: "Do all picker wheels include games, achievements, and results?",
        answer: [
          "Yes. Gaming modes, achievements, themes, Results history, and Settings are part of the shared Picker Wheel experience and apply across every picker tool—names, numbers, letters, yes/no, colors, images, dates, teams, sports, video games, countries, and states.",
        ],
        steps: [
          {
            parts: [
              {
                type: "text",
                value: "Wherever you land, look for ",
              },
              { type: "chip", label: "Games", variant: "amber" },
              { type: "text", value: ", " },
              { type: "chip", label: "Achievements", variant: "amber" },
              { type: "text", value: ", Themes, " },
              { type: "chip", label: "Results", variant: "blue" },
              { type: "text", value: ", and " },
              { type: "chip", label: "Settings", variant: "gray" },
              {
                type: "text",
                value: " around that wheel. The layout stays familiar so you do not have to relearn the interface when you switch tools.",
              },
            ],
          },
        ],
        links: [{ label: "Browse every wheel", href: "/spin-wheels/all-wheels" }],
      },
      {
        id: "country-picker-how-it-works",
        question: "How does the Country Picker Wheel work?",
        answer: [
          "The Country Picker is built for geography lessons, travel ideas, quizzes, and games. Filter by region, shape the list, then spin.",
        ],
        steps: [
          {
            parts: [
              {
                type: "text",
                value: "Open the Country Picker and choose All or a region such as Europe, Asia, Africa, North America, South America, or Oceania.",
              },
            ],
          },
          {
            parts: [
              {
                type: "text",
                value: "Include or remove individual countries, then set display to name, flag, or both. Switch to list or text view when a long list is easier to review that way.",
              },
            ],
          },
          {
            parts: [
              { type: "text", value: "Save favorites, compare countries, or open statistics when you need more than a random result. Use " },
              { type: "chip", label: "AI-Powered", variant: "purple" },
              {
                type: "text",
                value: " suggestions when you want a smaller curated set.",
              },
            ],
          },
          {
            parts: [
              { type: "text", value: "Press " },
              { type: "chip", label: "Spin", variant: "green" },
              {
                type: "text",
                value: ", or open ",
              },
              { type: "chip", label: "Games", variant: "amber" },
              {
                type: "text",
                value: " / ",
              },
              { type: "chip", label: "Achievements", variant: "amber" },
              {
                type: "text",
                value: " for the shared play features available on every picker.",
              },
            ],
          },
        ],
        links: [{ label: "Try the Country Picker", href: "/country-picker-wheel" }],
      },
      {
        id: "state-picker-how-it-works",
        question: "How does the State Picker Wheel work?",
        answer: [
          "Use the State Picker when you need a random first-level region inside a country for lessons, quizzes, trip ideas, or games.",
        ],
        steps: [
          {
            parts: [
              {
                type: "text",
                value: "Choose a supported country. The tool loads its states or regions and selects them for the wheel.",
              },
            ],
          },
          {
            parts: [
              { type: "text", value: "Keep the full set, click " },
              { type: "chip", label: "Select All", variant: "blue" },
              {
                type: "text",
                value: " after edits, or remove locations that should not be part of the draw.",
              },
            ],
          },
          {
            parts: [
              { type: "text", value: "Use " },
              { type: "chip", label: "Shuffle", variant: "gray" },
              {
                type: "text",
                value: " or sort, switch between wheel / list / text views, and open favorites, comparison, or statistics as needed.",
              },
            ],
          },
          {
            parts: [
              { type: "text", value: "When ready, press " },
              { type: "chip", label: "Spin", variant: "green" },
              {
                type: "text",
                value: ". The same ",
              },
              { type: "chip", label: "Games", variant: "amber" },
              {
                type: "text",
                value: ", ",
              },
              { type: "chip", label: "Results", variant: "blue" },
              {
                type: "text",
                value: ", and achievements controls are available here as on other pickers.",
              },
            ],
          },
        ],
        links: [{ label: "Try the State Picker", href: "/state-wheel" }],
      },
      {
        id: "gaming-features-explained",
        question: "Which gaming features can I use with any picker wheel?",
        answer: [
          "Every picker wheel supports the same game modes. Open Games from the wheel screen to turn a normal spin into a short activity.",
        ],
        steps: [
          {
            parts: [
              { type: "text", value: "Click " },
              { type: "chip", label: "Games", variant: "amber" },
              {
                type: "text",
                value: " on any picker wheel.",
              },
            ],
          },
          {
            parts: [
              {
                type: "text",
                value: "Choose a quick mode such as Spin Bingo, Memory, Collection, or Sequence.",
              },
            ],
          },
          {
            parts: [
              {
                type: "text",
                value: "Or pick an advanced mode: Wheel Roulette, Speed Challenge, Memory Match, Combo Challenge, or Precision Mode.",
              },
            ],
          },
          {
            parts: [
              {
                type: "text",
                value: "Some modes need a minimum number of options—add more entries if a game is unavailable, then spin as usual.",
              },
            ],
          },
        ],
        links: [{ label: "Read the game instructions", href: "/game-instructions" }],
      },
      {
        id: "achievements-points-themes",
        question: "How do achievements, points, and themes work on every wheel?",
        answer: [
          "Achievements, points, and themes are shared across picker wheels. Progress stays in the current browser unless site data is cleared.",
        ],
        steps: [
          {
            parts: [
              { type: "text", value: "Open " },
              { type: "chip", label: "Achievements", variant: "amber" },
              {
                type: "text",
                value: " to review milestones earned from spins and game play.",
              },
            ],
          },
          {
            parts: [
              {
                type: "text",
                value: "Points unlock themes. Open the theme control to apply a new look—visual only, never changing the odds.",
              },
            ],
          },
        ],
      },
      {
        id: "all-settings-options",
        question: "Which Settings options are available on every picker?",
        answer: [
          "Settings works the same way on each picker wheel so you can tune the spin without learning a new panel.",
        ],
        steps: [
          {
            parts: [
              { type: "text", value: "Click " },
              { type: "chip", label: "Settings", variant: "gray" },
              { type: "text", value: " in the header." },
            ],
          },
          {
            parts: [
              {
                type: "text",
                value: "Adjust Spin Behavior, Confetti & Sound, Tool Colors, background, Spin button style, and banner/logo upload.",
              },
            ],
          },
        ],
      },
      {
        id: "analytics-and-results",
        question: "What do Results and Analytics show on each wheel?",
        answer: [
          "Use these panels during a session to confirm winners and review activity. Local history can disappear if browser data is cleared.",
        ],
        steps: [
          {
            parts: [
              { type: "text", value: "Click " },
              { type: "chip", label: "Results", variant: "blue" },
              {
                type: "text",
                value: " to see recent winners for the current wheel.",
              },
            ],
          },
          {
            parts: [
              {
                type: "text",
                value: "Open Analytics when you want a summary of spins and selected outcomes for that session.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "people-also-ask",
    title: "People also ask",
    intro:
      "Short answers to common Google searches about spin wheel pickers—what they are, how random they are, and how to use them day to day.",
    items: [
      {
        id: "what-is-a-spin-wheel-picker",
        question: "What is a spin wheel picker?",
        answer: [
          "A spin wheel picker is an online decision helper that selects one item from your list at random. You load the options onto a colorful wheel, press Spin, and the pointer lands on a single result.",
          "People rely on it for classroom draws, giveaways, team picks, party games, workout challenges, chore rotation, and everyday choices like where to eat—anytime a fair random pick is easier than arguing or guessing.",
        ],
        links: [{ label: "Try Picker Wheel", href: "/" }],
      },
      {
        id: "is-the-spin-wheel-really-random",
        question: "Is the spin wheel really random?",
        answer: [
          "Yes. Each spin starts fresh and uses random selection in the browser. The wheel does not “remember” earlier winners or quietly push a favorite name toward the pointer.",
          "Whether you have five options or fifty, every unique entry gets the same chance on that spin. Seeing the same result twice in a short stretch can still happen—the same way a fair coin can land on heads more than once.",
        ],
      },
      {
        id: "can-i-add-custom-options",
        question: "Can I add my own names or custom options?",
        answer: [
          "Yes. Type options one by one or paste a full list at once. You are not limited to people’s names—numbers, prizes, cities, tasks, restaurants, workout ideas, classroom groups, and almost any label you need can go on the wheel.",
        ],
        steps: [
          {
            parts: [
              { type: "text", value: "Use " },
              { type: "chip", label: "Manual Input", variant: "gray" },
              { type: "text", value: " for single entries, or " },
              { type: "chip", label: "Bulk Add", variant: "blue" },
              { type: "text", value: " to paste one option per line." },
            ],
          },
        ],
      },
      {
        id: "how-many-entries-can-i-add",
        question: "How many entries can I add to the wheel?",
        answer: [
          "Most people run dozens of entries without trouble. Very large lists still spin, but slice labels get smaller so everything can fit on the wheel.",
          "For the clearest reading—especially on a phone or projected classroom screen—keep the list large enough for your need but still easy to scan.",
        ],
      },
      {
        id: "do-entries-have-equal-chance",
        question: "Do all entries have an equal chance of winning?",
        answer: [
          "Yes. Each unique option is treated equally during a spin. If every item appears once, each one has the same probability of being selected.",
          "If you deliberately add the same option more than once, that choice takes up more of the wheel and becomes more likely to win. That is a transparent way to give something extra “tickets” when your rules allow it.",
        ],
      },
      {
        id: "remove-winner-after-spin",
        question: "Can I remove the winner after each spin?",
        answer: [
          "Yes. After someone or something is selected, you can remove that entry so it will not come up again. This is the usual approach for multi-winner giveaways, team drafts, and “everyone gets a turn” classroom draws.",
        ],
        steps: [
          {
            parts: [
              { type: "text", value: "After the result appears, click " },
              { type: "chip", label: "Remove", variant: "red" },
              {
                type: "text",
                value: " next to that option in the Inputs list, then spin again.",
              },
            ],
          },
        ],
      },
      {
        id: "can-i-customize-the-wheel-seo",
        question: "Can I customize the wheel?",
        answer: [
          "Yes. You can change segment colors, edit labels, rearrange entries, adjust how long the spin lasts, turn sounds and confetti on or off, and apply themes or other appearance options.",
          "Those controls help the wheel match a classroom display, stream overlay, office event, or personal style without changing how randomness works.",
        ],
        steps: [
          {
            parts: [
              { type: "text", value: "Open " },
              { type: "chip", label: "Settings", variant: "gray" },
              {
                type: "text",
                value: " for spin behavior, sound, colors, and background options.",
              },
            ],
          },
        ],
      },
      {
        id: "do-i-need-an-account",
        question: "Do I need to create an account?",
        answer: [
          "No. You can open a picker and start spinning right away without signing up. Basic use stays available without an account so classrooms and casual users are not blocked by login walls.",
        ],
      },
      {
        id: "can-i-save-wheel-for-later",
        question: "Can I save my wheel for later?",
        answer: [
          "Yes. Your list and settings are kept in the browser for the same device, and you can also use Save from the header when you want a deliberate store of the current wheel.",
          "Teachers, organizers, and streamers often save once and reuse the same roster instead of rebuilding it every time.",
        ],
        steps: [
          {
            parts: [
              { type: "text", value: "Click " },
              { type: "chip", label: "File", variant: "gray" },
              { type: "text", value: " → " },
              { type: "chip", label: "Save", variant: "green" },
              { type: "text", value: " before you leave the page." },
            ],
          },
        ],
      },
      {
        id: "can-i-share-my-wheel",
        question: "Can I share my wheel with other people?",
        answer: [
          "Sharing is available through the Share control on the wheel so friends, classmates, coworkers, or family can use the same list. Link-based sharing continues to improve, and the goal is to make remote meetings, classrooms, and online games easy to run from one shared wheel.",
          "Until a shared link is opened on another device, keep a saved copy on the computer or phone you plan to use live.",
        ],
        steps: [
          {
            parts: [
              { type: "text", value: "Use " },
              { type: "chip", label: "Share", variant: "green" },
              {
                type: "text",
                value: " in the header when you are ready for others to join the same list.",
              },
            ],
          },
        ],
      },
      {
        id: "does-wheel-work-on-mobile",
        question: "Does the wheel work on mobile devices?",
        answer: [
          "Yes. Picker Wheel runs in modern browsers on phones, tablets, laptops, and desktops. There is nothing to install—open the page, build or load your list, and spin.",
        ],
      },
      {
        id: "is-spin-wheel-free",
        question: "Is the spin wheel free to use?",
        answer: [
          "Yes. Creating lists and spinning for everyday decisions stays free. If optional premium extras appear later, the core random picker will remain simple and accessible for regular use.",
        ],
      },
      {
        id: "use-for-giveaways-raffles",
        question: "Can I use the wheel for giveaways or raffles?",
        answer: [
          "Yes—as long as your giveaway follows the laws and platform rules that apply where you run it. Many hosts like a visible spin because the audience can watch the selection happen in real time.",
          "Keep the screen shared, remove winners after each draw when needed, and keep a clear record of results for your own notes.",
        ],
        links: [{ label: "Open Results history tip", href: "/help#analytics-and-results" }],
      },
      {
        id: "is-my-information-private",
        question: "Is my information kept private?",
        answer: [
          "The options you type are used to build and spin your wheel. Lists kept only in your browser stay on that device unless you choose to save them through the app’s save tools.",
          "If you later share a wheel with others, treat that shared list as visible to people who receive access. If you never save or share, the session remains limited to your current visit.",
        ],
      },
      {
        id: "what-if-i-close-the-page",
        question: "What happens if I accidentally close the page?",
        answer: [
          "If the wheel was not saved, closing or refreshing the tab can clear unsaved edits. Locally stored wheels usually return when you reopen the same browser on the same device.",
          "When you know you will reuse a list later, save before you leave so a surprise reload does not erase your work.",
        ],
        steps: [
          {
            parts: [
              { type: "text", value: "Use " },
              { type: "chip", label: "Save", variant: "green" },
              {
                type: "text",
                value: " after important changes, especially before ending a lesson or event.",
              },
            ],
          },
        ],
      },
      {
        id: "can-i-use-emojis",
        question: "Can I use emojis and special characters?",
        answer: [
          "Yes. Modern browsers support emojis, symbols, and a wide range of languages, so you can make slices easier to recognize at a glance—for kids’ activities, game themes, or multilingual lists.",
        ],
      },
      {
        id: "can-i-create-multiple-wheels-seo",
        question: "Can I create multiple wheels?",
        answer: [
          "Yes. You are not stuck with a single list. Many people keep separate wheels for different classes, games, giveaways, meal planning, travel ideas, or projects so each activity stays organized.",
        ],
        steps: [
          {
            parts: [
              { type: "text", value: "Open " },
              { type: "chip", label: "Switch Wheel", variant: "gray" },
              {
                type: "text",
                value: " to create another wheel or jump between saved lists.",
              },
            ],
          },
        ],
      },
      {
        id: "why-wheel-lands-near-another-option",
        question: "Why does the wheel sometimes land close to another option?",
        answer: [
          "The pointer stops where the random result places it. When many slices sit side by side, the stop can look very close to a neighboring section.",
          "The winning option is still the segment the pointer actually lands on—not the one it nearly touched. Zooming the page or using fewer entries can make borders easier to see on a crowded wheel.",
        ],
      },
      {
        id: "use-without-downloading",
        question: "Can I use the wheel without downloading anything?",
        answer: [
          "Yes. Everything runs in your web browser. There is no app install required, and you can begin spinning within seconds on most modern devices.",
        ],
        links: [{ label: "Start spinning now", href: "/" }],
      },
      {
        id: "better-than-drawing-from-a-hat",
        question: "Is this better than drawing names from a hat?",
        answer: [
          "Both approaches can be fair. A digital spin wheel is often faster to prepare and easier to reuse. You can edit the list instantly, remove winners after each draw, keep Results history, save wheels, and run games or classroom activities without rewriting slips of paper.",
          "For live groups, the animated spin also makes the selection feel open and easy for everyone watching to understand.",
        ],
      },
    ],
  },
]

export function getFaqItemById(id: string): HelpFaqItem | undefined {
  for (const section of HELP_FAQ_SECTIONS) {
    const item = section.items.find((entry) => entry.id === id)
    if (item) return item
  }
  return undefined
}
