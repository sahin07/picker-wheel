import { IMAGE_PICKER_PATH, IMAGE_PICKER_SITE_URL } from "@/lib/image-picker-seo"
import {
  getImagePickerUseCase,
  type ImagePickerUseCaseId,
} from "@/lib/image-picker-use-cases"

export type ImagePickerSpokeId = Exclude<ImagePickerUseCaseId, "pokemon">

export type ImagePickerDeepLink = {
  preset: ImagePickerUseCaseId
  toolTitle?: string
  toolDescription?: string
}

export type ImagePickerSpokeFaq = {
  question: string
  answer: string
}

export type ImagePickerSpokeSeo = {
  id: ImagePickerSpokeId
  path: string
  pageTitle: string
  description: string
  keywords: readonly string[]
  h1: string
  shortTitle: string
  heroIntro: string
  audience: string
  articleTitle: string
  articleIntro: readonly string[]
  uniqueSection: { title: string; body: string }
  faq: readonly ImagePickerSpokeFaq[]
  siblingIds: readonly ImagePickerSpokeId[]
  deepLink: ImagePickerDeepLink
  /** ISO date (YYYY-MM-DD) for freshness / dateModified */
  updatedAt?: string
  /** Actionable checklist tips for the spoke SEO template */
  tips?: readonly string[]
}

const SPOKE_PATHS: Record<ImagePickerSpokeId, string> = {
  animals: "/animal-image-wheel",
  emoji: "/emoji-wheel",
  logo: "/logo-wheel",
  flag: "/flag-wheel",
  food: "/food-wheel",
  "car-logo": "/car-logo-wheel",
  fruit: "/fruit-wheel",
  dinosaur: "/dinosaur-wheel",
  minecraft: "/minecraft-mob-wheel",
}

const SPOKE_AUDIENCE: Record<ImagePickerSpokeId, string> = {
  animals: "Kids & teachers",
  emoji: "Games & chat",
  logo: "Marketing & quizzes",
  flag: "Geography learning",
  food: "Meal decisions",
  "car-logo": "Auto enthusiasts",
  fruit: "Early education",
  dinosaur: "Preschool & families",
  minecraft: "Gaming & streams",
}

const ALL_SPOKE_IDS = Object.keys(SPOKE_PATHS) as ImagePickerSpokeId[]

function buildFaq(h1: string, topic: string): readonly ImagePickerSpokeFaq[] {
  return [
    {
      question: `What is the ${h1}?`,
      answer: `The ${h1} is a ready-made Image Picker Wheel template preloaded with ${topic} so you can spin a fair visual pick without uploading a full set first.`,
    },
    {
      question: "Can I upload my own images on this page?",
      answer:
        "Yes. After the template loads, you can still upload photos, rename slices, shuffle, save in My Wheels, and customize colors like the main Image Picker Wheel.",
    },
    {
      question: "Is this different from an image color picker?",
      answer:
        "Yes. This page randomly selects among pictures on the wheel. It does not extract colors from an uploaded photo.",
    },
    {
      question: "Is it free?",
      answer: `Yes. You can spin the ${h1} online for free.`,
    },
  ]
}

function buildSpoke(id: ImagePickerSpokeId): ImagePickerSpokeSeo {
  const useCase = getImagePickerUseCase(id)!
  const path = SPOKE_PATHS[id]
  const audience = SPOKE_AUDIENCE[id]
  const h1 = useCase.label
  const topic = useCase.label.replace(/ Wheel$/i, "").toLowerCase()

  return {
    id,
    path,
    pageTitle: `${h1} | Spin Random Pictures Online`,
    description: `Spin the ${h1} to randomly choose ${topic}. A free Image Picker Wheel template for ${audience.toLowerCase()}—customize, upload your own images, and spin fair visual picks.`,
    keywords: [
      h1.toLowerCase(),
      "image picker wheel",
      "random image picker",
      "image spinner",
      topic,
      "picture wheel",
    ],
    h1,
    shortTitle: h1,
    heroIntro: `${useCase.description} Load this template on the Image Picker Wheel, spin for a fair visual selection, then customize labels, colors, and uploads for your activity.`,
    audience,
    articleTitle: `How to use the ${h1}`,
    articleIntro: [
      `The ${h1} is a focused Image Picker Wheel preset. It opens with ${topic} already on the spinner so teachers, families, and gamers can start spinning right away.`,
      `Unlike a text-only name picker, every slice is visual. Unlike an image color picker, this tool does not sample colors from a photo—it randomly chooses among the pictures on the wheel.`,
    ],
    uniqueSection: {
      title: `Why use a ${h1}?`,
      body: `Built for ${audience.toLowerCase()}, this template gives you a ready visual list, equal-chance spins, and the same customize / save / share tools as the main Image Picker Wheel pillar.`,
    },
    faq: buildFaq(h1, topic),
    siblingIds: ALL_SPOKE_IDS.filter((sibling) => sibling !== id).slice(0, 8),
    deepLink: {
      preset: id,
      toolTitle: useCase.toolTitle,
      toolDescription: useCase.toolDescription,
    },
  }
}

