import { createFileRoute, Link } from '@tanstack/react-router'
import { api } from '../../../../convex/_generated/api'
import { useQuery } from '@tanstack/react-query'
import { convexQuery, useConvexMutation } from '@convex-dev/react-query'
import { SignInButton, useAuth } from '@clerk/tanstack-react-start'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, Check, Users, Vote, CheckCircle, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'

export const Route = createFileRoute('/_authed/polls/$pollId')({
  component: PollDetailPage,
})

function PollDetailPage() {
  const { pollId } = Route.useParams()
  const { isSignedIn, userId } = useAuth()
  
  const { data: poll, isLoading: pollLoading } = useQuery(
    convexQuery(api.poll.getPoll, { pollId: pollId as any })
  )
  const { data: voteCounts } = useQuery(
    convexQuery(api.vote.getVoteCounts, { pollId: pollId as any })
  )

  const { data: hasVoted } = useQuery(
    convexQuery(api.vote.hasUserVoted, { pollId: pollId as any })
  )

  const { data: userVotes } = useQuery(
    convexQuery(api.vote.getVotesByVoter, { voter: userId ?? '' })
  )
  const castVoteMutation = useConvexMutation(api.vote.castVote)
  const updateVoteMutation = useConvexMutation(api.vote.updateVote)
  const toggleCompletionMutation = useConvexMutation(api.poll.togglePollCompletion)

  if (!isSignedIn) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Sign In Required</h1>
          <p className="text-muted-foreground mb-4">
            Please sign in to view and vote on this poll.
          </p>
          <Button size="lg" asChild>
              <SignInButton mode="modal">Get Started</SignInButton>
            </Button>
        </div>
      </div>
    )
  }

  if (pollLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-lg">Loading poll...</div>
        </div>
      </div>
    )
  }

  if (!poll) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Poll Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The poll you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link to="/polls">Back to Polls</Link>
          </Button>
        </div>
      </div>
    )
  }

  const totalVotes = voteCounts ? Object.values(voteCounts).reduce((sum: number, count: number) => sum + count, 0) : 0
    const userVote = userVotes?.find(vote => vote.pollId === pollId)
  const userVotedOption = userVote?.optionIndex
    const handleVote = (optionIndex: number) => {
    if (poll.completed) {
      toast.error("This poll has been completed and voting is disabled.")
      return
    }
    
    if (hasVoted) {
      updateVoteMutation(
        { pollId: pollId as any, optionIndex },
      )
    } else {
      castVoteMutation(
        { pollId: pollId as any, optionIndex },
      )
    }
  }
  const handleToggleCompletion = async () => {
    try {
      await toggleCompletionMutation({
        pollId: pollId as any,
        completed: !poll.completed
      })
      toast.success(poll.completed ? "Poll reopened successfully!" : "Poll completed successfully!")
    } catch (error) {
      console.error("Failed to update poll status:", error)
      toast.error("Failed to update poll status")
    }
  }

  const isCreator = poll.creator === userId

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/polls">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Polls
          </Link>
        </Button>
      </div>      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl">{poll.question}</CardTitle>
              <CardDescription className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {totalVotes} total votes
                </div>
                {hasVoted && (
                  <Badge variant="secondary">
                    <Check className="w-3 h-3 mr-1" />
                    You voted
                  </Badge>
                )}
                {poll.completed && (
                  <Badge variant="destructive">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Completed
                  </Badge>
                )}
              </CardDescription>
            </div>
            {isCreator && (
              <Button
                variant={poll.completed ? "outline" : "default"}
                size="sm"
                onClick={handleToggleCompletion}
                className="ml-4"
              >
                {poll.completed ? (
                  <>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reopen Poll
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete Poll
                  </>
                )}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {poll.options.map((option: string, index: number) => {
              const voteCount = voteCounts?.[index] ?? 0
              const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0
              const isUserChoice = userVotedOption === index
              
              return (                <div
                  key={index}
                  className={`border rounded-lg p-4 transition-all ${
                    poll.completed 
                      ? 'opacity-60 cursor-not-allowed' 
                      : 'hover:shadow-md cursor-pointer'
                  } ${
                    isUserChoice ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                  onClick={() => handleVote(index)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{option}</span>
                      {isUserChoice && (                        <Badge variant="default">
                          <Check className="w-3 h-3 mr-1" />
                          Your vote
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {voteCount} votes
                      </span>
                      <Badge variant="outline">
                        {percentage.toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              )
            })}
          </div>          {!hasVoted && !poll.completed && (
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Vote className="w-4 h-4" />
                Click on an option to cast your vote
              </div>
            </div>
          )}

          {hasVoted && !poll.completed && (
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
                <Check className="w-4 h-4" />
                You can click on any option to change your vote
              </div>
            </div>
          )}

          {poll.completed && (
            <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-orange-700 dark:text-orange-300">
                <CheckCircle className="w-4 h-4" />
                This poll has been completed. Voting is disabled.
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
