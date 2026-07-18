import LetterPickerSpokeRoute, {
  letterPickerSpokeMetadata,
} from "@/components/letter-picker/letter-picker-spoke-route"

export const metadata = letterPickerSpokeMetadata("vowels")

export default function VowelPickerPage() {
  return <LetterPickerSpokeRoute spokeId="vowels" />
}
