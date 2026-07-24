import { LayoutDashboard, CheckCircle2, Clock, AlertCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { cn } from '../lib/utils'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import PageHeader from '../components/ui/PageHeader'

export default function Home() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of your internship progress and activities."
      />

      {/* Stats Grid: 1 col (375px) → 2 col (tablet) → 3 col (1280px) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard 
          title="Active Projects" 
          value="3" 
          icon={LayoutDashboard}
          trend="+1 this week"
          trendUp
        />
        <StatCard 
          title="Pending Tasks" 
          value="12" 
          icon={Clock}
          trend="4 due today"
          trendUp={false}
        />
        <StatCard 
          title="Completed" 
          value="28" 
          icon={CheckCircle2}
          trend="+5 this week"
          trendUp
        />
      </div>

      {/* Activity Feed */}
      <Card>
        <Card.Header>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-semibold">Recent Activity</h2>
          </div>
          <Badge variant="primary">Live</Badge>
        </Card.Header>
        <Card.Content>
          <p className="text-sm text-muted-foreground">
            Activity feed will be implemented in a future phase. This card demonstrates the dashboard layout structure with reusable components.
          </p>
        </Card.Content>
      </Card>

      {/* Responsive Breakpoint Demo */}
      <Card>
        <Card.Header>
          <h2 className="font-semibold">Responsive Breakpoints</h2>
          <Badge variant="success">Tested</Badge>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <BreakpointDemo label="Mobile" width="375px" color="bg-warning" />
            <BreakpointDemo label="Tablet" width="768px" color="bg-primary-400" />
            <BreakpointDemo label="Desktop" width="1280px" color="bg-success" />
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Resize your browser to see the grid adapt. At 375px you get a single column. At 768px+ you get two columns. At 1024px+ you get three columns.
          </p>
        </Card.Content>
      </Card>
    </div>
  )
}

function StatCard({ title, value, icon: Icon, trend, trendUp }) {
  const TrendIcon = trendUp ? ArrowUpRight : ArrowDownRight
  
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="rounded-lg bg-primary-50 p-2">
          <Icon className="h-5 w-5 text-primary-600" />
        </div>
        <div className={cn('flex items-center gap-0.5 text-xs font-medium', trendUp ? 'text-success' : 'text-warning')}>
          <TrendIcon className="h-3.5 w-3.5" />
          {trend}
        </div>
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
    </Card>
  )
}

function BreakpointDemo({ label, width, color }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border p-3">
      <div className={cn('h-3 w-3 shrink-0 rounded-full', color)} />
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{width}</p>
      </div>
    </div>
  )
}