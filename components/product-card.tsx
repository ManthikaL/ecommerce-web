"use client"

import type React from "react"

import Link from "next/link"
import type { Product } from "@/types/product"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, BarChart3 } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { formatCurrency } from "@/lib/utils"
import { WishlistButton } from "./wishlist-button"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, 1)
  }

  const addToCompare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const compareList = JSON.parse(localStorage.getItem("compareList") || "[]")
    if (!compareList.find((item: Product) => item.id === product.id)) {
      compareList.push(product)
      localStorage.setItem("compareList", JSON.stringify(compareList))
    }
  }

  return (
    <Card className="overflow-hidden group relative">
      <Link href={`/products/${product.id}`} className="block">
        <div className="aspect-square overflow-hidden relative">
          <img
            src={product.image || `/placeholder.svg?height=400&width=400&text=${product.name}`}
            alt={product.name}
            className="object-cover w-full h-full transition-transform group-hover:scale-105"
          />
          {product.discount && (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">{product.discount}% OFF</Badge>
          )}

          {/* Action buttons overlay */}
          <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <WishlistButton product={product} size="sm" />
            <Button variant="secondary" size="sm" onClick={addToCompare}>
              <BarChart3 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="space-y-1">
            <h3 className="font-medium truncate">{product.name}</h3>
            <p className="text-sm text-muted-foreground">{product.category}</p>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < product.rating ? "fill-primary text-primary" : "fill-muted text-muted"}`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">{formatCurrency(product.price)}</span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button variant="secondary" className="w-full" onClick={handleAddToCart} disabled={!product.inStock}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </Button>
        </CardFooter>
      </Link>
    </Card>
  )
}
