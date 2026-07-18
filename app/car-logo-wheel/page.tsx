import ImagePickerSpokeRoute, {
  imagePickerSpokeMetadata,
} from "@/components/image-picker/image-picker-spoke-route"

export const metadata = imagePickerSpokeMetadata("car-logo")

export default function Page() {
  return <ImagePickerSpokeRoute spokeId="car-logo" />
}
