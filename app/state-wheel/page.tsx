import { permanentRedirect } from "next/navigation"
import { STATE_WHEEL_PATH } from "@/lib/state-wheel-seo"

/** Legacy hub URL → Spin Random State Wheel */
export default function StateWheelRedirectPage() {
  permanentRedirect(STATE_WHEEL_PATH)
}
