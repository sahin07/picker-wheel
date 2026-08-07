import { permanentRedirect } from "next/navigation"
import { DATE_PICKER_PATH } from "@/lib/date-picker-seo"

/** Legacy hub URL → Spin Random Date Picker Wheel */
export default function DatePickerWheelRedirectPage() {
  permanentRedirect(DATE_PICKER_PATH)
}
