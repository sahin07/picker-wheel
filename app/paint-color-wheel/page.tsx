import ColorPickerSpokeRoute, {
  colorPickerSpokeMetadata,
} from "@/components/color-picker-wheel/color-picker-spoke-route"

export const metadata = colorPickerSpokeMetadata("paint")

export default function Page() {
  return <ColorPickerSpokeRoute spokeId="paint" />
}
