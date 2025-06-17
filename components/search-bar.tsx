"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, X } from "lucide-react"
import { searchProducts } from "@/lib/products"
import type { Product } from "@/types/product"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils"

export function SearchBar() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Product[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (query.trim()) {
      setIsLoading(true)
      const timer = setTimeout(() => {
        const searchResults = searchProducts(query)
        setResults(searchResults.slice(0, 6)) // Limit to 6 results
        setIsLoading(false)
        setIsOpen(true)
      }, 300) // Debounce search

      return () => clearTimeout(timer)
    } else {
      setResults([])
      setIsOpen(false)
    }
  }, [query])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      // Navigate to products page with search query
      window.location.href = `/products?search=${encodeURIComponent(query)}`
    }
  }

  const clearSearch = () => {
    setQuery("")
    setResults([])
    setIsOpen(false)
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-10"
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </form>

      {/* Search Results Dropdown */}
      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                <p className="text-sm text-muted-foreground mt-2">Searching...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="divide-y">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="flex items-center gap-3 p-3 hover:bg-muted transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <img
                      src={product.image || `/placeholder.svg?height=40&width=40&text=${product.name}`}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(product.price)}</p>
                      {product.originalPrice && (
                        <p className="text-xs text-muted-foreground line-through">
                          {formatCurrency(product.originalPrice)}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
                <div className="p-3 border-t">
                  <Button variant="outline" className="w-full" onClick={handleSearch}>
                    View all results for "{query}"
                  </Button>
                </div>
              </div>
            ) : query.trim() ? (
              <div className="p-4 text-center">
                <p className="text-muted-foreground">No products found for "{query}"</p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
