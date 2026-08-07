import { permanentRedirect } from "next/navigation"
import { THEME_PICKER_PATH } from "@/lib/theme-picker-seo"

/** Legacy hub URL → Spin Random Theme Picker Wheel */
export default function ThemePickerWheelRedirectPage() {
  permanentRedirect(THEME_PICKER_PATH)
}
