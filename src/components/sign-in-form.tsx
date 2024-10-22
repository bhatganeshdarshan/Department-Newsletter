"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../dbConfig'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { FcGoogle } from 'react-icons/fc'
import { Sun, Moon } from 'lucide-react'

export default function SignIn() {
  const [error, setError] = useState<string | null>(null)
  const [darkMode, setDarkMode] = useState(true)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
//   const supabase = createClientComponentClient()

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark')
    } else {
      document.body.classList.remove('dark')
    }

    return () => {
      document.body.classList.remove('dark')
    }
  }, [darkMode])

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          router.push('/')
        }
      } catch (error) {
        console.error('Error checking user:', error)
      } finally {
        setLoading(false)
      }
    }
    checkUser()
  }, [router, supabase.auth])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const handleSignIn = async () => {
    setError(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
          hd: 'bmsit.in,bmsit.ac.in', 
        },
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    })

    if (error) {
      setError('An error occurred during sign in. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <Card className={`w-[350px] ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
          <CardHeader>
            <CardTitle className={darkMode ? 'text-white' : 'text-gray-900'}>Loading...</CardTitle>
            <CardDescription className={darkMode ? 'text-gray-300' : 'text-gray-500'}>
              Please wait while we check your authentication status.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className={`flex items-center justify-center min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <Card className={`w-[350px] ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={toggleDarkMode}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
          </Button>
          <CardTitle className={darkMode ? 'text-white' : 'text-gray-900'}>Sign In</CardTitle>
          <CardDescription className={darkMode ? 'text-gray-300' : 'text-gray-500'}>
            Sign in with your BMSIT Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleSignIn} className="w-full" variant={darkMode ? "outline" : "default"}>
            <FcGoogle className="mr-2 h-4 w-4" />
            Sign in with Google
          </Button>
        </CardContent>
        <CardFooter>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Only @bmsit.in email addresses are allowed.
          </p>
        </CardFooter>
      </Card>
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}