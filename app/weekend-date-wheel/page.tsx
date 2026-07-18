import DatePickerSpokeRoute, {
  datePickerSpokeMetadata,
} from "@/components/date-picker/date-picker-spoke-route"

export const metadata = datePickerSpokeMetadata("weekends")

export default function Page() {
  return <DatePickerSpokeRoute spokeId="weekends" />
}
