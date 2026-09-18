import {
  WORD_PICKER_WHEEL_PATH,
  WORD_PICKER_WHEEL_SITE_URL,
} from "@/lib/word-picker-wheel-seo"
import {
  getWordPickerUseCase,
  registerWordPickerExpansionPacks,
  type WordPickerCategoryId,
  type WordPickerUseCaseAccent,
  type WordPickerUseCaseConfig,
  type WordPickerUseCaseId,
} from "@/lib/word-picker-wheel-use-cases"
import {
  EXPANSION_PACKS,
  EXPANSION_SPOKES,
} from "@/lib/word-picker-spoke-expansion.generated"

registerWordPickerExpansionPacks(
  EXPANSION_PACKS.map((pack) => ({
    ...pack,
    defaultMode: pack.defaultMode as WordPickerUseCaseConfig["defaultMode"] | undefined,
  })),
)

/** Core + expansion spoke ids. */
export type WordPickerSpokeId = string

export type WordPickerDeepLink = {
  useCaseId: WordPickerUseCaseId
  config: WordPickerUseCaseConfig
}

export type WordPickerSpokeFaq = { question: string; answer: string }

export type WordPickerSpokeSeo = {
  id: WordPickerSpokeId
  path: string
  category: WordPickerCategoryId
  pageTitle: string
  description: string
  h1: string
  shortTitle: string
  heroIntro: string
  keywords: readonly string[]
  faq: WordPickerSpokeFaq[]
  deepLink: WordPickerDeepLink
  popular?: boolean
}

function spoke(
  partial: Omit<WordPickerSpokeSeo, "deepLink"> & { useCaseId: WordPickerUseCaseId },
): WordPickerSpokeSeo {
  const useCase = getWordPickerUseCase(partial.useCaseId)
  if (!useCase) throw new Error(`Missing use case: ${partial.useCaseId}`)
  const { useCaseId: _id, ...rest } = partial
  return {
    ...rest,
    deepLink: { useCaseId: partial.useCaseId, config: useCase.config },
  }
}

