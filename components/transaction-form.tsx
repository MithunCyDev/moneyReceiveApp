"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { saveTransaction, saveLocalTransaction } from "@/lib/storage"
import type { Transaction } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { User, UserPlus } from "lucide-react"

export default function TransactionForm() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [transaction, setTransaction] = useState<Transaction>({
    id: "",
    giver: "",
    receiver: "",
    amount: "",
    date: new Date().toISOString(),
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setTransaction((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate inputs
    if (!transaction.giver || !transaction.receiver || !transaction.amount) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Create a new transaction with a unique ID
      const newTransaction = {
        ...transaction,
        id: Date.now().toString(),
        date: new Date().toISOString(),
      }

      // Save to Firestore
      await saveTransaction(newTransaction)

      // Also save to localStorage as backup
      saveLocalTransaction(newTransaction)

      // Reset form
      setTransaction({
        id: "",
        giver: "",
        receiver: "",
        amount: "",
        date: new Date().toISOString(),
      })

      // Show success message
      toast({
        title: "Transaction saved",
        description: "Your transaction has been recorded successfully",
      })
    } catch (error) {
      console.error("Error saving transaction:", error)
      toast({
        title: "Error saving transaction",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
        <CardTitle className="text-xl">New Transaction</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="giver">Giver</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                <User className="h-4 w-4" />
              </div>
              <Input
                id="giver"
                name="giver"
                placeholder="Who gave the money?"
                value={transaction.giver}
                onChange={handleChange}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="receiver">Receiver</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                <UserPlus className="h-4 w-4" />
              </div>
              <Input
                id="receiver"
                name="receiver"
                placeholder="Who received the money?"
                value={transaction.receiver}
                onChange={handleChange}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (BDT)</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                <span className="text-sm font-medium">৳</span>
              </div>
              <Input
                id="amount"
                name="amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={transaction.amount}
                onChange={handleChange}
                className="pl-10"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Transaction"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

