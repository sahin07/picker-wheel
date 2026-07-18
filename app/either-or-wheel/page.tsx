import YesNoPickerSpokeRoute, {
  yesNoPickerSpokeMetadata,
} from "@/components/yes-no-picker-wheel/yes-no-picker-spoke-route"

export const metadata = yesNoPickerSpokeMetadata("either-or")

export default function EitherOrWheelPage() {
  return <YesNoPickerSpokeRoute spokeId="either-or" />
}
