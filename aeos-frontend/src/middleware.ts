import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

// In-Memory Token Bucket for MVP Rate Limiting
const rateLimitMap = new Map<string, { count: number, resetTime: number }>();
const WINDOW_SIZE_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10; // 10 requests per minute per IP

export async function middleware(request: NextRequest) {
  // 1. API Rate Limiting for AI endpoints
  if (request.nextUrl.pathname.startsWith('/api/ai/')) {
    const ip = request.headers.get('x-forwarded-for') || request.ip || '127.0.0.1';
    const now = Date.now();
    const windowData = rateLimitMap.get(ip);

    if (!windowData || now > windowData.resetTime) {
      rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_SIZE_MS });
    } else {
      windowData.count++;
      if (windowData.count > MAX_REQUESTS) {
        console.warn(`[RATE LIMIT] IP ${ip} exceeded limit on ${request.nextUrl.pathname}`);
        return new NextResponse(
          JSON.stringify({ error: "Too Many Requests", message: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': '60' } }
        );
      }
    }
  }

  // 2. Supabase Auth Session Management
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
