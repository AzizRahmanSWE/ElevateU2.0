import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  // Skip middleware for next/image optimization requests
  if (req.nextUrl.pathname.startsWith('/_next/image')) {
    return res
  }
  
  // If not authenticated, only allow public routes
  if (!session) {
    const isPublicRoute = [
      '/', 
      '/login', 
      '/signup', 
      '/auth/callback',
      '/images',

    ].includes(req.nextUrl.pathname)

    if (!isPublicRoute) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    return res
  }

  // Check if profile is complete for authenticated users
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', session.user.id)
    .single()

  const isProfileComplete = profile && (
    profile.firstName &&
    profile.lastName &&
    profile.age &&
    profile.gender &&
    profile.heightCm &&
    profile.weightKg &&
    profile.fitnessLevel
  )

  // If profile is incomplete and not on complete-profile page, redirect
  if (!isProfileComplete && req.nextUrl.pathname !== '/complete-profile') {
    return NextResponse.redirect(new URL('/complete-profile', req.url))
  }

  // If profile is complete and on complete-profile page, redirect to dashboard
  if (isProfileComplete && req.nextUrl.pathname === '/complete-profile') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png).*)',
  ]
}
