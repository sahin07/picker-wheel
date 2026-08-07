import { permanentRedirect } from "next/navigation"
import { COLOR_PICKER_PATH } from "@/lib/color-picker-seo"

/** Previous pillar URL → Spin Random Color Picker Wheel */
export default function ColorPickerWheelRedirectPage() {
  permanentRedirect(COLOR_PICKER_PATH)
}
