'use server'

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = createRouteHandlerClient({ cookies })

  // Use signInWithPassword to login the user
  const { data: { user }, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error || !user) {
    return { error: error?.message || "Invalid credentials" }
  }

  return { success: true }
}