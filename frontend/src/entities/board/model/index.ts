/**
 * Board entity exports
 * Re-exports all task-related modules for simpler imports
 *
 * Single entry to avoid deep imports
 * Makes it easier to manage and maintain the codebase
 */

// Re-export all board-related modules
export * from "./types";
export * from "./keys";
export * from "./api";
export * from "./hooks";
export * from "./queries";
