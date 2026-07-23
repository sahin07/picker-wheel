import TeamPickerSpokeRoute, {
  teamPickerSpokeMetadata,
} from "@/components/team-picker/team-picker-spoke-route"

export const metadata = teamPickerSpokeMetadata("four-teams")

export default function Page() {
  return <TeamPickerSpokeRoute spokeId="four-teams" />
}
