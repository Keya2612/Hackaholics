import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // Protect these routes
    "/dashboard",
    "/resume",
    "/aptitude/(.*)",
    "/group-discussion/(.*)",
    "/interview/(.*)",
    "/analytics",
    // Exclude API routes
    "!/api/(.*)",
  ],
};