import NumberPickerSpokeRoute, {
  numberPickerSpokeMetadata,
} from "@/components/number-picker/number-picker-spoke-route"

export const metadata = numberPickerSpokeMetadata("lottery")

export default function LotteryNumberPickerPage() {
  return <NumberPickerSpokeRoute spokeId="lottery" />
}