export const IMAGE_PICKER_SPOKES: Record<ImagePickerSpokeId, ImagePickerSpokeSeo> = {
  animals: buildSpoke("animals"),
  emoji: buildSpoke("emoji"),
  logo: buildSpoke("logo"),
  flag: buildSpoke("flag"),
  food: {
    ...buildSpoke("food"),
    pageTitle: "What Should I Eat? | Free Random Food Wheel Spinner",
    description:
      "Can't decide what to eat? Spin this free What Should I Eat wheel for a fair food pick—pizza, sushi, tacos, and more. Customize the list, remove winners, and spin again.",
    keywords: [
      "what should i eat",
      "what should i eat wheel",
      "random food picker",
      "food decision wheel",
      "what to eat spinner",
      "meal picker wheel",
    ],
    h1: "What Should I Eat?",
    shortTitle: "What Should I Eat?",
    heroIntro:
      "Stuck between takeout and leftovers? Spin the wheel above for a fair food pick from a ready list of meal ideas. Remove anything you will not eat, add your favorites, then spin once and commit for tonight.",
    audience: "Families & roommates",
    articleTitle: "How to decide what to eat with a spin",
    articleIntro: [
      "“What should I eat?” is one of the most common everyday debates. This template page opens the Image Picker Wheel already loaded with meal options so you can stop scrolling delivery apps and pick something visible to the whole group.",
      "Unlike a blank food list, the wheel starts useful on arrival. Unlike a yes/no spinner, every slice is a real meal idea you can edit, hide, or replace with restaurants near you.",
    ],
    uniqueSection: {
      title: "Built for meal decisions",
      body: "This food template starts with real meal ideas instead of a blank list, so the group can watch one fair spin and move on. Customize restaurants, diet limits, or leftovers anytime.",
    },
    tips: [
      "Delete options nobody will accept before the first spin.",
      "Turn on remove-winner when planning several meals this week.",
      "Rename slices to real restaurants nearby for takeout nights.",
      "Keep only diet-matching options on the wheel so the result stays usable.",
    ],
    faq: [
      {
        question: "What is the What Should I Eat wheel?",
        answer:
          "It is a free food decision spinner preloaded with meal ideas. Spin once for a fair pick, then customize the list for your household or group.",
      },
      {
        question: "Can I add my own restaurants or recipes?",
        answer:
          "Yes. Rename slices, upload your own images, or paste a custom list so the wheel matches places and meals you actually order.",
      },
      {
        question: "How do I stop the same meal from winning twice?",
        answer:
          "Turn on remove-winner after spin so each selected meal leaves the wheel until you reset the list.",
      },
      {
        question: "Is this the same as the main Image Picker Wheel?",
        answer:
          "It uses the same Image Picker Wheel tool with a food template already loaded. The main Image Picker hub still lists every visual template.",
      },
      {
        question: "Is it free?",
        answer: "Yes. You can spin What Should I Eat online for free with no signup.",
      },
    ],
    deepLink: {
      preset: "food",
      toolTitle: "What Should I Eat?",
      toolDescription: "Spin food options for meal decisions",
    },
    updatedAt: "2026-07-25",
  },
  "car-logo": buildSpoke("car-logo"),
  fruit: buildSpoke("fruit"),
  dinosaur: buildSpoke("dinosaur"),
  minecraft: buildSpoke("minecraft"),
}

export function getImagePickerSpoke(id: ImagePickerSpokeId): ImagePickerSpokeSeo {
  return IMAGE_PICKER_SPOKES[id]
}

export function imageSpokeUrl(path: string): string {
  return `${IMAGE_PICKER_SITE_URL}${path}`
}

export function getImageSpokeSiblings(spoke: ImagePickerSpokeSeo): ImagePickerSpokeSeo[] {
  return spoke.siblingIds.map((id) => IMAGE_PICKER_SPOKES[id])
}

export function getImagePickerSpokeByPath(path: string): ImagePickerSpokeSeo | undefined {
  return Object.values(IMAGE_PICKER_SPOKES).find((spoke) => spoke.path === path)
}

export function getImagePickerSpokePathForUseCase(
  id: ImagePickerUseCaseId,
): string | null {
  if (id === "pokemon") return null
  return SPOKE_PATHS[id] ?? null
}

export { IMAGE_PICKER_PATH }
