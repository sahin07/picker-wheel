import ColorPickerSpokeRoute, {
  colorPickerSpokeMetadata,
} from "@/components/color-picker-wheel/color-picker-spoke-route"

export const metadata = colorPickerSpokeMetadata("secondary")

export default function Page() {
  return <ColorPickerSpokeRoute spokeId="secondary" />
}
