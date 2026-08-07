import { permanentRedirect } from "next/navigation"
import { TEAM_PICKER_PATH } from "@/lib/team-picker-seo"

/** Previous pillar URL → Spin Random Team Picker Wheel */
export default function TeamPickerWheelRedirectPage() {
  permanentRedirect(TEAM_PICKER_PATH)
}
