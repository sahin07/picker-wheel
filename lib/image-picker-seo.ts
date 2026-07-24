import { HOME_SITE_URL } from "@/lib/home-seo"

export const IMAGE_PICKER_SITE_URL = HOME_SITE_URL

/** Canonical pillar path. */
export const IMAGE_PICKER_PATH = "/image-picker-wheel"

export const IMAGE_PICKER_URL = `${IMAGE_PICKER_SITE_URL}${IMAGE_PICKER_PATH}`

export const IMAGE_PICKER_OG_IMAGE_URL = `${IMAGE_PICKER_SITE_URL}/og/image-picker-wheel.svg`

export const IMAGE_PICKER_PAGE_TITLE =
  "Image Picker Wheel | Spin a Random Image Wheel Online"

export const IMAGE_PICKER_PAGE_DESCRIPTION =
  "Spin the Image Picker Wheel to randomly choose pictures, photos, or custom images. Upload your own images, customize the wheel, and make visual selections for games, classrooms, giveaways, and creative activities."

export const IMAGE_PICKER_H1 = "Image Picker Wheel"

/** Short chrome title above the tool (not the long SEO pitch). */
export const IMAGE_PICKER_SHORT_TITLE = "Image Picker Wheel"

export const IMAGE_PICKER_HERO_INTRO =
  "Need to randomly choose between images instead of text? Our Image Picker Wheel lets you upload pictures, icons, logos, or photos and spin a customizable wheel to make a fair visual selection. It's perfect for classroom activities, games, presentations, giveaways, product choices, and creative decision-making."

/**
 * Primary + secondary + semantic keywords — random image selection only.
 * Do NOT include image color picker / color extractor intents.
 */
export const IMAGE_PICKER_KEYWORDS = [
  "image picker wheel",
  "image spinner",
  "random image picker",
  "image wheel",
  "spin image wheel",
  "picture picker",
  "random image wheel",
  "photo picker wheel",
  "image randomizer",
  "wheel with images",
  "choose a random image",
  "spin pictures",
  "random picture picker",
  "image selection wheel",
  "photo spinner",
  "visual picker",
  "picture wheel",
  "image decision wheel",
] as const

export const IMAGE_PICKER_ON_THIS_PAGE = [
  { id: "ip-popular", label: "Popular image wheels" },
  { id: "ip-spin-wheel", label: "Spin an image wheel" },
  { id: "ip-upload", label: "Upload your own images" },
  { id: "ip-customize", label: "Customize your image wheel" },
  { id: "ip-use-cases", label: "Common ways to use an image picker wheel" },
  { id: "ip-why", label: "Why use images instead of text" },
  { id: "ip-vs-name", label: "Image Picker Wheel vs Name Picker" },
  { id: "ip-related", label: "Related tools" },
  { id: "ip-faq", label: "FAQ" },
] as const

export type ImagePickerLinkItem = {
  label: string
  href: string
  description: string
}

/** Ready-made templates — each has its own spoke URL (Color/Letter cluster pattern). */
export const IMAGE_PICKER_POPULAR_WHEELS: ImagePickerLinkItem[] = [
  {
    label: "Animal Image Wheel",
    href: "/animal-image-wheel",
    description: "Spin animal pictures for kids, teachers, and recognition games.",
  },
  {
    label: "Emoji Wheel",
    href: "/emoji-wheel",
    description: "Spin emoji faces and icons for chat games and icebreakers.",
  },
  {
    label: "Logo Wheel",
    href: "/logo-wheel",
    description: "Spin brand-style marks for quizzes and marketing activities.",
  },
  {
    label: "Flag Wheel",
    href: "/flag-wheel",
    description: "Spin country flags for geography lessons and travel quizzes.",
  },
  {
    label: "Pokémon Image Wheel",
    href: `${IMAGE_PICKER_PATH}#ip-popular`,
    description: "Load the Pokémon-inspired template on the Image Picker Wheel.",
  },
  {
    label: "Food Image Wheel",
    href: "/food-wheel",
    description: "Spin food options when you cannot decide what to eat.",
  },
  {
    label: "Car Logo Wheel",
    href: "/car-logo-wheel",
    description: "Spin car-style marks for auto enthusiasts and trivia nights.",
  },
  {
    label: "Fruit Image Wheel",
    href: "/fruit-wheel",
    description: "Spin fruit pictures for early education and snacks.",
  },
  {
    label: "Dinosaur Wheel",
    href: "/dinosaur-wheel",
    description: "Spin dinosaur images for preschool themes and museum games.",
  },
  {
    label: "Minecraft Mob Wheel",
    href: "/minecraft-mob-wheel",
    description: "Spin Minecraft-style mobs for challenges and stream games.",
  },
]

