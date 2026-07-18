import LetterPickerSpokeRoute, {
  letterPickerSpokeMetadata,
} from "@/components/letter-picker/letter-picker-spoke-route"

export const metadata = letterPickerSpokeMetadata("uppercase")

export default function UppercaseLetterPickerPage() {
  return <LetterPickerSpokeRoute spokeId="uppercase" />
}
