"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { LogIn, AlertCircle } from "lucide-react"
import { ADMIN_EMAIL } from "@/lib/firebase"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginDialog() {
  const { user, isAdmin, signInWithGoogle, signInWithEmail, signOut, devModeSignIn } = useAuth()
  const [email, setEmail] = useState(ADMIN_EMAIL)
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await signInWithEmail(email, password)
      setOpen(false)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    try {
      await signInWithGoogle()
      setOpen(false)
    } finally {
      setLoading(false)
    }
  }

  const handleDevModeSignIn = () => {
    devModeSignIn()
    setOpen(false)
  }

  if (user || isAdmin) {
    return (
      <Button variant="outline" size="sm" onClick={signOut} className="flex items-center gap-2">
        <LogIn className="h-4 w-4" />
        <span>Sign Out</span>
      </Button>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <LogIn className="h-4 w-4" />
          <span>Admin Login</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Admin Login</DialogTitle>
        </DialogHeader>

        <Alert variant="warning" className="my-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Only {ADMIN_EMAIL} can access admin features</AlertDescription>
        </Alert>

        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="google">Google</TabsTrigger>
            <TabsTrigger value="dev">Dev Mode</TabsTrigger>
          </TabsList>

          <TabsContent value="email">
            <form onSubmit={handleEmailSignIn} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>

          <TabsContent value="google">
            <div className="py-6 flex flex-col items-center">
              <p className="mb-4 text-center text-sm text-gray-500">Sign in with your Google account</p>
              <Button onClick={handleGoogleSignIn} disabled={loading} className="w-full">
                {loading ? "Signing in..." : "Sign in with Google"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="dev">
            <div className="py-6 flex flex-col items-center">
              <p className="mb-4 text-center text-sm text-gray-500">For development and preview environments only</p>
              <Button onClick={handleDevModeSignIn} variant="secondary" className="w-full">
                Enable Admin Mode
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

