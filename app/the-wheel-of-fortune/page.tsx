import { permanentRedirect } from "next/navigation"
import { FORTUNE_WHEEL_PATH } from "@/lib/fortune-wheel-seo"

/** Legacy route → canonical Wheel of Fortune pillar. */
export default function TheWheelOfFortuneRedirectPage() {
  permanentRedirect(FORTUNE_WHEEL_PATH)
}
