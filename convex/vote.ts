import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all votes for a poll
export const getVotesByPoll = query({
  args: { pollId: v.id("poll") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    
    return await ctx.db
      .query("vote")
      .withIndex("by_poll", (q) => q.eq("pollId", args.pollId))
      .collect();
  },
});

// Get votes by voter
export const getVotesByVoter = query({
  args: { voter: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    
    return await ctx.db
      .query("vote")
      .withIndex("by_voter", (q) => q.eq("voter", args.voter))
      .collect();
  },
});

// Get vote counts for a poll
export const getVoteCounts = query({
  args: { pollId: v.id("poll") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    
    const votes = await ctx.db
      .query("vote")
      .withIndex("by_poll", (q) => q.eq("pollId", args.pollId))
      .collect();

    const counts: Record<number, number> = {};
    votes.forEach((vote) => {
      counts[vote.optionIndex] = (counts[vote.optionIndex] || 0) + 1;
    });

    return counts;
  },
});

// Check if user has voted on a poll
export const hasUserVoted = query({
  args: { pollId: v.id("poll") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    
    const vote = await ctx.db
      .query("vote")
      .withIndex("by_voter", (q) => q.eq("voter", identity.subject))
      .filter((q) => q.eq(q.field("pollId"), args.pollId))
      .first();

    return vote !== null;
  },
});

// Cast a vote
export const castVote = mutation({
  args: {
    pollId: v.id("poll"),
    optionIndex: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    
    // Check if user has already voted
    const existingVote = await ctx.db
      .query("vote")
      .withIndex("by_voter", (q) => q.eq("voter", identity.subject))
      .filter((q) => q.eq(q.field("pollId"), args.pollId))
      .first();

    if (existingVote) {
      throw new Error("User has already voted on this poll");
    }

    return await ctx.db.insert("vote", {
      pollId: args.pollId,
      optionIndex: args.optionIndex,
      voter: identity.subject,
    });
  },
});

// Update a vote (change option)
export const updateVote = mutation({
  args: {
    pollId: v.id("poll"),
    optionIndex: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    
    const existingVote = await ctx.db
      .query("vote")
      .withIndex("by_voter", (q) => q.eq("voter", identity.subject))
      .filter((q) => q.eq(q.field("pollId"), args.pollId))
      .first();

    if (!existingVote) {
      throw new Error("No existing vote found for this user and poll");
    }

    // Verify the vote belongs to the authenticated user
    if (existingVote.voter !== identity.subject) {
      throw new Error("Not authorized to update this vote");
    }

    return await ctx.db.patch(existingVote._id, {
      optionIndex: args.optionIndex,
    });
  },
});

// Remove a vote
export const removeVote = mutation({
  args: { pollId: v.id("poll") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    
    const existingVote = await ctx.db
      .query("vote")
      .withIndex("by_voter", (q) => q.eq("voter", identity.subject))
      .filter((q) => q.eq(q.field("pollId"), args.pollId))
      .first();

    if (!existingVote) {
      throw new Error("No vote found to remove");
    }

    // Verify the vote belongs to the authenticated user
    if (existingVote.voter !== identity.subject) {
      throw new Error("Not authorized to remove this vote");
    }

    return await ctx.db.delete(existingVote._id);
  },
});