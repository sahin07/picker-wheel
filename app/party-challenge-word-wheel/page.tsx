import type { Metadata } from "next"
import WordPickerSpokeRoute, {
  wordPickerSpokeMetadata,
} from "@/components/word-picker-wheel/word-picker-spoke-route"

export const metadata: Metadata = wordPickerSpokeMetadata("party-challenge")

export default function Page() {
  return <WordPickerSpokeRoute spokeId="party-challenge" />
}