const WORD_PICKER_CORE_SPOKES: Record<string, WordPickerSpokeSeo> = {
  "common-words": spoke({
    id: "common-words",
    path: "/common-words-wheel",
    category: "categories",
    useCaseId: "common",
    popular: true,
    pageTitle: "Common Words Wheel | Random Everyday Word Picker",
    description: "Spin everyday common words for warm-ups, writing, and classroom games.",
    h1: "Common Words Wheel",
    shortTitle: "Common Words",
    heroIntro: "Load a pack of everyday words and spin for a quick random pick.",
    keywords: ["common words wheel", "everyday word picker", "random common words"],
    faq: [
      {
        question: "What are common words good for?",
        answer: "Warm-ups, icebreakers, simple writing prompts, and quick classroom spins.",
      },
    ],
  }),
  "funny-words": spoke({
    id: "funny-words",
    path: "/funny-words-wheel",
    category: "categories",
    useCaseId: "funny",
    popular: true,
    pageTitle: "Funny Words Wheel | Silly Random Word Generator",
    description: "Spin funny and whimsical words for parties, icebreakers, and creative prompts.",
    h1: "Funny Words Wheel",
    shortTitle: "Funny Words",
    heroIntro: "Pick silly words that spark laughs and unexpected writing ideas.",
    keywords: ["funny words wheel", "silly word generator", "funny random words"],
    faq: [
      {
        question: "Can I use funny words in class?",
        answer: "Yes—keep it light for icebreakers and creative writing. All packs here are family-friendly.",
      },
    ],
  }),
  "writing-prompt": spoke({
    id: "writing-prompt",
    path: "/writing-prompt-word-wheel",
    category: "writing",
    useCaseId: "writing",
    popular: true,
    pageTitle: "Writing Prompt Word Wheel | Creative Writing Word Generator",
    description: "Spin random words for creative writing prompts, stories, and brainstorming.",
    h1: "Writing Prompt Word Wheel",
    shortTitle: "Writing Prompts",
    heroIntro: "Get a random word to start a scene, journal entry, or writing challenge.",
    keywords: ["writing prompt word wheel", "creative writing word generator", "random writing words"],
    faq: [
      {
        question: "How do writers use this wheel?",
        answer: "Spin once for a seed word, or use Three Words / Story mode to build a fuller prompt.",
      },
    ],
  }),
  "story-words": spoke({
    id: "story-words",
    path: "/story-word-generator",
    category: "writing",
    useCaseId: "story",
    popular: true,
    pageTitle: "Story Word Generator | Random Story Words Wheel",
    description: "Generate story words for characters, settings, and plot sparks.",
    h1: "Story Word Generator",
    shortTitle: "Story Words",
    heroIntro: "Spin story ingredients—then use Story mode for character, setting, and object.",
    keywords: ["story word generator", "random story words", "fiction word wheel"],
    faq: [
      {
        question: "What is Story mode?",
        answer: "After you spin, the tool adds related words labeled as Character, Setting, and Object.",
      },
    ],
  }),
  "poetry-words": spoke({
    id: "poetry-words",
    path: "/poetry-word-picker",
    category: "writing",
    useCaseId: "poetry",
    pageTitle: "Poetry Word Picker | Random Poetry Word Wheel",
    description: "Spin lyrical words for poems, verses, and poetry challenges.",
    h1: "Poetry Word Picker",
    shortTitle: "Poetry Words",
    heroIntro: "Pick evocative words to seed a poem or poetry challenge.",
    keywords: ["poetry word picker", "poetry word generator", "random poetry words"],
    faq: [
      {
        question: "Can I combine poetry words?",
        answer: "Yes. Use Three Words mode to challenge yourself to include multiple spun words.",
      },
    ],
  }),
  "writing-generator": spoke({
    id: "writing-generator",
    path: "/random-word-generator-for-writing",
    category: "writing",
    useCaseId: "writing",
    pageTitle: "Random Word Generator for Writing | Free Writing Word Wheel",
    description: "A random word generator tuned for writers—prompts, stories, and brainstorming.",
    h1: "Random Word Generator for Writing",
    shortTitle: "Writing Generator",
    heroIntro: "A writing-focused word spinner with prompt-ready packs and challenge modes.",
    keywords: ["random word generator for writing", "writing word generator", "story prompt words"],
    faq: [
      {
        question: "Is this different from the main Word Picker?",
        answer: "Same engine, writing-focused word pack and copy—built for authors and classrooms.",
      },
    ],
  }),
  classroom: spoke({
    id: "classroom",
    path: "/classroom-word-picker",
    category: "classroom",
    useCaseId: "classroom",
    popular: true,
    pageTitle: "Classroom Word Picker | Random Vocabulary Wheel for Teachers",
    description: "Pick random classroom vocabulary words with elimination mode for fair turns.",
    h1: "Classroom Word Picker",
    shortTitle: "Classroom Vocab",
    heroIntro: "Fair random vocabulary picks for questions, practice, and discussion.",
    keywords: ["classroom word picker", "teacher vocabulary wheel", "random vocabulary for class"],
    faq: [
      {
        question: "Does elimination stay on?",
        answer: "Yes by default on this page so each student can get a unique word.",
      },
    ],
  }),
  vocabulary: spoke({
    id: "vocabulary",
    path: "/vocabulary-word-wheel",
    category: "classroom",
    useCaseId: "vocab",
    pageTitle: "Vocabulary Word Wheel | Random Vocabulary Generator",
    description: "Spin vocabulary words for study, ESL, and English practice.",
    h1: "Vocabulary Word Wheel",
    shortTitle: "Vocabulary",
    heroIntro: "Build vocabulary with random spins and an optional definition card.",
    keywords: ["vocabulary word wheel", "random vocabulary generator", "vocab spinner"],
    faq: [
      {
        question: "Can I see definitions?",
        answer: "After spinning, the vocab card shows definition and part of speech when available.",
      },
    ],
  }),
  spelling: spoke({
    id: "spelling",
    path: "/spelling-word-wheel",
    category: "classroom",
    useCaseId: "spelling",
    pageTitle: "Spelling Word Wheel | Random Spelling Practice",
    description: "Spin spelling words for bees, homework, and classroom drills.",
    h1: "Spelling Word Wheel",
    shortTitle: "Spelling",
    heroIntro: "Random spelling words with no-repeat ready for practice rounds.",
    keywords: ["spelling word wheel", "spelling bee word generator", "random spelling words"],
    faq: [
      {
        question: "Can I paste my own spelling list?",
        answer: "Yes. Use the Text tab or Import TXT/CSV to load your class list.",
      },
    ],
  }),
  esl: spoke({
    id: "esl",
    path: "/esl-word-wheel",
    category: "classroom",
    useCaseId: "esl",
    pageTitle: "ESL Word Wheel | English Learning Word Picker",
    description: "Practice everyday English with a random ESL word wheel.",
    h1: "ESL Word Wheel",
    shortTitle: "ESL Words",
    heroIntro: "Useful everyday words for English learners and language practice.",
    keywords: ["esl word wheel", "english learning word picker", "esl vocabulary generator"],
    faq: [
      {
        question: "Is this good for beginners?",
        answer: "Yes. The ESL pack uses practical everyday words; try Beginner Words for even simpler sets.",
      },
    ],
  }),
  sight: spoke({
    id: "sight",
    path: "/sight-word-picker",
    category: "classroom",
    useCaseId: "sight",
    popular: true,
    pageTitle: "Sight Word Picker | Random Sight Words Wheel",
    description: "Spin high-frequency sight words for early reading practice.",
    h1: "Sight Word Picker",
    shortTitle: "Sight Words",
    heroIntro: "High-frequency words for young readers—with elimination for fair turns.",
    keywords: ["sight word picker", "sight words wheel", "random sight words"],
    faq: [
      {
        question: "Can I change the sight word list?",
        answer: "Yes. Paste your school’s list or import a TXT/CSV file anytime.",
      },
    ],
  }),
  pictionary: spoke({
    id: "pictionary",
    path: "/pictionary-word-wheel",
    category: "games",
    useCaseId: "pictionary",
    popular: true,
    pageTitle: "Pictionary Word Wheel | Random Pictionary Word Generator",
    description: "Spin drawable words for Pictionary and sketch party games.",
    h1: "Pictionary Word Wheel",
    shortTitle: "Pictionary",
    heroIntro: "Get a random word to draw—Drawing mode is on by default.",
    keywords: ["pictionary word wheel", "pictionary word generator", "random pictionary words"],
    faq: [
      {
        question: "Does elimination help party games?",
        answer: "Yes. Elimination removes used words so teams don’t repeat prompts.",
      },
    ],
  }),
  charades: spoke({
    id: "charades",
    path: "/charades-word-wheel",
    category: "games",
    useCaseId: "charades",
    popular: true,
    pageTitle: "Charades Word Wheel | Random Charades Generator",
    description: "Spin words to act out for charades and party acting games.",
    h1: "Charades Word Wheel",
    shortTitle: "Charades",
    heroIntro: "Act-out prompts with Acting mode enabled for party rounds.",
    keywords: ["charades word wheel", "charades word generator", "random charades words"],
    faq: [
      {
        question: "Can kids use this?",
        answer: "Yes—the list is family-friendly. Try Kids Words for even simpler prompts.",
      },
    ],
  }),
  "word-challenge": spoke({
    id: "word-challenge",
    path: "/word-challenge-wheel",
    category: "games",
    useCaseId: "challenge",
    pageTitle: "Word Challenge Wheel | Random Word Challenge Generator",
    description: "Spin mixed challenge words for speed rounds and party games.",
    h1: "Word Challenge Wheel",
    shortTitle: "Word Challenge",
    heroIntro: "Mixed challenge words—Three Words mode is ready for combo rounds.",
    keywords: ["word challenge wheel", "random word challenge", "word game spinner"],
    faq: [
      {
        question: "What is Three Words mode?",
        answer: "One spin plus two extra words from the pack to use together in a challenge.",
      },
    ],
  }),
  "drawing-words": spoke({
    id: "drawing-words",
    path: "/random-drawing-word-wheel",
    category: "drawing",
    useCaseId: "drawing",
    popular: true,
    pageTitle: "Random Drawing Word Wheel | What Should I Draw Words",
    description: "Spin a random word to draw, sketch, or doodle.",
    h1: "Random Drawing Word Wheel",
    shortTitle: "Drawing Words",
    heroIntro: "Need something to sketch? Spin a drawing prompt word.",
    keywords: ["random drawing word", "drawing word wheel", "what should i draw word"],
    faq: [
      {
        question: "Is this the same as What Should I Draw?",
        answer: "Related idea, word-focused pack. Use Drawing mode for a clear sketch challenge.",
      },
    ],
  }),
  "drawing-prompt": spoke({
    id: "drawing-prompt",
    path: "/drawing-prompt-word-wheel",
    category: "drawing",
    useCaseId: "drawing",
    pageTitle: "Drawing Prompt Word Wheel | Art Prompt Word Generator",
    description: "Generate drawing prompt words for art challenges and sketch practice.",
    h1: "Drawing Prompt Word Wheel",
    shortTitle: "Drawing Prompts",
    heroIntro: "Art-friendly words for Inktober-style and daily sketch challenges.",
    keywords: ["drawing prompt word wheel", "art prompt generator", "sketch word spinner"],
    faq: [
      {
        question: "Can I import my own prompt list?",
        answer: "Yes. Paste or upload a custom list for themed art months.",
      },
    ],
  }),
  speaking: spoke({
    id: "speaking",
    path: "/random-speaking-topic-wheel",
    category: "speaking",
    useCaseId: "speaking",
    pageTitle: "Random Speaking Topic Wheel | Impromptu Speaking Words",
    description: "Spin speaking topics and words for conversation and public speaking practice.",
    h1: "Random Speaking Topic Wheel",
    shortTitle: "Speaking Topics",
    heroIntro: "Impromptu speaking and discussion starters in one spin.",
    keywords: ["random speaking topic", "impromptu speaking wheel", "conversation word wheel"],
    faq: [
      {
        question: "Good for classrooms?",
        answer: "Yes—use for ESL conversation, debate warm-ups, and 60-second talks.",
      },
    ],
  }),
  acting: spoke({
    id: "acting",
    path: "/acting-prompt-word-wheel",
    category: "speaking",
    useCaseId: "acting",
    pageTitle: "Acting Prompt Word Wheel | Random Acting Prompts",
    description: "Spin acting prompts and emotion words for drama and improv.",
    h1: "Acting Prompt Word Wheel",
    shortTitle: "Acting Prompts",
    heroIntro: "Emotion and action prompts for drama class and improv games.",
    keywords: ["acting prompt wheel", "drama word spinner", "improv prompt generator"],
    faq: [
      {
        question: "How is Acting mode used?",
        answer: "After the spin, the card challenges you to act out or describe the word.",
      },
    ],
  }),
  kids: spoke({
    id: "kids",
    path: "/kids-word-wheel",
    category: "kids",
    useCaseId: "kids",
    popular: true,
    pageTitle: "Kids Word Wheel | Easy Random Words for Children",
    description: "Family-friendly easy words for kids’ games, stories, and classrooms.",
    h1: "Kids Word Wheel",
    shortTitle: "Kids Words",
    heroIntro: "Simple words kids can read, draw, and use in stories.",
    keywords: ["kids word wheel", "easy words for kids", "children word generator"],
    faq: [
      {
        question: "Are the words age-appropriate?",
        answer: "Yes. Kids and preschool packs stay family-friendly and simple.",
      },
    ],
  }),
  preschool: spoke({
    id: "preschool",
    path: "/preschool-word-wheel",
    category: "kids",
    useCaseId: "preschool",
    pageTitle: "Preschool Word Wheel | Simple Words for Little Learners",
    description: "Very simple preschool words for early learning games.",
    h1: "Preschool Word Wheel",
    shortTitle: "Preschool",
    heroIntro: "Short, clear words for preschool literacy and play.",
    keywords: ["preschool word wheel", "preschool vocabulary", "simple words for toddlers"],
    faq: [
      {
        question: "Can parents use this at home?",
        answer: "Absolutely—great for reading practice and playful learning spins.",
      },
    ],
  }),
  noun: spoke({
    id: "noun",
    path: "/noun-word-wheel",
    category: "word-type",
    useCaseId: "noun",
    pageTitle: "Noun Word Wheel | Random Noun Generator",
    description: "Spin random nouns for grammar practice, writing, and games.",
    h1: "Noun Word Wheel",
    shortTitle: "Nouns",
    heroIntro: "People, places, and things—ready for grammar and creative spins.",
    keywords: ["noun word wheel", "random noun generator", "noun spinner"],
    faq: [{ question: "Can I mix parts of speech?", answer: "Load another pack or paste a mixed list anytime." }],
  }),
  verb: spoke({
    id: "verb",
    path: "/verb-word-wheel",
    category: "word-type",
    useCaseId: "verb",
    pageTitle: "Verb Word Wheel | Random Verb Generator",
    description: "Spin random verbs for writing, ESL, and action games.",
    h1: "Verb Word Wheel",
    shortTitle: "Verbs",
    heroIntro: "Action words for sentences, stories, and movement games.",
    keywords: ["verb word wheel", "random verb generator", "verb spinner"],
    faq: [{ question: "Good with Acting mode?", answer: "Yes—verbs pair well with act-out challenges." }],
  }),
  adjective: spoke({
    id: "adjective",
    path: "/adjective-word-wheel",
    category: "word-type",
    useCaseId: "adjective",
    pageTitle: "Adjective Word Wheel | Random Adjective Generator",
    description: "Spin descriptive adjectives for richer writing and vocab practice.",
    h1: "Adjective Word Wheel",
    shortTitle: "Adjectives",
    heroIntro: "Describing words to level up stories and sentences.",
    keywords: ["adjective word wheel", "random adjective generator", "describing words wheel"],
    faq: [{ question: "Classroom use?", answer: "Great for “add an adjective” writing warm-ups." }],
  }),
  action: spoke({
    id: "action",
    path: "/action-word-wheel",
    category: "word-type",
    useCaseId: "action",
    popular: true,
    pageTitle: "Action Word Wheel | Random Action Verbs",
    description: "Spin action verbs for charades, PE warm-ups, and writing.",
    h1: "Action Word Wheel",
    shortTitle: "Action Words",
    heroIntro: "Movement-friendly verbs with Acting mode ready.",
    keywords: ["action word wheel", "action verbs spinner", "random action words"],
    faq: [{ question: "PE and drama?", answer: "Yes—use for movement cues and improv prompts." }],
  }),
  beginner: spoke({
    id: "beginner",
    path: "/beginner-words-wheel",
    category: "difficulty",
    useCaseId: "beginner",
    pageTitle: "Beginner Words Wheel | Easy Vocabulary Spinner",
    description: "Easy beginner words for new readers and ESL starters.",
    h1: "Beginner Words Wheel",
    shortTitle: "Beginner",
    heroIntro: "Approachable vocabulary for early learning.",
    keywords: ["beginner words wheel", "easy vocabulary spinner", "beginner english words"],
    faq: [{ question: "Harder words?", answer: "Switch to Advanced Words for a tougher pack." }],
  }),
  advanced: spoke({
    id: "advanced",
    path: "/advanced-words-wheel",
    category: "difficulty",
    useCaseId: "advanced",
    pageTitle: "Advanced Words Wheel | Challenging Vocabulary",
    description: "Advanced vocabulary words for older students and writers.",
    h1: "Advanced Words Wheel",
    shortTitle: "Advanced",
    heroIntro: "Challenging words for vocab expansion and spelling bees.",
    keywords: ["advanced words wheel", "challenging vocabulary", "difficult word spinner"],
    faq: [{ question: "Definitions?", answer: "Open the vocab card after spinning for definitions when available." }],
  }),
  "three-letter": spoke({
    id: "three-letter",
    path: "/3-letter-words-wheel",
    category: "length",
    useCaseId: "three-letter",
    pageTitle: "3-Letter Words Wheel | Short Word Generator",
    description: "Spin random three-letter words for quick games and kids.",
    h1: "3-Letter Words Wheel",
    shortTitle: "3-Letter Words",
    heroIntro: "Short words for speed rounds and early readers.",
    keywords: ["3 letter words wheel", "three letter word generator", "short words spinner"],
    faq: [{ question: "Other lengths?", answer: "Try 5-Letter or Long Words packs for variety." }],
  }),
  "five-letter": spoke({
    id: "five-letter",
    path: "/5-letter-words-wheel",
    category: "length",
    useCaseId: "five-letter",
    pageTitle: "5-Letter Words Wheel | Five Letter Word Generator",
    description: "Spin random five-letter words for puzzles and word games.",
    h1: "5-Letter Words Wheel",
    shortTitle: "5-Letter Words",
    heroIntro: "Five-letter words for Wordle-style practice and games.",
    keywords: ["5 letter words wheel", "five letter word generator", "5 letter word spinner"],
    faq: [{ question: "Can I paste my own five-letter list?", answer: "Yes—use Text paste or CSV import." }],
  }),
  "long-words": spoke({
    id: "long-words",
    path: "/long-words-wheel",
    category: "length",
    useCaseId: "long",
    pageTitle: "Long Words Wheel | Long Word Generator",
    description: "Spin long words for spelling challenges and vocabulary stretch.",
    h1: "Long Words Wheel",
    shortTitle: "Long Words",
    heroIntro: "Longer words for spelling bees and advanced practice.",
    keywords: ["long words wheel", "long word generator", "longest words spinner"],
    faq: [{ question: "Syllables?", answer: "Letter count shows on the vocab card; use for stretch challenges." }],
  }),
  "words-a": spoke({
    id: "words-a",
    path: "/words-starting-with-a",
    category: "letter",
    useCaseId: "letter-a",
    pageTitle: "Words Starting With A | Letter A Word Wheel",
    description: "Spin random words that start with the letter A.",
    h1: "Words Starting With A",
    shortTitle: "Words With A",
    heroIntro: "A-letter words—great alongside the Letter Picker Wheel.",
    keywords: ["words starting with a", "letter a word wheel", "random a words"],
    faq: [
      {
        question: "Want just the letter A?",
        answer: "Use Letter Picker Wheel for single letters; this page spins full words starting with A.",
      },
    ],
  }),
  "random-az": spoke({
    id: "random-az",
    path: "/random-a-z-word-wheel",
    category: "letter",
    useCaseId: "random-az",
    pageTitle: "Random A–Z Word Wheel | Alphabet Word Generator",
    description: "Spin words from across the alphabet for A–Z challenges.",
    h1: "Random A–Z Word Wheel",
    shortTitle: "A–Z Words",
    heroIntro: "A mixed alphabet pack for letter-themed writing and games.",
    keywords: ["random a-z word", "alphabet word wheel", "a to z word generator"],
    faq: [{ question: "Filter by letter?", answer: "Use Filters → Starts with to narrow any loaded list." }],
  }),
  animal: spoke({
    id: "animal",
    path: "/animal-words-wheel",
    category: "special",
    useCaseId: "animal",
    pageTitle: "Animal Words Wheel | Random Animal Word Generator",
    description: "Spin animal words for kids, drawing, and classroom themes.",
    h1: "Animal Words Wheel",
    shortTitle: "Animals",
    heroIntro: "Animal names ready for drawing, stories, and kids’ games.",
    keywords: ["animal words wheel", "random animal words", "animal word generator"],
    faq: [{ question: "Drawing mode?", answer: "Switch to Drawing mode for “draw this animal” challenges." }],
  }),
  food: spoke({
    id: "food",
    path: "/food-words-wheel",
    category: "special",
    useCaseId: "food",
    pageTitle: "Food Words Wheel | Random Food Word Generator",
    description: "Spin food words for games, menus, and creative prompts.",
    h1: "Food Words Wheel",
    shortTitle: "Food Words",
    heroIntro: "Tasty words for Pictionary, stories, and party games.",
    keywords: ["food words wheel", "random food words", "food word generator"],
    faq: [{ question: "Party games?", answer: "Works great with Pictionary and charades modes." }],
  }),
  halloween: spoke({
    id: "halloween",
    path: "/halloween-words-wheel",
    category: "special",
    useCaseId: "halloween",
    pageTitle: "Halloween Words Wheel | Spooky Word Generator",
    description: "Spin Halloween-themed words for parties, classrooms, and writing.",
    h1: "Halloween Words Wheel",
    shortTitle: "Halloween",
    heroIntro: "Seasonal spooky-but-friendly words for October fun.",
    keywords: ["halloween words wheel", "halloween word generator", "spooky word spinner"],
    faq: [{ question: "Kid-safe?", answer: "Yes—playful Halloween themes without graphic content." }],
  }),
  party: spoke({
    id: "party",
    path: "/party-word-generator",
    category: "party",
    useCaseId: "party",
    popular: true,
    pageTitle: "Party Word Generator | Icebreaker Word Wheel",
    description:
      "Family-friendly party word prompts for icebreakers, charades, and group games. Kept separate from kids classroom packs.",
    h1: "Party Word Generator",
    shortTitle: "Party Words",
    heroIntro: "Icebreaker and party prompts—acting mode on, still family-friendly.",
    keywords: ["party word generator", "icebreaker word wheel", "party challenge words"],
    faq: [
      {
        question: "Is this for drinking games?",
        answer:
          "No. This pack stays family-friendly. Adult drinking prompts are not mixed into the core Word Picker.",
      },
    ],
  }),
  icebreaker: spoke({
    id: "icebreaker",
    path: "/icebreaker-word-wheel",
    category: "party",
    useCaseId: "party",
    pageTitle: "Icebreaker Word Wheel | Random Conversation Starters",
    description: "Spin icebreaker words for meetings, classrooms, and parties.",
    h1: "Icebreaker Word Wheel",
    shortTitle: "Icebreakers",
    heroIntro: "Quick word prompts to start conversations and warm-ups.",
    keywords: ["icebreaker word wheel", "conversation starter spinner", "icebreaker generator"],
    faq: [
      {
        question: "Classroom friendly?",
        answer: "Yes—use for morning meetings and ESL conversation practice.",
      },
    ],
  }),
  "give-me-3": spoke({
    id: "give-me-3",
    path: "/give-me-3-random-words",
    category: "questions",
    useCaseId: "challenge",
    pageTitle: "Give Me 3 Random Words | Three Word Challenge",
    description: "Get three random words instantly for writing and story challenges.",
    h1: "Give Me 3 Random Words",
    shortTitle: "3 Random Words",
    heroIntro: "Three-word challenge mode for stories, sentences, and improv.",
    keywords: ["give me 3 random words", "three random words", "3 word challenge"],
    faq: [
      {
        question: "How does Three Words mode work?",
        answer: "One spin plus two extra words from the pack—use all three together.",
      },
    ],
  }),
  "give-me-5": spoke({
    id: "give-me-5",
    path: "/give-me-5-random-words",
    category: "questions",
    useCaseId: "five-words",
    pageTitle: "Give Me 5 Random Words | Five Word Challenge",
    description: "Get five random words for bigger writing and party challenges.",
    h1: "Give Me 5 Random Words",
    shortTitle: "5 Random Words",
    heroIntro: "Five-word challenge mode for richer prompts.",
    keywords: ["give me 5 random words", "five random words", "5 word challenge"],
    faq: [
      {
        question: "Can I pick five without spinning?",
        answer: "Yes—use Pick 5 in the multi-word controls, or Five Words mode after a spin.",
      },
    ],
  }),
  "what-act": spoke({
    id: "what-act",
    path: "/what-word-should-i-act-out",
    category: "questions",
    useCaseId: "charades",
    pageTitle: "What Word Should I Act Out? | Charades Word Spinner",
    description: "Not sure what to act out? Spin a random charades-style word.",
    h1: "What Word Should I Act Out?",
    shortTitle: "What to Act Out",
    heroIntro: "Acting mode on—spin a word and perform it without saying it.",
    keywords: ["what word should i act out", "charades word spinner", "act out random word"],
    faq: [
      {
        question: "Good for parties?",
        answer: "Yes—pair with Elimination so prompts do not repeat.",
      },
    ],
  }),
  "kids-generator": spoke({
    id: "kids-generator",
    path: "/random-word-generator-for-kids",
    category: "kids",
    useCaseId: "kids",
    pageTitle: "Random Word Generator for Kids | Easy Kids Word Wheel",
    description: "A kid-friendly random word generator with simple, family-safe words.",
    h1: "Random Word Generator for Kids",
    shortTitle: "Kids Generator",
    heroIntro: "Easy words for kids’ stories, drawing, and classroom games.",
    keywords: ["random word generator for kids", "kids word generator", "easy words for children"],
    faq: [
      {
        question: "Is it age-appropriate?",
        answer: "Yes. Kids packs stay simple and family-friendly.",
      },
    ],
  }),
  "what-pick": spoke({
    id: "what-pick",
    path: "/what-word-should-i-pick",
    category: "questions",
    useCaseId: "common",
    pageTitle: "What Word Should I Pick? | Random Word Picker",
    description: "Not sure what word to choose? Spin the wheel for a random pick.",
    h1: "What Word Should I Pick?",
    shortTitle: "What Word?",
    heroIntro: "Let the wheel decide which word you should use next.",
    keywords: ["what word should i pick", "pick a random word", "random word chooser"],
    faq: [{ question: "Can I change the list?", answer: "Yes—paste your own options or load another pack." }],
  }),
  "what-write": spoke({
    id: "what-write",
    path: "/what-should-i-write-about",
    category: "questions",
    useCaseId: "writing",
    pageTitle: "What Should I Write About? | Random Writing Word Prompt",
    description: "Stuck on what to write? Spin a random word writing prompt.",
    h1: "What Should I Write About?",
    shortTitle: "What to Write",
    heroIntro: "A question-intent page that spins writing-ready prompt words.",
    keywords: ["what should i write about", "writing prompt spinner", "what word should i write about"],
    faq: [{ question: "Story mode?", answer: "Turn on Story mode for character, setting, and object together." }],
  }),
  "give-me": spoke({
    id: "give-me",
    path: "/give-me-a-random-word",
    category: "questions",
    useCaseId: "common",
    pageTitle: "Give Me a Random Word | Instant Word Spinner",
    description: "Give me a random word—spin instantly for writing, games, or class.",
    h1: "Give Me a Random Word",
    shortTitle: "Give Me a Word",
    heroIntro: "One-click energy: spin and grab a random word right away.",
    keywords: ["give me a random word", "random word now", "instant word generator"],
    faq: [{ question: "Need three words?", answer: "Use Three Words mode or visit Give Me 3 Random Words later." }],
  }),
}

