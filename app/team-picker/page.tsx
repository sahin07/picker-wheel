import { permanentRedirect } from "next/navigation"
import { TEAM_PICKER_PATH } from "@/lib/team-picker-seo"

/** Legacy URL — redirects to the Team Picker Wheel pillar. */
export default function TeamPickerAliasPage() {
  permanentRedirect(TEAM_PICKER_PATH)
}
