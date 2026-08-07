import { permanentRedirect } from "next/navigation"
import { YES_NO_PICKER_PATH } from "@/lib/yes-no-picker-seo"

/** Previous pillar URL → Spin Random Yes No Picker Wheel */
export default function YesOrNoWheelRedirectPage() {
  permanentRedirect(YES_NO_PICKER_PATH)
}
