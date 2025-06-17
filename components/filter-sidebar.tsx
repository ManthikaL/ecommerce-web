"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Filter } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

interface FilterSidebarProps {
  onFiltersChange: (filters: any) => void
  isMobile?: boolean
}

export function FilterSidebar({ onFiltersChange, isMobile = false }: FilterSidebarProps) {
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    categories: [] as string[],
    brands: [] as string[],
    rating: 0,
    inStock: false,
    onSale: false,
  })

  const categories = ["Electronics", "Clothing", "Home & Kitchen", "Beauty", "Sports", "Books"]
  const brands = ["Apple", "Samsung", "Nike", "Adidas", "Sony", "LG", "ShopEase"]

  const handleCategoryChange = (category: string, checked: boolean) => {
    const updatedCategories = checked
      ? [...filters.categories, category]
      : filters.categories.filter((c) => c !== category)

    const updatedFilters = { ...filters, categories: updatedCategories }
    setFilters(updatedFilters)
    onFiltersChange(updatedFilters)
  }

  const handleBrandChange = (brand: string, checked: boolean) => {
    const updatedBrands = checked ? [...filters.brands, brand] : filters.brands.filter((b) => b !== brand)

    const updatedFilters = { ...filters, brands: updatedBrands }
    setFilters(updatedFilters)
    onFiltersChange(updatedFilters)
  }

  const handlePriceChange = (value: number[]) => {
    const updatedFilters = { ...filters, priceRange: value }
    setFilters(updatedFilters)
    onFiltersChange(updatedFilters)
  }

  const handleRatingChange = (rating: number) => {
    const updatedFilters = { ...filters, rating }
    setFilters(updatedFilters)
    onFiltersChange(updatedFilters)
  }

  const handleToggleChange = (key: "inStock" | "onSale", checked: boolean) => {
    const updatedFilters = { ...filters, [key]: checked }
    setFilters(updatedFilters)
    onFiltersChange(updatedFilters)
  }

  const resetFilters = () => {
    const resetFilters = {
      priceRange: [0, 1000],
      categories: [],
      brands: [],
      rating: 0,
      inStock: false,
      onSale: false,
    }
    setFilters(resetFilters)
    onFiltersChange(resetFilters)
  }

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Price Range */}
      <div className="space-y-4">
        <h3 className="font-medium">Price Range</h3>
        <Slider
          value={filters.priceRange}
          onValueChange={handlePriceChange}
          min={0}
          max={1000}
          step={10}
          className="w-full"
        />
        <div className="flex items-center justify-between text-sm">
          <span>${filters.priceRange[0]}</span>
          <span>${filters.priceRange[1]}</span>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        <h3 className="font-medium">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={filters.categories.includes(category)}
                onCheckedChange={(checked) => handleCategoryChange(category, !!checked)}
              />
              <Label htmlFor={`category-${category}`} className="text-sm">
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div className="space-y-4">
        <h3 className="font-medium">Brands</h3>
        <div className="space-y-2">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={filters.brands.includes(brand)}
                onCheckedChange={(checked) => handleBrandChange(brand, !!checked)}
              />
              <Label htmlFor={`brand-${brand}`} className="text-sm">
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div className="space-y-4">
        <h3 className="font-medium">Minimum Rating</h3>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((rating) => (
            <Button
              key={rating}
              variant={filters.rating === rating ? "default" : "outline"}
              size="sm"
              onClick={() => handleRatingChange(rating)}
            >
              {rating}★
            </Button>
          ))}
        </div>
      </div>

      {/* Additional Filters */}
      <div className="space-y-4">
        <h3 className="font-medium">Availability</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="in-stock"
              checked={filters.inStock}
              onCheckedChange={(checked) => handleToggleChange("inStock", !!checked)}
            />
            <Label htmlFor="in-stock" className="text-sm">
              In Stock Only
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="on-sale"
              checked={filters.onSale}
              onCheckedChange={(checked) => handleToggleChange("onSale", !!checked)}
            />
            <Label htmlFor="on-sale" className="text-sm">
              On Sale Only
            </Label>
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <Button variant="outline" onClick={resetFilters} className="w-full">
        Reset Filters
      </Button>
    </div>
  )

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <FilterContent />
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FilterContent />
      </CardContent>
    </Card>
  )
}
