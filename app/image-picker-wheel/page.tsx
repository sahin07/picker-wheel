import { permanentRedirect } from "next/navigation"
import { IMAGE_PICKER_PATH } from "@/lib/image-picker-seo"

/** Legacy hub URL → Spin Random Image Picker Wheel */
export default function ImagePickerWheelRedirectPage() {
  permanentRedirect(IMAGE_PICKER_PATH)
}
