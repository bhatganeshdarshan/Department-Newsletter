"use client"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation' 

export default function Unauthorized() {
  const router = useRouter()

  const clearCacheAndRedirect = () => {
    // Clear cache or session-related data
    localStorage.clear()   // Clear localStorage
    sessionStorage.clear() // Clear sessionStorage

    document.cookie.split(";").forEach(function (c) {
      document.cookie = c.trim().startsWith('supabase-auth-token') 
        ? c.trim().split('=')[0] + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;"
        : c.trim().split('=')[0] + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;";
    });

    router.push('/sign-in') 
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-[350px] p-4 shadow-md bg-white rounded-lg">
        <h2 className="text-xl font-semibold">Unauthorized</h2>
        <p className="text-gray-600">Access denied</p>
        <div className="my-4">
          <p className="text-sm text-muted-foreground">
            Only @bmsit.in email addresses are allowed to access this application.
          </p>
        </div>
        <Button className="w-full" onClick={clearCacheAndRedirect}>
          Back to Sign In
        </Button>
      </div>
    </div>
  )
}
