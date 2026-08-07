import { permanentRedirect } from "next/navigation"
import { COUNTRY_WHEEL_PATH } from "@/lib/country-wheel-seo"

/** Legacy hub URL → Spin Random Country Wheel */
export default function CountryPickerWheelRedirectPage() {
  permanentRedirect(COUNTRY_WHEEL_PATH)
}
