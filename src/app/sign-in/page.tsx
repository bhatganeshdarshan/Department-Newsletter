


import { supabase } from '../../../dbConfig'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import SignInForm from '@/components/sign-in-form'

export default async function SignInPage() {
  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    redirect('/')
  }

  return <SignInForm />
}
