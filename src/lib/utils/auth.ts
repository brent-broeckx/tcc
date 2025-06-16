import { getAuth } from "@clerk/tanstack-react-start/server";
import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";

export const isAuthenticated = createServerFn({ method: "GET" })
  .handler(async () => {
    const { userId } = await getAuth(getWebRequest());

    if (!userId) {
      throw new Error("Forbidden");
    }

    return {
      userId,
    };
  });