import type { Metadata } from "next"
import WordPickerSpokeRoute, {
  wordPickerSpokeMetadata,
} from "@/components/word-picker-wheel/word-picker-spoke-route"

export const metadata: Metadata = wordPickerSpokeMetadata("give-me-3")

export default function Page() {
  return <WordPickerSpokeRoute spokeId="give-me-3" />
}
