"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Transaction } from "@/lib/types"
import { updateTransaction } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"
import { User, UserPlus } from "lucide-react"

interface EditTransactionDialogProps {
  transaction: Transaction | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onTransactionUpdated: () => void
}

export default function EditTransactionDialog({
  transaction,
  open,
  onOpenChange,
  onTransactionUpdated,
}: EditTransactionDialogProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Transaction>({
    id: "",
    giver: "",
    receiver: "",
    amount: "",
    date: "",
  })

  useEffect(() => {
    if (transaction) {
      setFormData(transaction)
    }
  }, [transaction])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.giver || !formData.receiver || !formData.amount) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      await updateTransaction(formData)

      toast({
        title: "Transaction updated",
        description: "The transaction has been updated successfully",
      })

      onOpenChange(false)
      onTransactionUpdated()
    } catch (error) {
      console.error("Error updating transaction:", error)
      toast({
        title: "Error updating transaction",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-giver">Giver</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                <User className="h-4 w-4" />
              </div>
              <Input
                id="edit-giver"
                name="giver"
                placeholder="Who gave the money?"
                value={formData.giver}
                onChange={handleChange}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-receiver">Receiver</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                <UserPlus className="h-4 w-4" />
              </div>
              <Input
                id="edit-receiver"
                name="receiver"
                placeholder="Who received the money?"
                value={formData.receiver}
                onChange={handleChange}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-amount">Amount (BDT)</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                <span className="text-sm font-medium">৳</span>
              </div>
              <Input
                id="edit-amount"
                name="amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={handleChange}
                className="pl-10"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Transaction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

