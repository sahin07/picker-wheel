import YesNoPickerSpokeRoute, {
  yesNoPickerSpokeMetadata,
} from "@/components/yes-no-picker-wheel/yes-no-picker-spoke-route"

export const metadata = yesNoPickerSpokeMetadata("this-or-that")

export default function ThisOrThatWheelPage() {
  return <YesNoPickerSpokeRoute spokeId="this-or-that" />
}
