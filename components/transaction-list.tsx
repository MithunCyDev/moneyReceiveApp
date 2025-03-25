"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getTransactions } from "@/lib/storage"
import type { Transaction } from "@/lib/types"
import { formatDate, formatCurrency, calculateTotal } from "@/lib/utils"
import { Loader2, Edit, Trash2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import EditTransactionDialog from "./edit-transaction-dialog"
import DeleteConfirmationDialog from "./delete-confirmation-dialog"

export default function TransactionList() {
  const { isAdmin } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [deletingTransactionId, setDeletingTransactionId] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const loadTransactions = async () => {
    setLoading(true)
    try {
      const storedTransactions = await getTransactions()
      setTransactions(storedTransactions)
    } catch (error) {
      console.error("Error loading transactions:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Initial load
    loadTransactions()

    // Set up event listener for storage changes
    const handleStorageUpdate = () => {
      loadTransactions()
    }
    window.addEventListener("storage-updated", handleStorageUpdate)

    return () => {
      window.removeEventListener("storage-updated", handleStorageUpdate)
    }
  }, [])

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setDeletingTransactionId(id)
    setIsDeleteDialogOpen(true)
  }

  if (loading) {
    return (
      <Card className="shadow-md">
        <CardHeader className="bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-t-lg">
          <CardTitle className="text-xl">Transaction History</CardTitle>
        </CardHeader>
        <CardContent className="p-6 flex justify-center items-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </CardContent>
      </Card>
    )
  }

  if (transactions.length === 0) {
    return (
      <Card className="shadow-md">
        <CardHeader className="bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-t-lg">
          <CardTitle className="text-xl">Transaction History</CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center text-gray-500">
          <p>No transactions recorded yet.</p>
        </CardContent>
      </Card>
    )
  }

  const totalAmount = calculateTotal(transactions)

  return (
    <>
      <Card className="shadow-md">
        <CardHeader className="bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-t-lg">
          <CardTitle className="text-xl">Transaction History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {transaction.giver} → {transaction.receiver}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(transaction.amount)}
                    </span>

                    {isAdmin && (
                      <div className="flex gap-1 ml-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-500 hover:text-blue-500"
                          onClick={() => handleEdit(transaction)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-500 hover:text-red-500"
                          onClick={() => handleDelete(transaction.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(transaction.date)}</p>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="bg-gray-100 dark:bg-gray-800 p-4 rounded-b-lg">
          <div className="w-full flex justify-between items-center">
            <h3 className="font-semibold text-gray-900 dark:text-white">Total Amount</h3>
            <span className="text-xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(totalAmount.toString())}
            </span>
          </div>
        </CardFooter>
      </Card>

      <EditTransactionDialog
        transaction={editingTransaction}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onTransactionUpdated={loadTransactions}
      />

      <DeleteConfirmationDialog
        transactionId={deletingTransactionId}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onTransactionDeleted={loadTransactions}
      />
    </>
  )
}

