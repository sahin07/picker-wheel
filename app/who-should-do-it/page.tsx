import FingerPickerSpokeRoute, { fingerPickerSpokeMetadata } from "@/components/finger-picker/finger-picker-spoke-route"
export const metadata = fingerPickerSpokeMetadata("who-should-do-it")
export default function Page() { return <FingerPickerSpokeRoute spokeId="who-should-do-it" /> }
