import ColorPickerSpokeRoute, {
  colorPickerSpokeMetadata,
} from "@/components/color-picker-wheel/color-picker-spoke-route"

export const metadata = colorPickerSpokeMetadata("css")

export default function Page() {
  return <ColorPickerSpokeRoute spokeId="css" />
}
