import FingerPickerSpokeRoute, { fingerPickerSpokeMetadata } from "@/components/finger-picker/finger-picker-spoke-route"
export const metadata = fingerPickerSpokeMetadata("last-finger")
export default function Page() { return <FingerPickerSpokeRoute spokeId="last-finger" /> }
