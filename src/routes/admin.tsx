import { createFileRoute, Link } from '@tanstack/react-router'
import { api } from '../../convex/_generated/api'
import { useQuery } from '@tanstack/react-query'
import { convexQuery, useConvexMutation } from '@convex-dev/react-query'
import { useAuth } from '@clerk/tanstack-react-start'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ChartConfig, 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from '@/components/ui/chart'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { ArrowLeft, BarChart3, Users, Vote, TrendingUp, CheckCircle, RotateCcw } from 'lucide-react'
import { useMemo } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/admin')({
  component: AdminDashboard,
})

function AdminDashboard() {
  const { isSignedIn } = useAuth()
  const { data: polls, isLoading: pollsLoading } = useQuery(
    convexQuery(api.poll.getPolls, {})
  )

  const { data: pollStats, isLoading: pollStatsLoading } = useQuery(
    convexQuery(api.poll.getPollStats, {})
  )

  const { data: totalVotesCount } = useQuery(
    convexQuery(api.vote.getTotalVoteCount, {})
  )
  // Calculate statistics
  const stats = useMemo(() => {
    if (!polls || !pollStats) return { totalPolls: 0, totalVotes: 0, activePolls: 0, avgVotesPerPoll: 0 }
    
    const totalPolls = pollStats.total
    const totalVotes = totalVotesCount ?? 0
    const activePolls = pollStats.active
    const avgVotesPerPoll = totalPolls > 0 ? totalVotes / totalPolls : 0

    return {
      totalPolls,
      totalVotes,
      activePolls,
      avgVotesPerPoll: Math.round(avgVotesPerPoll * 100) / 100
    }
  }, [polls, pollStats, totalVotesCount])

  if (!isSignedIn) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-4">
            Please sign in to access the admin dashboard.
          </p>
          <Button asChild>
            <Link to="/polls">Back to Polls</Link>
          </Button>
        </div>
      </div>    )
  }
  
  if (pollsLoading || pollStatsLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-lg">Loading dashboard...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/polls">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Polls
          </Link>
        </Button>
        
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Overview of poll analytics and statistics
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Polls</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPolls}</div>
            <p className="text-xs text-muted-foreground">
              All polls created
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
            <Vote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVotes}</div>
            <p className="text-xs text-muted-foreground">
              Across all polls
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Polls</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activePolls}</div>
            <p className="text-xs text-muted-foreground">
              Currently accepting votes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Votes/Poll</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgVotesPerPoll}</div>
            <p className="text-xs text-muted-foreground">
              Average engagement
            </p>
          </CardContent>
        </Card>
      </div>      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <PollsOverviewChart polls={polls || []} />
        <RecentActivityChart pollStats={pollStats} />
      </div>

      {/* Recent Polls Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Polls</CardTitle>
          <CardDescription>
            Latest polls and their performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!polls || polls.length === 0 ? (
            <div className="text-center py-8">
              <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No polls yet</h3>
              <p className="text-muted-foreground">
                Create your first poll to see analytics here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {polls.slice(0, 5).map((poll) => (
                <PollAnalyticsRow key={poll._id} poll={poll} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function PollsOverviewChart({ polls }: { readonly polls: any[] }) {
  const chartData = polls.slice(0, 6).map((poll, index) => ({
    name: `Poll ${index + 1}`,
    question: poll.question.length > 20 ? poll.question.substring(0, 20) + '...' : poll.question,
    votes: 0, // We'll calculate this properly
    options: poll.options.length
  }))

  const chartConfig = {
    votes: {
      label: "Votes",
      color: "hsl(var(--chart-1))",
    },
    options: {
      label: "Options",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig

  return (
    <Card>
      <CardHeader>
        <CardTitle>Poll Performance</CardTitle>
        <CardDescription>
          Votes and options per poll
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="votes" fill="var(--color-votes)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="options" fill="var(--color-options)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

function RecentActivityChart({ pollStats }: { readonly pollStats: any }) {
  const data = [
    { name: "Active", value: pollStats?.active ?? 0 },
    { name: "Completed", value: pollStats?.completed ?? 0 },
  ]

  const COLORS = [
    "var(--chart-1)",
    "var(--chart-2)"
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Poll Status</CardTitle>
        <CardDescription>
          Distribution of poll statuses
        </CardDescription>
      </CardHeader>
      <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

function PollAnalyticsRow({ poll }: { readonly poll: any }) {
  const { data: voteCounts } = useQuery(
    convexQuery(api.vote.getVoteCounts, { pollId: poll._id })
  )
  
  const toggleCompletionMutation = useConvexMutation(api.poll.togglePollCompletion)

  const totalVotes = voteCounts ? Object.values(voteCounts).reduce((sum: number, count: number) => sum + count, 0) : 0

  const handleToggleCompletion = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    try {
      await toggleCompletionMutation({
        pollId: poll._id,
        completed: !poll.completed
      })
      toast.success(poll.completed ? "Poll reopened successfully!" : "Poll completed successfully!")
    } catch (error) {
      console.error("Failed to update poll status:", error)
      toast.error("Failed to update poll status")
    }
  }

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex-1">
        <h4 className="font-medium line-clamp-1">{poll.question}</h4>
        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
          <span>{poll.options.length} options</span>
          <span>{totalVotes} votes</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant={poll.completed ? "destructive" : "secondary"}>
          {poll.completed ? 'Completed' : totalVotes > 0 ? 'Active' : 'No votes'}
        </Badge>
        <Button
          variant={poll.completed ? "outline" : "default"}
          size="sm"
          onClick={handleToggleCompletion}
        >
          {poll.completed ? (
            <>
              <RotateCcw className="w-4 h-4 mr-1" />
              Reopen
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 mr-1" />
              Complete
            </>
          )}
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link to="/polls/$pollId" params={{ pollId: poll._id }}>
            View
          </Link>
        </Button>
      </div>
    </div>
  )
}
