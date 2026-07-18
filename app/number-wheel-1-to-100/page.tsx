import NumberPickerSpokeRoute, {
  numberPickerSpokeMetadata,
} from "@/components/number-picker/number-picker-spoke-route"

export const metadata = numberPickerSpokeMetadata("1-to-100")

export default function NumberWheel1To100Page() {
  return <NumberPickerSpokeRoute spokeId="1-to-100" />
}
