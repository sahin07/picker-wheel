import { permanentRedirect } from "next/navigation"
import { COLOR_PICKER_PATH } from "@/lib/color-picker-seo"

/** Legacy / competitor alias → canonical Color Picker Wheel pillar. */
export default function WheelOfColorsRedirectPage() {
  permanentRedirect(COLOR_PICKER_PATH)
}
