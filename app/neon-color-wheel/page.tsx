import ColorPickerSpokeRoute, {
  colorPickerSpokeMetadata,
} from "@/components/color-picker-wheel/color-picker-spoke-route"

export const metadata = colorPickerSpokeMetadata("neon")

export default function Page() {
  return <ColorPickerSpokeRoute spokeId="neon" />
}
