/// <reference types="vite/client" />
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouteContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import * as React from "react";
import { DefaultCatchBoundary } from "@/components/DefaultCatchBoundary";
import { NotFound } from "@/components/NotFound";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import appCss from "@/styles/app.css?url";
import { seo } from "@/lib/utils/seo";
import { QueryClient } from "@tanstack/react-query";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  useAuth,
  UserButton,
} from "@clerk/tanstack-react-start";
import { ConvexReactClient } from "convex/react";
import { ConvexQueryClient } from "@convex-dev/react-query";
import { createServerFn } from "@tanstack/react-start";
import { getAuth } from "@clerk/tanstack-react-start/server";
import { getWebRequest } from "@tanstack/react-start/server";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { Toaster } from "sonner";

const fetchClerkAuth = createServerFn({ method: "GET" }).handler(async () => {
  const auth = await getAuth(getWebRequest());
  const token = await auth.getToken({ template: "convex" });

  return {
    userId: auth.userId,
    token,
  };
});

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  convexClient: ConvexReactClient;
  convexQueryClient: ConvexQueryClient;
}>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      ...seo({
        title:
          "TanStack Start | Type-Safe, Client-First, Full-Stack React Framework",
        description: `TanStack Start is a type-safe, client-first, full-stack React framework. `,
      }),
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      { rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
      { rel: "icon", href: "/favicon.ico" },
    ],
    scripts: [
      {
        src: "/customScript.js",
        type: "text/javascript",
      },
    ],
  }),
  beforeLoad: async (ctx) => {
    const auth = await fetchClerkAuth();
    const { userId, token } = auth;

    // During SSR only (the only time serverHttpClient exists),
    // set the Clerk auth token to make HTTP queries with.
    if (token) {
      ctx.context.convexQueryClient.serverHttpClient?.setAuth(token);
    }

    return {
      userId,
      token,
    };
  },
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    );
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
});

function RootComponent() {
  const context = useRouteContext({ from: Route.id });
  return (
    <ClerkProvider>
      <ConvexProviderWithClerk client={context.convexClient} useAuth={useAuth}>
        <ThemeProvider defaultTheme="system" storageKey="tcc-ui-theme">
          <RootDocument>
            <Outlet />
          </RootDocument>
        </ThemeProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}

function RootDocument({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-background text-foreground">
        <div className="p-2 flex gap-2 text-lg border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <Link
            to="/"
            activeProps={{
              className: "font-bold text-foreground",
            }}
            activeOptions={{ exact: true }}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Home
          </Link>{" "}
          <Link
            to="/polls"
            activeProps={{
              className: "font-bold text-foreground",
            }}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Polls
          </Link>{" "}
          <Link
            to="/admin"
            activeProps={{
              className: "font-bold text-foreground",
            }}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Admin
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <ModeToggle />
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal" />
            </SignedOut>
          </div>
        </div>
        <div className="min-h-screen bg-background">
          {children}
        </div>
        <Toaster richColors position="top-right" />
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  );
}
