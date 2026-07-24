import { CalendarDays } from 'lucide-react'
import PagePlaceholder from '../components/PagePlaceholder'

export default function Calendar() {
  return (
    <PagePlaceholder
      title="Calendar"
      description="Schedule events, deadlines, and meetings."
      icon={CalendarDays}
    />
  )
}