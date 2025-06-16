import { createFileRoute, Link } from "@tanstack/react-router";
import { api } from "../../../../convex/_generated/api";
import { useQuery } from "@tanstack/react-query";
import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { useAuth } from "@clerk/tanstack-react-start";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Vote, Users, CheckCircle, RotateCcw } from "lucide-react";
import { useState } from "react";
import { CreatePollDialog } from "@/components/CreatePollDialog";
import { toast } from "sonner";

export const Route = createFileRoute("/_authed/polls/")({
  component: PollsPage,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData({
      ...convexQuery(api.poll.getPolls, {}),
      gcTime: 10000,
    });
  }
});

function PollsPage() {
  const { isSignedIn } = useAuth();
  const [showCreateDialog, setShowCreateDialog] = useState(false);  const { data: polls, isLoading } = useQuery(
    { ...convexQuery(api.poll.getPolls, {})}
  );

  if (!isSignedIn) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Live Poll Voting</h1>
          <p className="text-muted-foreground mb-4">
            Please sign in to view and participate in polls.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-lg">Loading polls...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Live Polls</h1>
          <p className="text-muted-foreground mt-2">
            Create polls and vote on your favorites
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} size="lg">
          <Plus className="w-4 h-4 mr-2" />
          Create Poll
        </Button>
      </div>

      {!polls || polls.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Vote className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No polls yet</h3>
              <p className="text-muted-foreground mb-4">
                Be the first to create a poll and start collecting votes!
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Poll
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {polls.map((poll) => (
            <PollCard key={poll._id} poll={poll} />
          ))}
        </div>
      )}

      <CreatePollDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
}

function PollCard({ poll }: { readonly poll: any }) {
  const { userId } = useAuth();
  const { data: voteCounts } = useQuery(
    convexQuery(api.vote.getVoteCounts, { pollId: poll._id })
  );

  const toggleCompletionMutation = useConvexMutation(api.poll.togglePollCompletion);

  const totalVotes = voteCounts
    ? Object.values(voteCounts).reduce(
        (sum: number, count: number) => sum + count,
        0
      )
    : 0;

  const isCreator = poll.creator === userId;

  const handleToggleCompletion = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to poll detail
    e.stopPropagation();
    
    try {
      await toggleCompletionMutation({
        pollId: poll._id,
        completed: !poll.completed
      });
      toast.success(poll.completed ? "Poll reopened successfully!" : "Poll completed successfully!");
    } catch (error) {
      console.error("Failed to update poll status:", error);
      toast.error("Failed to update poll status");
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <Link to="/polls/$pollId" params={{ pollId: poll._id }}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="line-clamp-2">{poll.question}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-2">
                <Users className="w-4 h-4" />
                {totalVotes} votes
                {poll.completed && (
                  <Badge variant="destructive" className="ml-2">
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
                className="ml-2"
              >
                {poll.completed ? (
                  <>
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Reopen
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Complete
                  </>
                )}
              </Button>
            )}
          </div>
        </CardHeader>        <CardContent>
          <div className="space-y-2">
            {poll.options.slice(0, 3).map((option: string, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground truncate">
                  {option}
                </span>
                <Badge variant="secondary">{voteCounts?.[index] ?? 0}</Badge>
              </div>
            ))}
            {poll.options.length > 3 && (
              <div className="text-sm text-muted-foreground">
                +{poll.options.length - 3} more options
              </div>
            )}
            {poll.completed && (
              <div className="mt-3 p-2 bg-orange-50 dark:bg-orange-900/20 rounded text-xs text-orange-700 dark:text-orange-300">
                This poll is completed and voting is disabled
              </div>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