export const IMAGE_PICKER_UPLOAD_POINTS = [
  {
    title: "Upload photos",
    description:
      "Add real photos of people, products, places, or classroom objects so the spin feels personal and visual.",
  },
  {
    title: "Upload icons",
    description:
      "Drop in simple icons for roles, stations, challenges, or status picks that are easy to spot mid-spin.",
  },
  {
    title: "Upload logos",
    description:
      "Use brand, school, or team logos when you need a logo wheel for quizzes, sponsors, or brand games.",
  },
  {
    title: "Upload emojis & stickers",
    description:
      "Load emoji art or sticker packs for playful picture wheels that work great on mobile and big screens.",
  },
] as const

export const IMAGE_PICKER_CUSTOMIZE_POINTS = [
  {
    title: "Rename entries",
    description:
      "Give each image a clear label so results are easy to announce after the spin.",
  },
  {
    title: "Change colors",
    description:
      "Adjust segment colors and themes so your image wheel matches the classroom, brand, or game night vibe.",
  },
  {
    title: "Shuffle entries",
    description:
      "Shuffle the order of images before spinning so the layout feels fresh every round.",
  },
  {
    title: "Save wheels",
    description:
      "Keep custom image wheels in My Wheels on this device and reopen them for the next lesson or event.",
  },
  {
    title: "Share wheels",
    description:
      "Share a spin result or the page link when you want others to spin the same visual picker.",
  },
  {
    title: "Elimination & modes",
    description:
      "Use elimination to remove winners, or accumulate counts when you want to track how often each image lands.",
  },
] as const

export type ImagePickerUseCaseGroup = {
  title: string
  items: readonly { title: string; description: string; href: string }[]
}

export const IMAGE_PICKER_USE_CASE_GROUPS: ImagePickerUseCaseGroup[] = [
  {
    title: "Classroom",
    items: [
      {
        title: "Vocabulary learning",
        href: IMAGE_PICKER_PATH,
        description: "Spin picture cards so students name objects, animals, or actions out loud.",
      },
      {
        title: "Animal recognition",
        href: "/animal-image-wheel",
        description: "Open the Animal Image Wheel for preschool and early science lessons.",
      },
      {
        title: "Flag quizzes",
        href: "/flag-wheel",
        description: "Spin flags on the Flag Wheel, or try the Country Picker Wheel for geography quizzes.",
      },
      {
        title: "Letter recognition",
        href: "/random-letter-picker",
        description: "Pair picture wheels with letter spins for phonics and matching games.",
      },
      {
        title: "Picture matching",
        href: IMAGE_PICKER_PATH,
        description: "Spin a picture, then have learners find the matching word or card.",
      },
    ],
  },
  {
    title: "Games",
    items: [
      {
        title: "Character selection",
        href: "/pokemon-picker-wheel",
        description: "Spin Pokémon on the dedicated wheel, or load the Pokémon image template here.",
      },
      {
        title: "Random challenges",
        href: IMAGE_PICKER_PATH,
        description: "Upload challenge icons and let the wheel choose the next dare or task.",
      },
      {
        title: "Loot selection",
        href: "/fortnite-picker-wheel",
        description: "Spin item or loot picks for party games and stream rewards.",
      },
      {
        title: "Card & board games",
        href: IMAGE_PICKER_PATH,
        description: "Use picture slices for roles, resources, or random event cards.",
      },
    ],
  },
  {
    title: "Education",
    items: [
      {
        title: "Flashcards",
        href: IMAGE_PICKER_PATH,
        description: "Turn flashcard images into a spinner for recall practice.",
      },
      {
        title: "Memory games",
        href: IMAGE_PICKER_PATH,
        description: "Use Memory Challenge mode to spin pictures students must remember.",
      },
      {
        title: "Visual learning",
        href: IMAGE_PICKER_PATH,
        description: "Support visual learners with picture-first decisions instead of long text lists.",
      },
      {
        title: "ESL & preschool",
        href: "/fruit-wheel",
        description: "Open the Fruit Wheel (or Animal / Emoji wheels) for early vocabulary and ESL lessons.",
      },
    ],
  },
  {
    title: "Business",
    items: [
      {
        title: "Product selection",
        href: IMAGE_PICKER_PATH,
        description: "Upload product photos when a team needs a fair visual pick.",
      },
      {
        title: "Brainstorming",
        href: IMAGE_PICKER_PATH,
        description: "Spin mood images, logos, or concept art to spark creative discussion.",
      },
      {
        title: "Presentation activities",
        href: IMAGE_PICKER_PATH,
        description: "Let the audience watch a live image spin during workshops and demos.",
      },
    ],
  },
] as const

