import { FolderKanban } from 'lucide-react'
import PagePlaceholder from '../components/PagePlaceholder'

export default function Projects() {
  return (
    <PagePlaceholder
      title="Projects"
      description="Manage and track your internship projects."
      icon={FolderKanban}
    />
  )
}