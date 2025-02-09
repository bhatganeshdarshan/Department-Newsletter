import { supabase } from '../../../../../dbConfig'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/unauthorized', requestUrl.origin))
  }

  
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('Error exchanging code for session:', error)
    return NextResponse.redirect(new URL('/unauthorized', requestUrl.origin))
  }

  const { session, user } = data


  console.log('OAuth code:', code)
  console.log('Session:', session)
  console.log('User:', user)

  const response = NextResponse.redirect(new URL('/', requestUrl.origin))
  if (session) {
    cookies().set('supabase-auth-token', session.access_token, { path: '/', httpOnly: true })
  }

  return response
}
