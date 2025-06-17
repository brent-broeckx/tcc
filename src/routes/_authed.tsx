import { createFileRoute, Outlet } from '@tanstack/react-router'
import { SignIn } from '@clerk/tanstack-react-start'
import { isAuthenticated } from '@/lib/utils/auth';
import { Authenticated } from 'convex/react';

export const Route = createFileRoute('/_authed')({
  beforeLoad: async () => {
    const { userId } = await isAuthenticated();
    
    return {
      userId,
    };
  },
  errorComponent: ({ error }) => {
    console.log('triggering this error');
    if (error.message === "Forbidden") {
      return (
        <div className="flex items-center justify-center p-12">
          <SignIn routing="hash" forceRedirectUrl={window.location.href} />
        </div>
      )
    }

    throw error
  },
  component: () => {
    return (
      <Authenticated >
        <Outlet />
      </Authenticated>
      
    )
  },
})
