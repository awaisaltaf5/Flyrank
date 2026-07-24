import { UserCircle } from 'lucide-react'
import PagePlaceholder from '../components/PagePlaceholder'

export default function Profile() {
  return (
    <PagePlaceholder
      title="Profile"
      description="Your personal information and internship details."
      icon={UserCircle}
    />
  )
}