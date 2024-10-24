"use client"

import { useState, useEffect } from 'react'
import { redirect, useRouter } from 'next/navigation'
import { supabase } from '../../dbConfig'
import NewsletterFormComponent from '../components/newsletter-form'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sun, Moon } from 'lucide-react'
import { User } from '@supabase/supabase-js'
import NewsletterAdmin from './admin/page'

export default function Home() {
  const [darkMode, setDarkMode] = useState(true)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

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
        setUser(user)
        if (!user) {
          router.push('/sign-in')
        }
      } catch (error) {
        console.error('Error checking user:', error)
      } finally {
        setLoading(false)
      }
    }
    checkUser()
    
  }, [router])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
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

  if (!user) {
    return null 
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
          </Button>
        </div>
        <NewsletterFormComponent darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        {/* <NewsletterAdmin/> */} {/* Uncomment this and comment  above line to try/test admin panel  */}
      </div>
    </div>
  )
}