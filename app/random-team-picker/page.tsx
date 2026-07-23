import { permanentRedirect } from "next/navigation"
import { TEAM_PICKER_PATH } from "@/lib/team-picker-seo"

/** Alternate keyword URL — redirects to the Team Picker Wheel pillar. */
export default function RandomTeamPickerAliasPage() {
  permanentRedirect(TEAM_PICKER_PATH)
}
