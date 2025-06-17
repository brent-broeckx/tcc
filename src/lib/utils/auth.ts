import { getAuth } from "@clerk/tanstack-react-start/server";
import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { redirect } from "@tanstack/react-router";
import { Roles } from "../types/roles";

export const isAuthenticated = createServerFn({ method: "GET" }).handler(
  async () => {
    const { userId } = await getAuth(getWebRequest());

    if (!userId) {
      throw new Error("Forbidden");
    }

    return {
      userId,
    };
  }
);

export const checkRole = createServerFn({ method: "GET" })
.validator((role: Roles) => role)
.handler(
  async ({ data: role }) => {
    const { userId, sessionClaims } = await getAuth(getWebRequest());

    console.log("sessionClaims", sessionClaims);
    if (!userId) {
      throw new Error("Forbidden");
    }

    if (sessionClaims?.metadata.role !== role) {
      throw new Error("ACCESS_DENIED");
    }

    return sessionClaims?.metadata.role === role
  }
);
