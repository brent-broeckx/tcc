import { Roles } from "@/lib/types/roles"

export {}

// Create a type for the roles
declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles
    }
  }
}