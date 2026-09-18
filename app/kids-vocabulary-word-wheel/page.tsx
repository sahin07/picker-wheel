import type { Metadata } from "next"
import WordPickerSpokeRoute, {
  wordPickerSpokeMetadata,
} from "@/components/word-picker-wheel/word-picker-spoke-route"

export const metadata: Metadata = wordPickerSpokeMetadata("kids-vocab")

export default function Page() {
  return <WordPickerSpokeRoute spokeId="kids-vocab" />
}