export const IMAGE_PICKER_WHY_POINTS = [
  {
    title: "Faster recognition",
    description:
      "People recognize pictures faster than reading a long list of names—great for kids and live audiences.",
  },
  {
    title: "Better for children",
    description:
      "Preschool and early learners engage more with animal, fruit, and emoji pictures than plain text.",
  },
  {
    title: "Better for visual learners",
    description:
      "A visual picker supports students and teams who think in images, icons, and scenes.",
  },
  {
    title: "More engaging",
    description:
      "Watching photos and logos spin is more exciting than a text-only name wheel for games and streams.",
  },
  {
    title: "Easier for games",
    description:
      "Character art, loot icons, and challenge stickers make game modes clearer at a glance.",
  },
] as const

/** Image picker vs name / text picker — random selection intent. */
export const IMAGE_PICKER_COMPARISON = [
  {
    aspect: "Content",
    image: "Uses pictures, photos, icons, and logos",
    name: "Uses text names and labels",
  },
  {
    aspect: "Best for",
    image: "Kids, classrooms, visual games, and brand quizzes",
    name: "Giveaways, attendance lists, and name draws",
  },
  {
    aspect: "Selection style",
    image: "Visual selection everyone can see",
    name: "Text selection announced by name",
  },
  {
    aspect: "Typical use",
    image: "Great for games, flashcards, and product photos",
    name: "Great for raffles, classroom names, and teams",
  },
] as const

export const IMAGE_PICKER_RELATED_TOOLS: ImagePickerLinkItem[] = [
  {
    label: "Random Wheel Picker",
    href: "/",
    description: "The main spinner for any custom list of options.",
  },
  {
    label: "Color Picker Wheel",
    href: "/color-picker-wheel",
    description: "Spin a random color wheel for games and classrooms.",
  },
  {
    label: "Team / Name Picker",
    href: "/team-picker-wheel",
    description: "Spin names and teams for classrooms, giveaways, and groups.",
  },
  {
    label: "Random Number Picker",
    href: "/number-picker-wheel",
    description: "Spin numbers for ranges, bingo, and dice-style rolls.",
  },
  {
    label: "Random Letter Picker",
    href: "/random-letter-picker",
    description: "Spin the alphabet wheel for games and learning.",
  },
  {
    label: "Yes or No Wheel",
    href: "/yes-or-no-wheel",
    description: "A simple decision wheel for binary choices.",
  },
  {
    label: "Country Picker Wheel",
    href: "/country-picker-wheel",
    description: "Spin countries for geography and travel games.",
  },
  {
    label: "Pokémon Wheel",
    href: "/pokemon-picker-wheel",
    description: "Spin Pokémon for gaming parties and fair character picks.",
  },
]

/**
 * Template cluster — dedicated spoke pages + a few live related tools.
 */
