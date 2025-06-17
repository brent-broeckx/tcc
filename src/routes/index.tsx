import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SignedIn, SignedOut, SignInButton } from "@clerk/tanstack-react-start";
import { Vote, BarChart3, Users, Zap } from "lucide-react";
import { isCurrentUserAdmin } from "@/lib/utils/auth";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="container mx-auto p-6">
      {/* Hero Section */}
      <div className="text-center py-16">
        <div className="mb-4">
          <Badge variant="secondary" className="mb-4 animate-pulse">
            <Zap className="w-3 h-3 mr-1" />
            Live Voting Platform
          </Badge>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          <span>Create & Vote on</span>{" "}
          <span className="text-primary">Live Polls</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Engage your audience with interactive polls. Create questions, gather
          responses, and see results in real-time with beautiful analytics.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <SignedIn>
            <Button size="lg" asChild>
              <Link to="/polls">
                <Vote className="w-4 h-4 mr-2" />
                View Polls
              </Link>
            </Button>
            {isCurrentUserAdmin() && (
              <Button size="lg" variant="outline" asChild>
                <Link to="/dashboard">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
            )}
          </SignedIn>
          <SignedOut>
            <Button size="lg" asChild>
              <SignInButton mode="modal">Get Started</SignInButton>
            </Button>
          </SignedOut>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid gap-8 md:grid-cols-3 py-16">
        <Card>
          <CardHeader>
            <Vote className="w-10 h-10 text-primary mb-4" />
            <CardTitle>Easy Voting</CardTitle>
            <CardDescription>
              Simple, intuitive interface for creating and voting on polls
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Create polls with multiple options and let users vote with just
              one click. Real-time updates show results as they come in.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <BarChart3 className="w-10 h-10 text-primary mb-4" />
            <CardTitle>Live Analytics</CardTitle>
            <CardDescription>
              See real-time results and detailed analytics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Track voting patterns, view progress bars, and analyze engagement
              with comprehensive charts and statistics.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Users className="w-10 h-10 text-primary mb-4" />
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              Secure authentication and user tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Built-in authentication ensures each user can vote once. Track
              participation and manage poll access easily.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* CTA Section */}
      <SignedOut>
        <div className="text-center py-16 bg-muted/30 rounded-lg">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Sign in to create your first poll and start engaging your audience
          </p>
          <Button size="lg" asChild>
            <SignInButton mode="modal">Start Creating Polls</SignInButton>
          </Button>
        </div>
      </SignedOut>
      {/* {!isSignedIn && (
        <div className="text-center py-16 bg-muted/30 rounded-lg">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Sign in to create your first poll and start engaging your audience
          </p>
          <Button size="lg" asChild>
            <Link to="/polls">Start Creating Polls</Link>
          </Button>
        </div>
      )} */}
    </div>
  );
}
