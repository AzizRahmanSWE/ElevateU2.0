import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/dashboard'
  
  if (!code) {
    return NextResponse.redirect(`${requestUrl.origin}/login?error=No code provided`)
  }

  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Exchange code for session
    const { data: { session }, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (sessionError) {
      console.error('Session error:', sessionError)
      return NextResponse.redirect(`${requestUrl.origin}/login?error=Authentication failed`)
    }

    if (!session?.user) {
      return NextResponse.redirect(`${requestUrl.origin}/login?error=No session found`)
    }

    // Check if profile exists
    const { data: profile, error: profileFetchError } = await supabase
      .from('user_profiles')
      .select()
      .eq('user_id', session.user.id)
      .single()

    if (profileFetchError && profileFetchError.code !== 'PGRST116') {
      console.error('Profile fetch error:', profileFetchError)
    }

    if (!profile) {
      // Create profile if it doesn't exist
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: session.user.id,
          email: session.user.email,
          firstName: session.user.user_metadata?.full_name?.split(' ')[0] || '',
          lastName: session.user.user_metadata?.full_name?.split(' ')[1] || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })

      if (profileError) {
        console.error('Profile creation error:', profileError)
        return NextResponse.redirect(`${requestUrl.origin}/complete-profile?error=Failed to create profile`)
      }
    }

    return NextResponse.redirect(`${requestUrl.origin}${next}`)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.redirect(`${requestUrl.origin}/login?error=Something went wrong`)
  }
}