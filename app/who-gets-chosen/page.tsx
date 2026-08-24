import FingerPickerSpokeRoute, { fingerPickerSpokeMetadata } from "@/components/finger-picker/finger-picker-spoke-route"
export const metadata = fingerPickerSpokeMetadata("who-gets-chosen")
export default function Page() { return <FingerPickerSpokeRoute spokeId="who-gets-chosen" /> }
