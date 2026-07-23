import TeamPickerSpokeRoute, {
  teamPickerSpokeMetadata,
} from "@/components/team-picker/team-picker-spoke-route"

export const metadata = teamPickerSpokeMetadata("classroom")

export default function Page() {
  return <TeamPickerSpokeRoute spokeId="classroom" />
}
