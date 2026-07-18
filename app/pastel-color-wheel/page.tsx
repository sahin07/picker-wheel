import ColorPickerSpokeRoute, {
  colorPickerSpokeMetadata,
} from "@/components/color-picker-wheel/color-picker-spoke-route"

export const metadata = colorPickerSpokeMetadata("pastel")

export default function Page() {
  return <ColorPickerSpokeRoute spokeId="pastel" />
}
