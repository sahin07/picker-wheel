import YesNoPickerSpokeRoute, {
  yesNoPickerSpokeMetadata,
} from "@/components/yes-no-picker-wheel/yes-no-picker-spoke-route"

export const metadata = yesNoPickerSpokeMetadata("should-i")

export default function ShouldIWheelPage() {
  return <YesNoPickerSpokeRoute spokeId="should-i" />
}
