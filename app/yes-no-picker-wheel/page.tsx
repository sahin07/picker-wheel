import { permanentRedirect } from "next/navigation"
import { YES_NO_PICKER_PATH } from "@/lib/yes-no-picker-seo"

/** Legacy URL — redirects to the Yes or No Wheel pillar. */
export default function YesNoPickerWheelAliasPage() {
  permanentRedirect(YES_NO_PICKER_PATH)
}
