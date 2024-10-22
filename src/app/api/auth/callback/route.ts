import { supabase } from '../../../../../dbConfig'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/unauthorized', requestUrl.origin))
  }

  // Attempt to exchange the code for a session
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('Error exchanging code for session:', error)
    return NextResponse.redirect(new URL('/unauthorized', requestUrl.origin))
  }

  // Extract session and user from data
  const { session, user } = data

  // Log the session and user for debugging
  console.log('OAuth code:', code)
  console.log('Session:', session)
  console.log('User:', user)

  // Set the session cookie, if needed
  const response = NextResponse.redirect(new URL('/', requestUrl.origin))
  if (session) {
    cookies().set('supabase-auth-token', session.access_token, { path: '/', httpOnly: true })
  }

  return response
}
