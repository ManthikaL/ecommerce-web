import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Check } from "lucide-react"

export default function CheckoutSuccessPage() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] px-4 py-12 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
        <Check className="h-12 w-12 text-green-600 dark:text-green-400" />
      </div>
      <h1 className="mt-6 text-3xl font-bold">Order Confirmed!</h1>
      <p className="mt-4 text-muted-foreground max-w-md">
        Thank you for your purchase. Your order has been confirmed and will be shipped soon.
      </p>
      <div className="mt-8 flex gap-4">
        <Link href="/">
          <Button>Continue Shopping</Button>
        </Link>
        <Link href="/products">
          <Button variant="outline">View All Products</Button>
        </Link>
      </div>
    </div>
  )
}
