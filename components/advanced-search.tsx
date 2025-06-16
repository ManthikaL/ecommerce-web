"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, X } from "lucide-react"

interface AdvancedSearchProps {
  onSearch: (filters: any) => void
  onClose: () => void
}

export function AdvancedSearch({ onSearch, onClose }: AdvancedSearchProps) {
  const [filters, setFilters] = useState({
    query: "",
    category: "all",
    priceRange: [0, 1000],
    rating: 0,
    inStock: false,
    onSale: false,
    brand: "all",
    sortBy: "relevance",
  })

  const categories = ["Electronics", "Clothing", "Home & Kitchen", "Beauty", "Sports", "Books"]
  const brands = ["Apple", "Samsung", "Nike", "Adidas", "Sony", "LG"]

  const handleSearch = () => {
    onSearch(filters)
    onClose()
  }

  const resetFilters = () => {
    setFilters({
      query: "",
      category: "all",
      priceRange: [0, 1000],
      rating: 0,
      inStock: false,
      onSale: false,
      brand: "all",
      sortBy: "relevance",
    })
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Advanced Search
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="search-query">Search Query</Label>
            <Input
              id="search-query"
              placeholder="Enter keywords..."
              value={filters.query}
              onChange={(e) => setFilters({ ...filters, query: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Brand</Label>
              <Select value={filters.brand} onValueChange={(value) => setFilters({ ...filters, brand: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  {brands.map((brand) => (
                    <SelectItem key={brand} value={brand.toLowerCase()}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <Label>
              Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
            </Label>
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => setFilters({ ...filters, priceRange: value })}
              min={0}
              max={1000}
              step={10}
              className="w-full"
            />
          </div>

          <div className="space-y-4">
            <Label>Minimum Rating</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Button
                  key={rating}
                  variant={filters.rating === rating ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilters({ ...filters, rating })}
                >
                  {rating}★
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="in-stock"
                checked={filters.inStock}
                onCheckedChange={(checked) => setFilters({ ...filters, inStock: !!checked })}
              />
              <Label htmlFor="in-stock">In Stock Only</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="on-sale"
                checked={filters.onSale}
                onCheckedChange={(checked) => setFilters({ ...filters, onSale: !!checked })}
              />
              <Label htmlFor="on-sale">On Sale Only</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Sort By</Label>
            <Select value={filters.sortBy} onValueChange={(value) => setFilters({ ...filters, sortBy: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                <SelectItem value="rating">Customer Rating</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSearch} className="flex-1">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button variant="outline" onClick={resetFilters}>
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
