import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })
  
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      )
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', session.user.id)
      .single()

    const isComplete = Boolean(
      profile?.firstName &&
      profile?.lastName &&
      profile?.age &&
      profile?.gender &&
      profile?.heightCm &&
      profile?.weightKg &&
      profile?.fitnessLevel
    )

    return NextResponse.json({ 
      isComplete,
      profile: isComplete ? profile : null 
    })

  } catch (error) {
    console.error('Profile check error:', error)
    return NextResponse.json(
      { error: 'Failed to check profile status' }, 
      { status: 500 }
    )
  }
}