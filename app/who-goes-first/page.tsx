import FingerPickerSpokeRoute, { fingerPickerSpokeMetadata } from "@/components/finger-picker/finger-picker-spoke-route"
export const metadata = fingerPickerSpokeMetadata("who-goes-first")
export default function Page() { return <FingerPickerSpokeRoute spokeId="who-goes-first" /> }
