"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Star } from "lucide-react"
import type { Product } from "@/types/product"
import { formatCurrency } from "@/lib/utils"

export function ProductComparison() {
  const [compareList, setCompareList] = useState<Product[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("compareList") || "[]")
    setCompareList(stored)
  }, [])

  const removeFromCompare = (productId: string) => {
    const updated = compareList.filter((p) => p.id !== productId)
    setCompareList(updated)
    localStorage.setItem("compareList", JSON.stringify(updated))
  }

  const clearAll = () => {
    setCompareList([])
    localStorage.setItem("compareList", JSON.stringify([]))
  }

  if (compareList.length === 0) return null

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <Button onClick={() => setIsOpen(true)} className="relative">
          Compare ({compareList.length})
          <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
            {compareList.length}
          </Badge>
        </Button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-6xl max-h-[90vh] overflow-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Product Comparison</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" onClick={clearAll}>
                  Clear All
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {compareList.map((product) => (
                  <div key={product.id} className="border rounded-lg p-4 relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => removeFromCompare(product.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>

                    <img
                      src={product.image || `/placeholder.svg?height=200&width=200&text=${product.name}`}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded mb-4"
                    />

                    <h3 className="font-semibold mb-2">{product.name}</h3>
                    <p className="text-2xl font-bold mb-2">{formatCurrency(product.price)}</p>

                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < product.rating ? "fill-primary text-primary" : "fill-muted text-muted"}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">({product.reviewCount})</span>
                    </div>

                    <Badge variant="outline" className="mb-2">
                      {product.category}
                    </Badge>

                    <p className="text-sm text-muted-foreground mb-4">{product.description}</p>

                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>In Stock:</span>
                        <span className={product.inStock ? "text-green-600" : "text-red-600"}>
                          {product.inStock ? "Yes" : "No"}
                        </span>
                      </div>
                      {product.discount && (
                        <div className="flex justify-between">
                          <span>Discount:</span>
                          <span className="text-green-600">{product.discount}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
