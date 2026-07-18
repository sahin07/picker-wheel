import ImagePickerSpokeRoute, {
  imagePickerSpokeMetadata,
} from "@/components/image-picker/image-picker-spoke-route"

export const metadata = imagePickerSpokeMetadata("animals")

export default function Page() {
  return <ImagePickerSpokeRoute spokeId="animals" />
}
