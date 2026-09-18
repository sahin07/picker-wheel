import type { Metadata } from "next"
import WordPickerSpokeRoute, {
  wordPickerSpokeMetadata,
} from "@/components/word-picker-wheel/word-picker-spoke-route"

export const metadata: Metadata = wordPickerSpokeMetadata("2-letter")

export default function Page() {
  return <WordPickerSpokeRoute spokeId="2-letter" />
}
