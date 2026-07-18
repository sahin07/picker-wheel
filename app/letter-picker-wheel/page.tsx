import { permanentRedirect } from "next/navigation"
import { LETTER_PICKER_PATH } from "@/lib/letter-picker-seo"

/** Legacy URL — redirects to the Random Letter Picker pillar. */
export default function LetterPickerWheelAliasPage() {
  permanentRedirect(LETTER_PICKER_PATH)
}
