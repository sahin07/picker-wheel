import LetterPickerSpokeRoute, {
  letterPickerSpokeMetadata,
} from "@/components/letter-picker/letter-picker-spoke-route"

export const metadata = letterPickerSpokeMetadata("phonics")

export default function PhonicsLetterWheelPage() {
  return <LetterPickerSpokeRoute spokeId="phonics" />
}
