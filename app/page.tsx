"use client"

import { useEffect, useState } from "react"
import TransactionForm from "@/components/transaction-form"
import TransactionList from "@/components/transaction-list"
import LoginDialog from "@/components/login-dialog"
import { Loader2 } from "lucide-react"
import { app } from "@/lib/firebase"
import { AuthProvider } from "@/contexts/auth-context"

export default function Home() {
  const [isFirebaseInitialized, setIsFirebaseInitialized] = useState(false)

  useEffect(() => {
    // Check if Firebase is initialized
    if (app) {
      setIsFirebaseInitialized(true)
    }
  }, [])

  if (!isFirebaseInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Initializing app...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthProvider>
      <main className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-3xl mx-auto">
          <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
                Money Receipt Tracker
              </h1>
              <p className="text-gray-600 dark:text-gray-300">Keep track of your financial transactions</p>
            </div>
            <LoginDialog />
          </header>

          <div className="grid gap-8 md:grid-cols-1">
            <TransactionForm />
            <TransactionList />
          </div>
        </div>
      </main>
    </AuthProvider>
  )
}

