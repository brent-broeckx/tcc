import { checkRole, isCurrentUserAdmin } from "@/lib/utils/auth";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { NoAccess } from "@/components/NoAccess";

export const Route = createFileRoute("/_authed/_admin")({
  component: () => {
    if (isCurrentUserAdmin()) {
      return <Outlet />;
    } else {
      return <NoAccess />;
    }
  },
});
