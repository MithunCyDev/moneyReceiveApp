"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { deleteTransaction } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"

interface DeleteConfirmationDialogProps {
  transactionId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onTransactionDeleted: () => void
}

export default function DeleteConfirmationDialog({
  transactionId,
  open,
  onOpenChange,
  onTransactionDeleted,
}: DeleteConfirmationDialogProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!transactionId) return

    setLoading(true)

    try {
      await deleteTransaction(transactionId)

      toast({
        title: "Transaction deleted",
        description: "The transaction has been deleted successfully",
      })

      onOpenChange(false)
      onTransactionDeleted()
    } catch (error) {
      console.error("Error deleting transaction:", error)
      toast({
        title: "Error deleting transaction",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the transaction from the database.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={loading} className="bg-red-600 hover:bg-red-700">
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

