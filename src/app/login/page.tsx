"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useSession, signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card"
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react"

export default function Login() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      await signIn("credentials", {
        email,
        password,
        redirect: true,
        callbackUrl: "/",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/")
    }
  }, [status, router])

  return (
    <main className="min-h-dvh w-full flex items-center justify-center p-6">
    <Card className="w-full max-w-md border-border/50 shadow-2xl backdrop-blur-sm bg-card/95 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <CardHeader className="space-y-3 text-center">
        <div className="mx-auto w-12 h-12 rounded-xl bg-primary flex items-center justify-center mb-2 animate-in zoom-in-50 duration-500 delay-100">
          <Lock className="w-6 h-6 text-primary-foreground" />
        </div>
        <CardTitle className="text-3xl font-bold tracking-tight text-balance">Bienvenue</CardTitle>
        <CardDescription className="text-base text-muted-foreground">
          Connectez-vous à votre compte pour continuer
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-5">
          <div className="space-y-2 animate-in fade-in-0 slide-in-from-left-4 duration-500 delay-200">
            <Label htmlFor="email" className="text-sm font-medium">
              Adresse email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="vous@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12 transition-all duration-200 focus:ring-2 focus:ring-ring/20"
                required
              />
            </div>
          </div>

          <div className="space-y-2 animate-in fade-in-0 slide-in-from-left-4 duration-500 delay-300">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium">
                Mot de passe
              </Label>
              <button type="button" className="text-xs text-accent hover:text-accent/80 transition-colors font-medium">
                Mot de passe oublié ?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 h-12 transition-all duration-200 focus:ring-2 focus:ring-ring/20"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] group animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-400"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Connexion en cours...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Se connecter
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            )}
          </Button>
        </CardContent>
      </form>

     
    </Card>
    </main>
  )
}
