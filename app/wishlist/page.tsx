"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { Heart } from "lucide-react"
import type { Product } from "@/types/product"

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<Product[]>([])

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("wishlist") || "[]")
    setWishlist(stored)
  }, [])

  const clearWishlist = () => {
    localStorage.setItem("wishlist", JSON.stringify([]))
    setWishlist([])
  }

  if (wishlist.length === 0) {
    return (
      <div className="container px-4 md:px-6 py-12">
        <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Heart className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="mt-6 text-xl font-semibold">Your wishlist is empty</h2>
          <p className="mt-2 text-center text-muted-foreground">
            Save items you love to your wishlist and shop them later.
          </p>
          <Link href="/products">
            <Button className="mt-6">Browse Products</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 md:px-6 py-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Wishlist ({wishlist.length})</h1>
        <Button variant="outline" onClick={clearWishlist}>
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
