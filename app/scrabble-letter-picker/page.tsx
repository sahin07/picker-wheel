import LetterPickerSpokeRoute, {
  letterPickerSpokeMetadata,
} from "@/components/letter-picker/letter-picker-spoke-route"

export const metadata = letterPickerSpokeMetadata("scrabble")

export default function ScrabbleLetterPickerPage() {
  return <LetterPickerSpokeRoute spokeId="scrabble" />
}
