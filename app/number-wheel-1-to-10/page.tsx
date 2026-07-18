import NumberPickerSpokeRoute, {
  numberPickerSpokeMetadata,
} from "@/components/number-picker/number-picker-spoke-route"

export const metadata = numberPickerSpokeMetadata("1-to-10")

export default function NumberWheel1To10Page() {
  return <NumberPickerSpokeRoute spokeId="1-to-10" />
}
