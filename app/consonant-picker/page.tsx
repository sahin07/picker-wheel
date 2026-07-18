import LetterPickerSpokeRoute, {
  letterPickerSpokeMetadata,
} from "@/components/letter-picker/letter-picker-spoke-route"

export const metadata = letterPickerSpokeMetadata("consonants")

export default function ConsonantPickerPage() {
  return <LetterPickerSpokeRoute spokeId="consonants" />
}
