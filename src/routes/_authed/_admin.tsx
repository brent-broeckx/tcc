import { checkRole } from "@/lib/utils/auth";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/_admin")({
  beforeLoad: async () => {
    await checkRole({ data: "admin" });
  },
  errorComponent: ({ error }) => {
    if (error.message === "ACCESS_DENIED") {
      return (
        <div className="flex items-center justify-center p-12">
          No access!
        </div>
      )
    }

    throw error
  },
  component: () => {
    return <Outlet />;
  },
});
