import { CheckSquare } from 'lucide-react'
import PagePlaceholder from '../components/PagePlaceholder'

export default function Tasks() {
  return (
    <PagePlaceholder
      title="Tasks"
      description="View and organize your daily tasks and assignments."
      icon={CheckSquare}
    />
  )
}