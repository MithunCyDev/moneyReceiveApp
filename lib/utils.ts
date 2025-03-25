import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Transaction } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export function formatCurrency(amount: string): string {
  const numAmount = Number.parseFloat(amount)
  if (isNaN(numAmount)) return "৳0.00"

  return new Intl.NumberFormat("bn-BD", {
    style: "currency",
    currency: "BDT",
    currencyDisplay: "narrowSymbol",
  })
    .format(numAmount)
    .replace(/\s/g, "")
}

export function calculateTotal(transactions: Transaction[]): number {
  return transactions.reduce((total, transaction) => {
    const amount = Number.parseFloat(transaction.amount)
    return isNaN(amount) ? total : total + amount
  }, 0)
}

