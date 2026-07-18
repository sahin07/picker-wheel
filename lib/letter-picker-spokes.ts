import {
  LETTER_PICKER_PATH,
  LETTER_PICKER_SITE_URL,
  type LetterPickerSeoPreset,
} from "@/lib/letter-picker-seo"
import type { LetterPickerUseCaseId } from "@/lib/letter-picker-use-cases"
import type { StyleOption } from "@/types/letter-picker"

export type LetterPickerSpokeId =
  | "alphabet"
  | "vowels"
  | "consonants"
  | "scrabble"
  | "uppercase"
  | "lowercase"
  | "phonics"

export type LetterPickerDeepLink = {
  preset: LetterPickerSeoPreset
  style?: StyleOption
  mode?: LetterPickerUseCaseId
  toolTitle?: string
  toolDescription?: string
}

export type LetterPickerSpokeFaq = {
  question: string
  answer: string
}

/** Google E-E-A-T signals: experience, expertise, trust (authoritativeness via pillar + org schema). */
export type LetterPickerSpokeEeat = {
  experience: string
  expertise: string
  trust: string
}

export type LetterPickerSpokeSeo = {
  id: LetterPickerSpokeId
  path: string
  pageTitle: string
  description: string
  h1: string
  shortTitle: string
  heroIntro: string
  keywords: readonly string[]
  articleTitle: string
  articleIntro: readonly string[]
  uniqueSection: {
    title: string
    intro: string
    points: readonly { title: string; description: string }[]
  }
  eeat: LetterPickerSpokeEeat
  faq: readonly LetterPickerSpokeFaq[]
  siblingIds: readonly LetterPickerSpokeId[]
  deepLink: LetterPickerDeepLink
}

export function letterSpokeUrl(path: string): string {
  return `${LETTER_PICKER_SITE_URL}${path}`
}

