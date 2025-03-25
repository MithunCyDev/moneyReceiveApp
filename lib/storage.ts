import type { Transaction } from "./types"
import { db } from "./firebase"
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, updateDoc } from "firebase/firestore"

const COLLECTION_NAME = "transactions"

// Custom event for storage updates
const storageEvent = new Event("storage-updated")

// Get all transactions from Firestore
export async function getTransactions(): Promise<Transaction[]> {
  try {
    const transactionsRef = collection(db, COLLECTION_NAME)
    const q = query(transactionsRef, orderBy("date", "desc"))
    const querySnapshot = await getDocs(q)

    const transactions: Transaction[] = []
    querySnapshot.forEach((doc) => {
      transactions.push({ id: doc.id, ...doc.data() } as Transaction)
    })

    return transactions
  } catch (error) {
    console.error("Error retrieving transactions:", error)
    return []
  }
}

// Save a new transaction to Firestore
export async function saveTransaction(transaction: Transaction): Promise<void> {
  try {
    const { id, ...transactionData } = transaction
    await addDoc(collection(db, COLLECTION_NAME), {
      ...transactionData,
      date: new Date().toISOString(),
    })

    // Dispatch event to notify components about the update
    window.dispatchEvent(storageEvent)
  } catch (error) {
    console.error("Error saving transaction:", error)
    throw error
  }
}

// Update an existing transaction in Firestore
export async function updateTransaction(transaction: Transaction): Promise<void> {
  try {
    const { id, ...transactionData } = transaction
    const transactionRef = doc(db, COLLECTION_NAME, id)
    await updateDoc(transactionRef, transactionData)

    // Dispatch event to notify components about the update
    window.dispatchEvent(storageEvent)
  } catch (error) {
    console.error("Error updating transaction:", error)
    throw error
  }
}

// Delete a transaction from Firestore
export async function deleteTransaction(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id))

    // Dispatch event to notify components about the update
    window.dispatchEvent(storageEvent)
  } catch (error) {
    console.error("Error deleting transaction:", error)
    throw error
  }
}

// Fallback to localStorage for offline functionality
export function getLocalTransactions(): Transaction[] {
  if (typeof window === "undefined") return []

  try {
    const storedData = localStorage.getItem("money-receipt-transactions")
    return storedData ? JSON.parse(storedData) : []
  } catch (error) {
    console.error("Error retrieving local transactions:", error)
    return []
  }
}

export function saveLocalTransaction(transaction: Transaction): void {
  if (typeof window === "undefined") return

  try {
    const transactions = getLocalTransactions()
    transactions.unshift(transaction)
    localStorage.setItem("money-receipt-transactions", JSON.stringify(transactions))

    window.dispatchEvent(storageEvent)
  } catch (error) {
    console.error("Error saving local transaction:", error)
  }
}

