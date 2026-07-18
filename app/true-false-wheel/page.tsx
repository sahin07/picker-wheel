import YesNoPickerSpokeRoute, {
  yesNoPickerSpokeMetadata,
} from "@/components/yes-no-picker-wheel/yes-no-picker-spoke-route"

export const metadata = yesNoPickerSpokeMetadata("true-false")

export default function TrueFalseWheelPage() {
  return <YesNoPickerSpokeRoute spokeId="true-false" />
}
