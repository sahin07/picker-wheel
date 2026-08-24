import FingerPickerSpokeRoute, { fingerPickerSpokeMetadata } from "@/components/finger-picker/finger-picker-spoke-route"
export const metadata = fingerPickerSpokeMetadata("finger-wheel")
export default function Page() { return <FingerPickerSpokeRoute spokeId="finger-wheel" /> }
