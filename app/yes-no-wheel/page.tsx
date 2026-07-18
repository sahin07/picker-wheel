import YesNoPickerSpokeRoute, {
  yesNoPickerSpokeMetadata,
} from "@/components/yes-no-picker-wheel/yes-no-picker-spoke-route"

export const metadata = yesNoPickerSpokeMetadata("yes-no")

export default function YesNoWheelPage() {
  return <YesNoPickerSpokeRoute spokeId="yes-no" />
}
