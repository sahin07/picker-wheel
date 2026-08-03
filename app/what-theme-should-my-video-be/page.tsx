import type { Metadata } from "next"
import ThemePickerSpokeRoute, {
  themePickerSpokeMetadata,
} from "@/components/theme-picker/theme-picker-spoke-route"

export const metadata: Metadata = themePickerSpokeMetadata("what-video")

export default function Page() {
  return <ThemePickerSpokeRoute spokeId="what-video" />
}
