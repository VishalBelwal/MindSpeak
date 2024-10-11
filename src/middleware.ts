import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'
export { default } from "next-auth/middleware"

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

  const token = await getToken({ req: request })
  const url = request.nextUrl

  // to check ki token hai to kha kha ja sakte hai and agar nahi hai to kha kha jaa sakte hai
  if (token && (
    url.pathname.startsWith('/sign-in') ||
    url.pathname.startsWith('/sign-up') ||
    url.pathname.startsWith('/verify') ||
    url.pathname.startsWith('/')
  )
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // return NextResponse.redirect(new URL('/home', request.url))
}

// wo file ki kha kha par ham chahate hai  ki middleware run kare
export const config = {
  matcher: ['/dashboard/:path*', '/sign-in', '/sign-up', '/', '/verify/:path*'],
}