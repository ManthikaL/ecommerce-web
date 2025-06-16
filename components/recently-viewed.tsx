"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "./product-card"
import type { Product } from "@/types/product"

export function RecentlyViewed() {
  const [recentProducts, setRecentProducts] = useState<Product[]>([])

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentlyViewed") || "[]")
    setRecentProducts(recent.slice(0, 4))
  }, [])

  if (recentProducts.length === 0) return null

  return (
    <section className="container px-4 md:px-6 py-12">
      <h2 className="text-2xl font-bold tracking-tight mb-6">Recently Viewed</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {recentProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
