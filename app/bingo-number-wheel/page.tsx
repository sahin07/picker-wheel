import NumberPickerSpokeRoute, {
  numberPickerSpokeMetadata,
} from "@/components/number-picker/number-picker-spoke-route"

export const metadata = numberPickerSpokeMetadata("bingo")

export default function BingoNumberWheelPage() {
  return <NumberPickerSpokeRoute spokeId="bingo" />
}
