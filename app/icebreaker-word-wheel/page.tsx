import type { Metadata } from "next"
import WordPickerSpokeRoute, {
  wordPickerSpokeMetadata,
} from "@/components/word-picker-wheel/word-picker-spoke-route"

export const metadata: Metadata = wordPickerSpokeMetadata("icebreaker")

export default function Page() {
  return <WordPickerSpokeRoute spokeId="icebreaker" />
}
