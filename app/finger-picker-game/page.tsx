import FingerPickerSpokeRoute, { fingerPickerSpokeMetadata } from "@/components/finger-picker/finger-picker-spoke-route"
export const metadata = fingerPickerSpokeMetadata("game")
export default function Page() { return <FingerPickerSpokeRoute spokeId="game" /> }
