import { Settings as SettingsIcon } from 'lucide-react'
import PagePlaceholder from '../components/PagePlaceholder'

export default function Settings() {
  return (
    <PagePlaceholder
      title="Settings"
      description="Configure application preferences and account settings."
      icon={SettingsIcon}
    />
  )
}