function buildExpansionSpokes(): Record<string, WordPickerSpokeSeo> {
  const result: Record<string, WordPickerSpokeSeo> = {}
  for (const item of EXPANSION_SPOKES) {
    if (WORD_PICKER_CORE_SPOKES[item.id] || result[item.id]) continue
    const useCaseId = item.reuseExisting || item.packId
    const useCase = getWordPickerUseCase(useCaseId)
    if (!useCase) {
      console.warn(`[word-picker] missing use case for spoke ${item.id}: ${useCaseId}`)
      continue
    }
    const config: WordPickerUseCaseConfig = item.defaultMode
      ? {
          ...useCase.config,
          defaultMode: item.defaultMode as WordPickerUseCaseConfig["defaultMode"],
        }
      : useCase.config
    result[item.id] = {
      id: item.id,
      path: item.path,
      category: item.category,
      pageTitle: item.pageTitle,
      description: item.description,
      h1: item.h1,
      shortTitle: item.shortTitle,
      heroIntro: item.heroIntro,
      keywords: item.keywords,
      faq: item.faq,
      popular: item.popular,
      deepLink: { useCaseId, config },
    }
  }
  return result
}

export const WORD_PICKER_SPOKES: Record<string, WordPickerSpokeSeo> = {
  ...WORD_PICKER_CORE_SPOKES,
  ...buildExpansionSpokes(),
}

