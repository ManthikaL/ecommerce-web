"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { getAllProducts } from "@/lib/products"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"
import { FilterSidebar } from "@/components/filter-sidebar"
import type { Product } from "@/types/product"

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("search") || ""

  const allProducts = getAllProducts()
  const [products, setProducts] = useState<Product[]>(allProducts)
  const [sortBy, setSortBy] = useState("featured")
  const [appliedFilters, setAppliedFilters] = useState<any>({})

  useEffect(() => {
    filterAndSortProducts()
  }, [searchQuery, appliedFilters, sortBy])

  const filterAndSortProducts = () => {
    let filtered = allProducts

    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply filters
    if (appliedFilters.priceRange) {
      filtered = filtered.filter(
        (product) => product.price >= appliedFilters.priceRange[0] && product.price <= appliedFilters.priceRange[1],
      )
    }

    if (appliedFilters.categories && appliedFilters.categories.length > 0) {
      filtered = filtered.filter((product) =>
        appliedFilters.categories.some((cat: string) => product.category.toLowerCase().includes(cat.toLowerCase())),
      )
    }

    if (appliedFilters.brands && appliedFilters.brands.length > 0) {
      filtered = filtered.filter((product) =>
        appliedFilters.brands.some((brand: string) =>
          (product.brand || "ShopEase").toLowerCase().includes(brand.toLowerCase()),
        ),
      )
    }

    if (appliedFilters.rating > 0) {
      filtered = filtered.filter((product) => product.rating >= appliedFilters.rating)
    }

    if (appliedFilters.inStock) {
      filtered = filtered.filter((product) => product.inStock)
    }

    if (appliedFilters.onSale) {
      filtered = filtered.filter((product) => product.discount && product.discount > 0)
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low-high":
        filtered = [...filtered].sort((a, b) => a.price - b.price)
        break
      case "price-high-low":
        filtered = [...filtered].sort((a, b) => b.price - a.price)
        break
      case "newest":
        filtered = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "rating":
        filtered = [...filtered].sort((a, b) => b.rating - a.rating)
        break
      default:
        // featured - no sorting needed
        break
    }

    setProducts(filtered)
  }

  const handleFiltersChange = (filters: any) => {
    setAppliedFilters(filters)
  }

  const clearSearch = () => {
    window.history.replaceState({}, "", "/products")
    window.location.reload()
  }

  return (
    <div className="container px-4 md:px-6 py-6 md:py-10">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
          <p className="text-muted-foreground">
            {searchQuery ? `Search results for "${searchQuery}"` : "Browse our collection of high-quality products"}
          </p>
        </div>

        {searchQuery && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Searching for:</span>
            <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded">
              <span className="text-sm font-medium">{searchQuery}</span>
              <Button variant="ghost" size="sm" onClick={clearSearch} className="h-auto p-1">
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {products.length} product{products.length !== 1 ? "s" : ""} found
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                <SelectItem value="rating">Customer Rating</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filters - Desktop */}
          <div className="hidden md:block">
            <FilterSidebar onFiltersChange={handleFiltersChange} />
          </div>

          {/* Products Grid */}
          <div className="md:col-span-3">
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <h3 className="text-lg font-medium">No products found</h3>
                <p className="text-muted-foreground mt-1">
                  {searchQuery
                    ? `No products match your search for "${searchQuery}"`
                    : "Try adjusting your filter criteria"}
                </p>
                <Button variant="outline" onClick={clearSearch} className="mt-4">
                  {searchQuery ? "Clear Search" : "Reset Filters"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
