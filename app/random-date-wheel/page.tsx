import DatePickerSpokeRoute, {
  datePickerSpokeMetadata,
} from "@/components/date-picker/date-picker-spoke-route"

export const metadata = datePickerSpokeMetadata("next-30")

export default function Page() {
  return <DatePickerSpokeRoute spokeId="next-30" />
}