export function getWordPickerSpoke(id: WordPickerSpokeId | string): WordPickerSpokeSeo {
  const spokeItem = WORD_PICKER_SPOKES[id as WordPickerSpokeId]
  if (!spokeItem) throw new Error(`Unknown word picker spoke: ${id}`)
  return spokeItem
}

export function getWordPickerSpokeSiblings(spoke: WordPickerSpokeSeo): WordPickerSpokeSeo[] {
  return Object.values(WORD_PICKER_SPOKES)
    .filter((item) => item.category === spoke.category && item.id !== spoke.id)
    .slice(0, 6)
}

export function wordPickerSpokeUrl(path: string): string {
  return `${WORD_PICKER_WHEEL_SITE_URL}${path}`
}

export function getWordPickerSpokePathForUseCase(id: WordPickerUseCaseId): string | null {
  const match = Object.values(WORD_PICKER_SPOKES).find((item) => item.deepLink.useCaseId === id)
  return match?.path ?? null
}

export const WORD_PICKER_POPULAR_SPOKE_LINKS: {
  id: WordPickerSpokeId
  href: string
  label: string
  description: string
  accent: WordPickerUseCaseAccent
  useCaseId: WordPickerUseCaseId
}[] = (
  [
    // Categories
    "common-words",
    "easy-words",
    "funny-words",
    "weird-words",
    "positive-words",
    "rhyming-words",
    // Writing
    "writing-prompt",
    "story-words",
    "character-picker",
    "poetry-words",
    "brainstorming",
    // Classroom
    "classroom",
    "vocabulary",
    "sight",
    "spelling",
    "esl",
    // Games
    "pictionary",
    "charades",
    "word-challenge",
    "taboo",
    // Drawing / speaking
    "drawing-words",
    "inktober",
    "speaking",
    "acting",
    // Word type / difficulty
    "noun",
    "verb",
    "adjective",
    "feeling-word",
    "beginner",
    "advanced",
    // Letter / length
    "words-a",
    "random-az",
    "three-letter",
    "five-letter",
    "long-words",
    // Kids / party / special
    "kids",
    "preschool",
    "party",
    "icebreaker",
    "animal",
    "halloween",
    "christmas",
    "pokemon-words",
  ] as const
).map((id) => {
  const item = WORD_PICKER_SPOKES[id]
  if (!item) throw new Error(`Popular spoke missing: ${id}`)
  const useCase = getWordPickerUseCase(item.deepLink.useCaseId)!
  return {
    id,
    href: item.path,
    label: item.shortTitle,
    description: useCase.description,
    accent: useCase.accent,
    useCaseId: item.deepLink.useCaseId,
  }
})

export const WORD_PICKER_ALL_SPOKE_PATHS = Object.values(WORD_PICKER_SPOKES).map((s) => s.path)

export const WORD_PICKER_ALIAS_REDIRECTS: { source: string; destination: string }[] = [
  { source: "/word-picker-wheel", destination: WORD_PICKER_WHEEL_PATH },
  { source: "/random-word-generator", destination: WORD_PICKER_WHEEL_PATH },
  { source: "/random-word-picker", destination: WORD_PICKER_WHEEL_PATH },
  { source: "/random-word-wheel", destination: WORD_PICKER_WHEEL_PATH },
  { source: "/random-word-spinner", destination: WORD_PICKER_WHEEL_PATH },
  { source: "/word-spinner", destination: WORD_PICKER_WHEEL_PATH },
  { source: "/word-generator-wheel", destination: WORD_PICKER_WHEEL_PATH },
  { source: "/random-word-selector", destination: WORD_PICKER_WHEEL_PATH },
  { source: "/random-word-generator-online", destination: WORD_PICKER_WHEEL_PATH },
]
