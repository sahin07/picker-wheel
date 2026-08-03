import { permanentRedirect } from "next/navigation"
import { THEME_PICKER_PATH } from "@/lib/theme-picker-seo"

/** Secondary keyword alias → Theme Picker Wheel pillar. */
export default function RandomThemeGeneratorRedirectPage() {
  permanentRedirect(THEME_PICKER_PATH)
}
