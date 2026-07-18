import YesNoPickerSpokeRoute, {
  yesNoPickerSpokeMetadata,
} from "@/components/yes-no-picker-wheel/yes-no-picker-spoke-route"

export const metadata = yesNoPickerSpokeMetadata("maybe")

export default function MaybeWheelPage() {
  return <YesNoPickerSpokeRoute spokeId="maybe" />
}
