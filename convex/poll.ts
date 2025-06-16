import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all polls
export const getPolls = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    
    return await ctx.db.query("poll").collect();
  },
});

// Get polls by creator
export const getPollsByCreator = query({
  args: { creator: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    
    return await ctx.db
      .query("poll")
      .withIndex("by_creator", (q) => q.eq("creator", args.creator))
      .collect();
  },
});

// Get a single poll by ID
export const getPoll = query({
  args: { pollId: v.id("poll") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    
    return await ctx.db.get(args.pollId);
  },
});

// Create a new poll
export const createPoll = mutation({
  args: {
    question: v.string(),
    options: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    
    return await ctx.db.insert("poll", {
      question: args.question,
      options: args.options,
      creator: identity.subject, // Use the authenticated user's ID
    });
  },
});

// Update a poll
export const updatePoll = mutation({
  args: {
    pollId: v.id("poll"),
    question: v.optional(v.string()),
    options: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    
    const poll = await ctx.db.get(args.pollId);
    if (!poll) {
      throw new Error("Poll not found");
    }
    
    if (poll.creator !== identity.subject) {
      throw new Error("Not authorized to update this poll");
    }
    
    const { pollId, ...updates } = args;
    return await ctx.db.patch(pollId, updates);
  },
});

// Delete a poll
export const deletePoll = mutation({
  args: { pollId: v.id("poll") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    
    const poll = await ctx.db.get(args.pollId);
    if (!poll) {
      throw new Error("Poll not found");
    }
    
    if (poll.creator !== identity.subject) {
      throw new Error("Not authorized to delete this poll");
    }
    
    return await ctx.db.delete(args.pollId);
  },
});