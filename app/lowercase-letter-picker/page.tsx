import LetterPickerSpokeRoute, {
  letterPickerSpokeMetadata,
} from "@/components/letter-picker/letter-picker-spoke-route"

export const metadata = letterPickerSpokeMetadata("lowercase")

export default function LowercaseLetterPickerPage() {
  return <LetterPickerSpokeRoute spokeId="lowercase" />
}
