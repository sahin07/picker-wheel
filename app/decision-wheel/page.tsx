import YesNoPickerSpokeRoute, {
  yesNoPickerSpokeMetadata,
} from "@/components/yes-no-picker-wheel/yes-no-picker-spoke-route"

export const metadata = yesNoPickerSpokeMetadata("decision")

export default function DecisionWheelPage() {
  return <YesNoPickerSpokeRoute spokeId="decision" />
}
