import LetterPickerSpokeRoute, {
  letterPickerSpokeMetadata,
} from "@/components/letter-picker/letter-picker-spoke-route"

export const metadata = letterPickerSpokeMetadata("alphabet")

export default function AlphabetWheelPage() {
  return <LetterPickerSpokeRoute spokeId="alphabet" />
}
