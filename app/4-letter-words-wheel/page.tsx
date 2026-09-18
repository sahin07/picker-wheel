import type { Metadata } from "next"
import WordPickerSpokeRoute, {
  wordPickerSpokeMetadata,
} from "@/components/word-picker-wheel/word-picker-spoke-route"

export const metadata: Metadata = wordPickerSpokeMetadata("4-letter")

export default function Page() {
  return <WordPickerSpokeRoute spokeId="4-letter" />
}
