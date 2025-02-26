'use server'

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function signup(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string

  try {
    const supabase = createRouteHandlerClient({ cookies })

    // 1. Sign up the user
    const { data: { user }, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
      }
    })

    if (signUpError || !user) {
      throw new Error(signUpError?.message || 'Failed to create account')
    }

    // 2. Create user profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        user_id: user.id,
        email: user.email,
        firstName: name.split(' ')[0],
        lastName: name.split(' ')[1] || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })

    if (profileError) {
      console.error('Profile creation error:', profileError)
      // Profile will be created during email verification if it fails here
    }

    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Something went wrong' }
  }
}