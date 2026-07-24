import { cn } from '../lib/utils'
import Card from './ui/Card'
import PageHeader from './ui/PageHeader'

export default function PagePlaceholder({ 
  title, 
  description, 
  icon: Icon,
  children,
  className 
}) {
  return (
    <div className={cn('space-y-6', className)}>
      <PageHeader title={title} description={description} />
      
      <Card>
        <Card.Content className="py-12">
          {children || (
            <div className="flex flex-col items-center justify-center text-center">
              <div className="mb-4 rounded-full bg-accent p-4">
                <Icon className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">Coming Soon</h3>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                This page is a placeholder. Real features will be implemented in upcoming phases.
              </p>
            </div>
          )}
        </Card.Content>
      </Card>
    </div>
  )
}