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
import { isCurrentUserAdmin } from "@/lib/utils/auth";

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
          "Live poll demo",
        description: `A live poll demo app built with Convex, Clerk, and React.`,
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
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body className="bg-background text-foreground">
        {" "}
        <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between">
              {/* Logo/Brand Section */}
              <div className="flex items-center space-x-4">
                <Link
                  to="/"
                  className="flex items-center space-x-2 text-xl font-bold text-foreground hover:text-primary transition-colors"
                >
                  <div className="h-8 w-20 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">Live poll</span>
                  </div>
                  <span className="hidden sm:block"></span>
                </Link>
              </div>

              {/* Navigation Links */}
              <div className="hidden md:flex items-center space-x-1">
                <Link
                  to="/"
                  activeProps={{
                    className: "bg-primary/10 text-primary border-primary/20",
                  }}
                  activeOptions={{ exact: true }}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200 border border-transparent"
                >
                  🏠 Home
                </Link>
                <Link
                  to="/polls"
                  activeProps={{
                    className: "bg-primary/10 text-primary border-primary/20",
                  }}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200 border border-transparent"
                >
                  📊 Polls
                </Link>

                {isCurrentUserAdmin() && (
                  <Link
                    to="/dashboard"
                    activeProps={{
                      className: "bg-primary/10 text-primary border-primary/20",
                    }}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200 border border-transparent"
                  >
                    ⚙️ Admin
                  </Link>
                )}
              </div>

              {/* Mobile Navigation Menu - Simplified for now, you can add a hamburger menu later */}
              <div className="flex md:hidden items-center space-x-1">
                <Link
                  to="/"
                  activeProps={{
                    className: "bg-primary/10 text-primary",
                  }}
                  activeOptions={{ exact: true }}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200"
                >
                  🏠
                </Link>
                <Link
                  to="/polls"
                  activeProps={{
                    className: "bg-primary/10 text-primary",
                  }}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200"
                >
                  📊
                </Link>
                <Link
                  to="/dashboard"
                  activeProps={{
                    className: "bg-primary/10 text-primary",
                  }}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200"
                >
                  ⚙️
                </Link>
              </div>

              {/* User Actions */}
              <div className="flex items-center space-x-3">
                <ModeToggle />
                <SignedIn>
                  <div className="flex items-center space-x-2">
                    <div className="hidden sm:block h-6 w-px bg-border"></div>
                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox:
                            "h-8 w-8 ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-200",
                        },
                      }}
                    />
                  </div>
                </SignedIn>
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow-md">
                      Sign In
                    </button>
                  </SignInButton>
                </SignedOut>
              </div>
            </div>
          </div>
        </nav>{" "}
        <main className="min-h-[calc(100dvh-4.5rem)] bg-background">
          {children}
        </main>
        <Toaster richColors position="top-right" />
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  );
}
