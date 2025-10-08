"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function HomePage() {
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/home")
    } else if (status === "unauthenticated") {
      router.replace("/login")
    }
  }, [status, router])

  return (
    <div className="flex h-screen bg-background">
      <div className="m-auto text-center">
        <h1 className="text-2xl font-bold">Loading...</h1>
      </div>
        
      </div>
  )
}