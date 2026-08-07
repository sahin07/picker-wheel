import { permanentRedirect } from "next/navigation"
import { LETTER_PICKER_PATH } from "@/lib/letter-picker-seo"

/** Previous pillar URL → Spin Random Letter Picker Wheel */
export default function RandomLetterPickerRedirectPage() {
  permanentRedirect(LETTER_PICKER_PATH)
}
