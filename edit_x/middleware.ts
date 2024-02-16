import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import nextAuthMiddleware from "next-auth/middleware"

// Define the middleware function
export function middleware(request: NextRequest) {
  // Your middleware logic here
  // For example, redirecting to /home using NextResponse
  return NextResponse.redirect(new URL('/', request.url))
}


// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/'],
}