import { permanentRedirect } from "next/navigation"
import { NUMBER_PICKER_PATH } from "@/lib/number-picker-seo"

/** Legacy hub URL → Spin Random Number Picker Wheel */
export default function NumberPickerWheelRedirectPage() {
  permanentRedirect(NUMBER_PICKER_PATH)
}
