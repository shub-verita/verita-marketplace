export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: [
    // Only run middleware on dashboard routes
    "/dashboard/:path*",
    // Also handle root redirect
    "/",
  ],
};
