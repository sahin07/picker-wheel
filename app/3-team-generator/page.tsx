import TeamPickerSpokeRoute, {
  teamPickerSpokeMetadata,
} from "@/components/team-picker/team-picker-spoke-route"

export const metadata = teamPickerSpokeMetadata("three-teams")

export default function Page() {
  return <TeamPickerSpokeRoute spokeId="three-teams" />
}
