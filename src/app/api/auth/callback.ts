import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../../dbConfig'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query

  if (typeof code !== 'string') {
    return res.status(400).json({ error: 'Invalid code' })
  }

  try {
    // Attempt to exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) throw error

    const { user } = data
    const email = user?.email
    console.log(email);
    if (email && (email.endsWith('@bmsit.in') || email.endsWith('@bmsit.ac.in')) ) {
      // Redirect to home if the email matches
      return res.redirect('/')
    } else {
      // Sign out the user if the email domain is unauthorized
      await supabase.auth.signOut()
      return res.redirect('/unauthorized')
    }
  } catch (error) {
    console.error('Error in callback:', error)
    // Redirect to a generic error page on failure
    return res.redirect('/auth/error')
  }
}
