import DatePickerSpokeRoute, {
  datePickerSpokeMetadata,
} from "@/components/date-picker/date-picker-spoke-route"

export const metadata = datePickerSpokeMetadata("workdays")

export default function Page() {
  return <DatePickerSpokeRoute spokeId="workdays" />
}
