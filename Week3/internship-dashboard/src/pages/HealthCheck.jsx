import { HeartPulse, RefreshCw, AlertTriangle, CheckCircle2, Server } from 'lucide-react'
import { useFetch } from '../hooks/useFetch'
import { env } from '../config/env'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Skeleton from '../components/ui/Skeleton'
import PageHeader from '../components/ui/PageHeader'

const API_URL = `${env.API_BASE_URL}/users?_limit=5`

export default function HealthCheck() {
  const { data, loading, error, refetch } = useFetch(API_URL)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Health Check"
        description="Verify system connectivity and API status."
      />

      {/* API Status Card */}
      <Card>
        <Card.Header>
          <div className="flex items-center gap-2">
            <Server className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-semibold">API Connection</h2>
          </div>
          <StatusBadge loading={loading} error={error} />
        </Card.Header>
        <Card.Content>
          {loading && <LoadingState />}
          {error && <ErrorState error={error} onRetry={refetch} />}
          {data && !loading && <SuccessState data={data} />}
        </Card.Content>
      </Card>

      {/* Environment Config */}
      <Card>
        <Card.Header>
          <div className="flex items-center gap-2">
            <HeartPulse className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-semibold">Environment</h2>
          </div>
          <Badge variant="primary">{env.MODE}</Badge>
        </Card.Header>
        <Card.Content>
          <div className="space-y-2 font-mono text-xs">
            <ConfigRow label="API_BASE_URL" value={env.API_BASE_URL} />
            <ConfigRow label="APP_NAME" value={env.APP_NAME} />
            <ConfigRow label="APP_VERSION" value={env.APP_VERSION} />
          </div>
        </Card.Content>
      </Card>
    </div>
  )
}

function StatusBadge({ loading, error }) {
  if (loading) return <Badge variant="warning">Loading</Badge>
  if (error) return <Badge variant="error">Failed</Badge>
  return <Badge variant="success">Healthy</Badge>
}

function LoadingState() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-5 rounded-full" />
        <Skeleton className="h-5 w-40" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-6 w-24" />
          </div>
        ))}
      </div>
    </div>
  )
}

function ErrorState({ error, onRetry }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-error">
        <AlertTriangle className="h-5 w-5" />
        <span className="font-medium">Connection failed</span>
      </div>
      <div className="rounded-lg bg-error-muted p-4">
        <p className="text-sm text-error">{error}</p>
      </div>
      <Button variant="outline" onClick={onRetry} className="gap-2">
        <RefreshCw className="h-4 w-4" />
        Retry Request
      </Button>
    </div>
  )
}

function SuccessState({ data }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-success">
        <CheckCircle2 className="h-5 w-5" />
        <span className="font-medium">Connection successful</span>
        <span className="text-sm text-muted-foreground">({data.length} records)</span>
      </div>
      <div className="divide-y divide-border rounded-lg border border-border">
        {data.map((user) => (
          <div
            key={user.id}
            className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="truncate font-medium">{user.name}</p>
              <p className="truncate text-sm text-muted-foreground">{user.email}</p>
            </div>
            <Badge variant="default" className="mt-1 w-fit sm:mt-0">
              {user.company.name}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  )
}

function ConfigRow({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  )
}