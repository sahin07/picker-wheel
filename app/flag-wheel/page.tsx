import ImagePickerSpokeRoute, {
  imagePickerSpokeMetadata,
} from "@/components/image-picker/image-picker-spoke-route"

export const metadata = imagePickerSpokeMetadata("flag")

export default function Page() {
  return <ImagePickerSpokeRoute spokeId="flag" />
}