export const LETTER_PICKER_SPOKES: Record<LetterPickerSpokeId, LetterPickerSpokeSeo> = {
  alphabet: {
    id: "alphabet",
    path: "/alphabet-wheel",
    pageTitle: "Alphabet Wheel | Spin A–Z Letters Online",
    description:
      "Spin a free alphabet wheel to pick a random letter from A to Z. Fair visual spinner for classrooms, games, and learning—no signup required.",
    h1: "Alphabet Wheel",
    shortTitle: "A–Z Alphabet Wheel",
    heroIntro:
      "Need a classic A–Z spinner? This alphabet wheel opens with all 26 letters so you can choose a random letter for classroom turns, word games, or creative prompts. Everyone watches the same fair spin—clearer than a silent random letter generator.",
    keywords: [
      "alphabet wheel",
      "a to z wheel",
      "spin the alphabet",
      "alphabet spinner",
      "random alphabet picker",
      "wheel of letters",
      "a-z letter wheel",
    ],
    articleTitle: "Spin the Full Alphabet Online",
    articleIntro: [
      "An alphabet wheel is the default tool when you want any letter from A to Z with equal odds. Teachers use it for letter-of-the-day draws, presentation order mapped to initials, and warm-ups. Families and party hosts use it when a Scrabble bag or letter tiles are not handy.",
      "This page loads the full alphabet already applied. You can still switch to vowels or consonants, change case, turn on elimination so each letter is used once, or open the main Random Letter Picker for custom lists and Common Uses modes.",
      "If you mainly need vowels for phonics, consonants for blending, or Scrabble-style weights, use the dedicated pages in this cluster instead of rebuilding the set each time.",
    ],
    uniqueSection: {
      title: "When a Full A–Z Wheel Works Best",
      intro:
        "Keep the complete alphabet when the activity should feel open-ended and every letter is fair game.",
      points: [
        {
          title: "Letter of the day",
          description:
            "Spin once at the start of class or a stream and build activities around that letter for the session.",
        },
        {
          title: "Name & category games",
          description:
            "Scattergories-style rounds, “name something that starts with…”, or icebreakers that need the whole alphabet.",
        },
        {
          title: "Creative writing seeds",
          description:
            "Force a character name, place, or opening sentence to start with the spun letter.",
        },
        {
          title: "Fair turn order",
          description:
            "Map students to letters or spin with elimination so each letter (or person) is used once.",
        },
      ],
    },
    eeat: {
      experience:
        "Built from how teachers and game hosts actually run letter draws: one shared spin the group can see, not a private text result on a phone.",
      expertise:
        "Uses the standard English A–Z set (26 letters). Y is treated as a consonant on the Consonant Picker; this A–Z page includes every letter with equal weight unless you change weights yourself.",
      trust:
        "Selection runs in your browser with equal slice weights by default. Free to use, no account required to spin. Saved wheels stay on this device. Not affiliated with any school curriculum publisher.",
    },
    faq: [
      {
        question: "Does the alphabet wheel include every letter A–Z?",
        answer:
          "Yes. It loads 26 equal slices by default. Disable or delete letters you do not want, or use elimination so winners leave the wheel.",
      },
      {
        question: "Is this the same as a random letter generator?",
        answer:
          "It produces a fair random letter, but the spinning alphabet wheel is designed for groups who want to see the pick happen live.",
      },
      {
        question: "Can I switch to vowels only?",
        answer:
          "Yes—use the sidebar presets, or open the dedicated Vowel Picker and Phonics Letter Wheel pages.",
      },
      {
        question: "Can I save my alphabet setup?",
        answer:
          "Yes. Save custom wheels in My Wheels on this device and reopen them later.",
      },
    ],
    siblingIds: ["vowels", "consonants", "uppercase", "lowercase", "scrabble", "phonics"],
    deepLink: {
      preset: "alphabet",
      style: "uppercase",
      toolTitle: "Alphabet Wheel",
      toolDescription: "Full A–Z alphabet spinner",
    },
  },

  vowels: {
    id: "vowels",
    path: "/vowel-picker",
    pageTitle: "Vowel Picker | Spin a Random Vowel Online",
    description:
      "Spin a free vowel picker for A, E, I, O, U. Fair random vowel spinner for phonics, spelling, and classroom games—no signup required.",
    h1: "Vowel Picker",
    shortTitle: "Vowel Picker",
    heroIntro:
      "Looking for a random vowel? This vowel picker loads A, E, I, O, and U so you can spin for phonics drills, spelling warm-ups, and word-building games. Five equal slices keep every vowel fair and easy for a whole class to follow.",
    keywords: [
      "vowel picker",
      "random vowel",
      "random vowel generator",
      "vowel spinner",
      "vowel wheel",
      "pick a vowel",
      "spin a vowel",
    ],
    articleTitle: "Pick a Random Vowel for Learning and Games",
    articleIntro: [
      "English learners practice short and long vowel sounds constantly. A dedicated vowel wheel removes the noise of consonants so students focus on A E I O U—whether you are comparing sounds, building CVC words, or running a vowel-only challenge.",
      "This page opens already set to five vowels with equal weight. For sound cues and phonics prompts after each spin, use the Phonics Letter Wheel. For the full alphabet or consonants, jump to those sibling pages.",
      "You can still change case, add elimination, or return to the Random Letter Picker pillar for custom sets (for example including Y as a vowel in house rules).",
    ],
    uniqueSection: {
      title: "Best Uses for a Vowel Spinner",
      intro: "Use a five-slice vowel picker when consonants would distract from the learning goal.",
      points: [
        {
          title: "Phonics warm-ups",
          description:
            "Spin a vowel, say the sound, then invent three words that use it—short or long as you choose.",
        },
        {
          title: "Spelling bees & word lists",
          description:
            "Force the next word to contain the spun vowel, or build lists sorted by vowel focus.",
        },
        {
          title: "ESL pronunciation",
          description:
            "Isolate vowel sounds that are hard for your learners before mixing them back into full words.",
        },
        {
          title: "Party word games",
          description:
            "Quick “only words with this vowel” rounds that stay short and energetic.",
        },
      ],
    },
    eeat: {
      experience:
        "Sized for live teaching: five large slices stay readable on a projector, unlike a crowded A–Z wheel during vowel-only drills.",
      expertise:
        "Preloads the five primary English vowel letters A, E, I, O, U. Does not include Y by default—add Y manually if your lesson treats it as a vowel.",
      trust:
        "Equal probability across the five vowels unless you edit weights. Runs locally in the browser. Educational practice tool—not a graded assessment system.",
    },
    faq: [
      {
        question: "Which vowels are on the wheel?",
        answer:
          "A, E, I, O, and U. Add Y yourself in the Text tab if your activity treats Y as a vowel.",
      },
      {
        question: "Are all vowels equally likely?",
        answer:
          "Yes, with default equal weights. Change weights in the List or Text tab if you want uneven odds.",
      },
      {
        question: "Is there a phonics version?",
        answer:
          "Yes. Open the Phonics Letter Wheel for vowel spins plus sound cues and practice prompts after each result.",
      },
      {
        question: "Can I use lowercase vowels?",
        answer:
          "Yes—switch style in the sidebar, or open the Lowercase Letter Picker for a full lowercase alphabet.",
      },
    ],
    siblingIds: ["phonics", "consonants", "alphabet", "scrabble", "uppercase", "lowercase"],
    deepLink: {
      preset: "vowels",
      style: "uppercase",
      toolTitle: "Vowel Picker",
      toolDescription: "Random vowel spinner (A E I O U)",
    },
  },

  consonants: {
    id: "consonants",
    path: "/consonant-picker",
    pageTitle: "Consonant Picker | Spin a Random Consonant Online",
    description:
      "Spin a free consonant picker for blending, spelling, and phonics practice. Fair random consonant spinner—no signup required.",
    h1: "Consonant Picker",
    shortTitle: "Consonant Picker",
    heroIntro:
      "Need a random consonant for blending or spelling? This consonant picker loads English consonants (including Y) so you can spin starter letters for word-building, onset practice, and classroom games without vowel clutter.",
    keywords: [
      "consonant picker",
      "random consonant",
      "random consonant generator",
      "consonant spinner",
      "consonant wheel",
      "pick a consonant",
      "spin a consonant",
    ],
    articleTitle: "Choose a Random Consonant for Word Building",
    articleIntro: [
      "Consonant-focused spins help with beginning sounds, blends, and spelling lists where the vowel is already fixed (for example “_at” families). Removing vowels keeps the wheel relevant to the skill you are teaching.",
      "This page preloads consonants with equal weights. Pair it with the Vowel Picker when you want separate onset and vowel draws, or use the Alphabet Wheel when any letter is allowed.",
      "For Scrabble-style frequency (where common consonants appear more often), use the Scrabble Letter Picker instead of equal weights.",
    ],
    uniqueSection: {
      title: "Best Uses for a Consonant Wheel",
      intro: "Reach for consonants when the activity is about starters, blends, or spelling onsets.",
      points: [
        {
          title: "Blending practice",
          description:
            "Spin a consonant, pair it with a known vowel sound, and read the syllable aloud.",
        },
        {
          title: "Spelling starters",
          description:
            "Students must spell a word that begins with the spun consonant—great for bees and whiteboards.",
        },
        {
          title: "Word families",
          description:
            "Lock a rime (like -an or -op) and spin consonants to build a list of real and nonsense words.",
        },
        {
          title: "Elimination rounds",
          description:
            "Remove each consonant after it wins so every starter letter is used once in a game.",
        },
      ],
    },
    eeat: {
      experience:
        "Designed for the “spin a starter letter” moment teachers already do with cards—now visible to the whole room on one screen.",
      expertise:
        "Includes standard English consonants plus Y. Vowels A E I O U are excluded. If you need Y as a vowel-only activity, use the Vowel Picker and add Y there instead.",
      trust:
        "Equal weights by default; your edits stay in the browser session / saved wheel. Free classroom utility with no student data collection required to spin.",
    },
    faq: [
      {
        question: "Is Y included as a consonant?",
        answer:
          "Yes on this page. If your lesson treats Y as a vowel, remove it or use a custom list.",
      },
      {
        question: "How many consonants are on the wheel?",
        answer:
          "Twenty-one letters (B–Z excluding A E I O U). You can disable any you do not want for the activity.",
      },
      {
        question: "Can I weight common consonants higher?",
        answer:
          "Yes—edit weights in the List tab, or open the Scrabble Letter Picker for English tile-style frequencies.",
      },
      {
        question: "What about digraphs like CH or SH?",
        answer:
          "This wheel spins single letters. Add digraphs as custom slices in the Text tab if your lesson needs them.",
      },
    ],
    siblingIds: ["vowels", "phonics", "alphabet", "scrabble", "uppercase", "lowercase"],
    deepLink: {
      preset: "consonants",
      style: "uppercase",
      toolTitle: "Consonant Picker",
      toolDescription: "Random consonant spinner",
    },
  },

  scrabble: {
    id: "scrabble",
    path: "/scrabble-letter-picker",
    pageTitle: "Scrabble Letter Picker | Weighted Letter Wheel Online",
    description:
      "Spin a Scrabble-style letter wheel with English tile frequencies. Practice word games with weighted random letters—free, no signup.",
    h1: "Scrabble Letter Picker",
    shortTitle: "Scrabble Letter Wheel",
    heroIntro:
      "Want letter odds that feel like a tile bag? This Scrabble letter picker loads English-style tile counts so common letters appear more often than Q or Z—useful for practice games, warm-ups, and word-building challenges.",
    keywords: [
      "scrabble letter picker",
      "scrabble letter wheel",
      "weighted letter wheel",
      "scrabble tiles spinner",
      "random scrabble letter",
      "letter tile generator",
      "word game letter picker",
    ],
    articleTitle: "Spin Weighted Letters for Word-Game Practice",
    articleIntro: [
      "Equal A–Z odds are perfect for fair classroom draws, but word games feel different when E and A show up more than J or X. This page mirrors common English Scrabble-style tile frequencies so practice rounds feel closer to drawing from a bag.",
      "After each spin you can still read the letter and use sidebar tools to adjust weights, switch case, or eliminate letters. For official tournament play, use a physical set or licensed app—this page is a free practice spinner, not an official Scrabble product.",
      "Need equal odds instead? Open the Alphabet Wheel. Need vowels only? Use the Vowel Picker or Phonics Letter Wheel.",
    ],
    uniqueSection: {
      title: "Why Use Weighted Letters?",
      intro:
        "Weighted spins help when you want realistic letter scarcity—not when every student must have an equal letter chance.",
      points: [
        {
          title: "Word-building warm-ups",
          description:
            "Spin several letters to form a rack, then challenge players to invent the highest-scoring word.",
        },
        {
          title: "Teaching letter frequency",
          description:
            "Show learners that English uses some letters far more than others—weights make that visible.",
        },
        {
          title: "House-rule games",
          description:
            "Run Scattergories-style or anagram rounds with bag-like odds without carrying tiles.",
        },
        {
          title: "Stream challenges",
          description:
            "Viewers see rare letters land less often, which keeps high-value tiles exciting.",
        },
      ],
    },
    eeat: {
      experience:
        "Aimed at word-game hosts who already explain “E is common, Q is rare”—the wheel makes that intuition visible during practice.",
      expertise:
        "Weights follow widely used English Scrabble-style tile counts (for example E is heavier than Q). Point values shown in Word games mode are for practice reference only.",
      trust:
        "Not affiliated with, endorsed by, or connected to Scrabble, Hasbro, or Mattel. For entertainment and learning practice. Random draws happen in your browser; always verify house rules before competitive play.",
    },
    faq: [
      {
        question: "Is this an official Scrabble tool?",
        answer:
          "No. It is an independent practice spinner that uses Scrabble-style English tile frequencies. It is not affiliated with Scrabble or its trademark owners.",
      },
      {
        question: "Why do some letters appear more often?",
        answer:
          "Weights mirror common tile counts so frequent letters (like E and A) are more likely than rare ones (like Q and Z).",
      },
      {
        question: "Can I switch back to equal odds?",
        answer:
          "Yes—load the Alphabet Wheel or reset weights to 1 for every letter in the List tab.",
      },
      {
        question: "Does it show point values?",
        answer:
          "Use the Word games Common Use on the main Random Letter Picker for Scrabble-style point cards after a spin.",
      },
    ],
    siblingIds: ["alphabet", "vowels", "consonants", "phonics", "uppercase", "lowercase"],
    deepLink: {
      preset: "scrabble",
      style: "uppercase",
      toolTitle: "Scrabble Letter Wheel",
      toolDescription: "Weighted letters (Scrabble-style tile counts)",
    },
  },

  uppercase: {
    id: "uppercase",
    path: "/uppercase-letter-picker",
    pageTitle: "Uppercase Letter Picker | Capital Alphabet Wheel",
    description:
      "Spin a free uppercase letter picker for capital A–Z. Ideal for early learners, print practice, and classroom games.",
    h1: "Uppercase Letter Picker",
    shortTitle: "Uppercase Letter Wheel",
    heroIntro:
      "Teaching capital letters? This uppercase letter picker loads A–Z in capitals so early learners can spin, name, and match print letters with a clear visual wheel the whole class can see.",
    keywords: [
      "uppercase letter picker",
      "capital letter wheel",
      "uppercase alphabet spinner",
      "capital letters spinner",
      "random capital letter",
      "uppercase alphabet wheel",
    ],
    articleTitle: "Practice Capital Letters with a Spinning Wheel",
    articleIntro: [
      "Many early literacy routines separate uppercase recognition from lowercase. A capital-only wheel keeps the visual model consistent: big print letters, no mixed-case confusion during the first lessons.",
      "This page opens with uppercase A–Z. Switch to the Lowercase Letter Picker when you are ready for small letters, or use the Alphabet Wheel when case does not matter.",
      "Add elimination for “letter hunt” games where each capital must be found once on a chart or in the room.",
    ],
    uniqueSection: {
      title: "Best Uses for Capital Letters",
      intro: "Use uppercase when print recognition or name initials are the goal.",
      points: [
        {
          title: "Letter recognition",
          description:
            "Spin, say the letter name, then find it on an alphabet chart or in a book title.",
        },
        {
          title: "Name initials",
          description:
            "Connect capitals to the first letter of student names for a personal literacy link.",
        },
        {
          title: "Sign & poster hunts",
          description:
            "Send learners to find the spun capital on classroom labels and hallway signs.",
        },
        {
          title: "Transition to lowercase",
          description:
            "Master capitals first, then open the Lowercase Letter Picker for matching pairs.",
        },
      ],
    },
    eeat: {
      experience:
        "Matches how many preschool and kindergarten teachers introduce print: capitals first, large and unmistakable on the board.",
      expertise:
        "Displays the standard English uppercase set A–Z. Does not teach letter formation strokes; pair with your handwriting curriculum.",
      trust:
        "Free browser tool with equal letter odds by default. No student accounts required. Supplement—not a replacement—for structured phonics programs.",
    },
    faq: [
      {
        question: "Are all letters capitals?",
        answer:
          "Yes on this page. Use the Lowercase Letter Picker or the style control if you need small letters.",
      },
      {
        question: "Can I mix cases?",
        answer:
          "Choose mixed style on the main Random Letter Picker, or spin uppercase and lowercase pages in sequence for matching games.",
      },
      {
        question: "Is every capital equally likely?",
        answer:
          "Yes with default equal weights. Adjust weights only if your activity needs uneven odds.",
      },
      {
        question: "Does it work on a tablet?",
        answer:
          "Yes. The letter spinner is mobile-friendly for carpet time and small-group tables.",
      },
    ],
    siblingIds: ["lowercase", "alphabet", "phonics", "vowels", "consonants", "scrabble"],
    deepLink: {
      preset: "alphabet",
      style: "uppercase",
      toolTitle: "Uppercase Letter Wheel",
      toolDescription: "Capital A–Z letter spinner",
    },
  },

  lowercase: {
    id: "lowercase",
    path: "/lowercase-letter-picker",
    pageTitle: "Lowercase Letter Picker | Small Letter Alphabet Wheel",
    description:
      "Spin a free lowercase letter picker for a–z. Great for reading warm-ups, handwriting practice, and early literacy games.",
    h1: "Lowercase Letter Picker",
    shortTitle: "Lowercase Letter Wheel",
    heroIntro:
      "Ready for small letters? This lowercase letter picker loads a–z so readers can practice the letter shapes they see most often in books—with a fair spin the whole group can watch.",
    keywords: [
      "lowercase letter picker",
      "lowercase alphabet wheel",
      "small letter spinner",
      "random lowercase letter",
      "lowercase alphabet spinner",
      "a to z lowercase wheel",
    ],
    articleTitle: "Spin Lowercase Letters for Reading Practice",
    articleIntro: [
      "Most text students read is lowercase. A small-letter wheel supports decoding warm-ups, handwriting reviews, and “find this letter in the sentence” games without flashing capitals that look different (b/d, p/q confusion stays in the forms they actually read).",
      "This page starts in lowercase a–z. Use the Uppercase Letter Picker for capitals, or the Alphabet Wheel when case is flexible.",
      "Teachers often alternate: spin lowercase here, then ask students to write the matching capital—or the reverse.",
    ],
    uniqueSection: {
      title: "Best Uses for Lowercase Spins",
      intro: "Choose lowercase when the goal is reading print, not learning letter names in isolation.",
      points: [
        {
          title: "Reading warm-ups",
          description:
            "Spin a letter, then hunt for it in a shared sentence or decodable book page.",
        },
        {
          title: "Handwriting review",
          description:
            "Practice the spun letter’s formation on whiteboards after the wheel stops.",
        },
        {
          title: "Sound-symbol links",
          description:
            "Say the sound for the lowercase letter, then brainstorm words that start with it.",
        },
        {
          title: "Case matching",
          description:
            "Pair with the Uppercase Letter Picker: spin one, find or write the other.",
        },
      ],
    },
    eeat: {
      experience:
        "Built for the stage after capitals: students meeting the letterforms that dominate real books and worksheets.",
      expertise:
        "Uses standard English lowercase a–z. Visual confusions (b/d, p/q) are unchanged—use your usual multisensory supports alongside the spin.",
      trust:
        "Equal odds by default; free and signup-free to spin. A practice aid for literacy routines, not a diagnostic test.",
    },
    faq: [
      {
        question: "Are the letters all lowercase?",
        answer:
          "Yes. Switch style or open the Uppercase Letter Picker for capitals.",
      },
      {
        question: "Can I use this for phonics sounds?",
        answer:
          "Yes for letter–sound warm-ups. For vowel-focused phonics with prompts, try the Phonics Letter Wheel.",
      },
      {
        question: "Can I remove confusing letters?",
        answer:
          "Disable slices you want to skip (for example separate b and d drills) or use elimination across a full round.",
      },
      {
        question: "Does it include punctuation?",
        answer:
          "No—letters only. Add custom slices in the Text tab if you need extras.",
      },
    ],
    siblingIds: ["uppercase", "alphabet", "phonics", "vowels", "consonants", "scrabble"],
    deepLink: {
      preset: "alphabet",
      style: "lowercase",
      toolTitle: "Lowercase Letter Wheel",
      toolDescription: "Lowercase a–z letter spinner",
    },
  },

  phonics: {
    id: "phonics",
    path: "/phonics-letter-wheel",
    pageTitle: "Phonics Letter Wheel | Vowel Sounds Practice Spinner",
    description:
      "Spin a free phonics letter wheel focused on vowels with sound cues. Classroom-friendly random letter spinner for phoneme practice.",
    h1: "Phonics Letter Wheel",
    shortTitle: "Phonics Letter Wheel",
    heroIntro:
      "Practice vowel sounds with a live spin. This phonics letter wheel loads vowels and pairs each result with a sound cue and short practice prompt—so phonics warm-ups stay interactive for the whole class.",
    keywords: [
      "phonics letter wheel",
      "phonics spinner",
      "vowel sounds wheel",
      "phonics letter picker",
      "phoneme practice spinner",
      "classroom phonics wheel",
    ],
    articleTitle: "Use a Letter Wheel for Phonics Warm-Ups",
    articleIntro: [
      "Phonics lessons work best when students hear, see, and produce sounds quickly. A vowel-focused wheel keeps the set small, while the result card adds a phoneme cue and a simple “say it / find a word” prompt after each spin.",
      "This page applies the phonics Common Use: vowels on the wheel plus mode-specific results. For consonants or full A–Z without phonics prompts, use the Consonant Picker or Alphabet Wheel.",
      "Always follow your school’s phonics scope and sequence—this tool supports practice moments; it does not replace a structured reading program.",
    ],
    uniqueSection: {
      title: "How to Run a Phonics Spin",
      intro: "Keep rounds short. One spin, one sound, one quick response—then spin again.",
      points: [
        {
          title: "Sound first",
          description:
            "After the wheel stops, say the phoneme together before naming example words.",
        },
        {
          title: "Word examples",
          description:
            "Ask for one word that uses the sound in the initial, medial, or final position.",
        },
        {
          title: "Blend next",
          description:
            "Pair the spun vowel with a consonant from the Consonant Picker to build a syllable.",
        },
        {
          title: "Track coverage",
          description:
            "Turn on elimination so each vowel is practiced once before you reset.",
        },
      ],
    },
    eeat: {
      experience:
        "Shaped around carpet-time and small-group phonics: fast rounds, visible to every student, with a prompt ready after the spin.",
      expertise:
        "Focuses on the five vowel letters with practice-oriented sound cues. Pronunciation can vary by accent and program (for example short vs long a)—use the cue as a starting point and model the sound your curriculum expects.",
      trust:
        "Educational practice aid only. Not a curriculum, assessment, or medical/speech-therapy device. Free browser tool; no student login required to spin.",
    },
    faq: [
      {
        question: "What letters are on the phonics wheel?",
        answer:
          "Vowels A, E, I, O, and U, with a phonics-style result card after each spin.",
      },
      {
        question: "Are the sound cues universal?",
        answer:
          "They are practical classroom prompts. Accents and programs differ—always model the target sound from your phonics scope and sequence.",
      },
      {
        question: "Can I practice consonants too?",
        answer:
          "Yes. Use the Consonant Picker for onsets, or the Alphabet Wheel for mixed practice.",
      },
      {
        question: "Is this aligned to a specific curriculum?",
        answer:
          "No. It is a flexible spinner you can adapt beside Science of Reading–aligned or other programs you already use.",
      },
    ],
    siblingIds: ["vowels", "consonants", "alphabet", "lowercase", "uppercase", "scrabble"],
    deepLink: {
      preset: "vowels",
      style: "uppercase",
      mode: "phonics",
      toolTitle: "Phonics Letter Wheel",
      toolDescription: "Vowel phonics spinner with sound practice prompts",
    },
  },
}

export function getLetterPickerSpoke(id: LetterPickerSpokeId): LetterPickerSpokeSeo {
  return LETTER_PICKER_SPOKES[id]
}

export function getLetterSpokeSiblings(spoke: LetterPickerSpokeSeo): LetterPickerSpokeSeo[] {
  return spoke.siblingIds.map((id) => LETTER_PICKER_SPOKES[id])
}

export const LETTER_PICKER_CLUSTER_LINKS = [
  {
    label: "Random Letter Picker",
    href: LETTER_PICKER_PATH,
    description: "Main pillar — any letter set, Common Uses modes, and custom alphabets.",
  },
  ...Object.values(LETTER_PICKER_SPOKES).map((spoke) => ({
    label: spoke.shortTitle,
    href: spoke.path,
    description: spoke.description.slice(0, 110) + (spoke.description.length > 110 ? "…" : ""),
  })),
] as const
