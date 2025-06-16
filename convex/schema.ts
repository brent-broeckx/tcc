import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  poll: defineTable({
    question: v.string(),
    options: v.array(v.string()),
    creator: v.string(), // Clerk user ID
    completed: v.optional(v.boolean()), // Whether the poll is completed
  })
    .index("by_creator", ["creator"])
    .index("by_option", ["options"]),

  vote: defineTable({
    pollId: v.id("poll"),
    optionIndex: v.number(),
    voter: v.string(), // Clerk user ID
  })
    .index("by_voter", ["voter"])
    .index("by_poll", ["pollId"])
    .index("by_option", ["optionIndex"]),
});