export const IMAGE_PICKER_CLUSTER_LINKS: ImagePickerLinkItem[] = [
  { label: "Animal Image Wheel", href: "/animal-image-wheel", description: "" },
  { label: "Emoji Wheel", href: "/emoji-wheel", description: "" },
  { label: "Logo Wheel", href: "/logo-wheel", description: "" },
  { label: "Flag Wheel", href: "/flag-wheel", description: "" },
  { label: "Fruit Wheel", href: "/fruit-wheel", description: "" },
  { label: "Food Wheel", href: "/food-wheel", description: "" },
  { label: "Car Logo Wheel", href: "/car-logo-wheel", description: "" },
  { label: "Dinosaur Wheel", href: "/dinosaur-wheel", description: "" },
  { label: "Minecraft Mob Wheel", href: "/minecraft-mob-wheel", description: "" },
  { label: "Pokémon Wheel", href: "/pokemon-picker-wheel", description: "" },
  { label: "Country Picker Wheel", href: "/country-picker-wheel", description: "" },
  { label: "Fortnite Wheel", href: "/fortnite-wheel", description: "" },
]

export const IMAGE_PICKER_ARTICLE_TITLE = "Spin an Image Wheel"

export const IMAGE_PICKER_ARTICLE_INTRO = [
  "An Image Picker Wheel is a spinning picture chooser built for random visual selection. Upload photos, icons, logos, or stickers, spin the wheel, and land on a fair image everyone can see—ideal for classrooms, games, giveaways, presentations, and creative decisions.",
  "Unlike a text-only name picker, this random image picker puts pictures on the wheel so kids, students, and audiences recognize options instantly. Unlike an image color picker or color extractor, this tool does not sample colors from a photo—it randomly chooses among the images you add.",
  "Start with your own uploads, tap a Popular Image Wheels template under the title, or open a dedicated page like Animal, Emoji, Flag, or Food wheels when you want a ready-made picture spinner.",
] as const

export const IMAGE_PICKER_FAQ_ITEMS = [
  {
    question: "What is an Image Picker Wheel?",
    answer:
      "An Image Picker Wheel is an online image spinner that randomly selects a picture from the images you upload or enable on the wheel. It is a visual random image picker for games, classrooms, giveaways, and creative activities.",
  },
  {
    question: "Can I upload my own images?",
    answer:
      "Yes. Upload photos, icons, logos, emojis, or stickers from your device, then enable or disable each slice before you spin.",
  },
  {
    question: "What image formats are supported?",
    answer:
      "Most common web image formats work, including JPEG, PNG, GIF, and WebP, depending on your browser. Upload clear images so each slice stays easy to recognize while spinning.",
  },
  {
    question: "How many images can I add?",
    answer:
      "You can add as many images as you need for your activity. Very large lists still spin, but fewer clear pictures are easier to read on mobile and classroom screens.",
  },
  {
    question: "Can I mix images and text?",
    answer:
      "Yes. Each entry can include an image and a label. You can also keep text-only slices if you want a mixed visual and text wheel.",
  },
  {
    question: "Does every image have an equal chance?",
    answer:
      "Yes. Each enabled image on the wheel has an equal chance of being selected. Disable slices or use elimination mode if you want winners removed after each spin.",
  },
  {
    question: "Can I use ready-made image templates?",
    answer:
      "Yes. Tap a card in Popular Image Wheels under the title to load a set on this page, or open dedicated template pages such as Animal Image Wheel, Emoji Wheel, Flag Wheel, and Food Wheel.",
  },
  {
    question: "Can I save my image wheel?",
    answer:
      "Yes. Use My Wheels to keep custom image wheels on this device, rename them, and switch between saved setups.",
  },
  {
    question: "Can I use it on mobile?",
    answer:
      "Yes. The Image Picker Wheel works in modern mobile browsers so you can upload pictures and spin on phones and tablets.",
  },
  {
    question: "Is it free?",
    answer:
      "Yes. You can upload images, customize the wheel, and spin a random picture online for free.",
  },
] as const
