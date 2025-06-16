"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

interface ProductVariant {
  id: string
  name: string
  type: "color" | "size"
  value: string
  available: boolean
  price?: number
}

interface ProductVariantsProps {
  variants: ProductVariant[]
  onVariantChange: (variant: ProductVariant) => void
}

export function ProductVariants({ variants, onVariantChange }: ProductVariantsProps) {
  const [selectedVariants, setSelectedVariants] = useState<Record<string, ProductVariant>>({})

  const colorVariants = variants.filter((v) => v.type === "color")
  const sizeVariants = variants.filter((v) => v.type === "size")

  const handleVariantSelect = (variant: ProductVariant) => {
    const updated = { ...selectedVariants, [variant.type]: variant }
    setSelectedVariants(updated)
    onVariantChange(variant)
  }

  return (
    <div className="space-y-6">
      {colorVariants.length > 0 && (
        <div className="space-y-3">
          <Label className="text-base font-medium">Color</Label>
          <div className="flex flex-wrap gap-2">
            {colorVariants.map((variant) => (
              <Button
                key={variant.id}
                variant={selectedVariants.color?.id === variant.id ? "default" : "outline"}
                size="sm"
                disabled={!variant.available}
                onClick={() => handleVariantSelect(variant)}
                className="relative"
              >
                <div
                  className="w-4 h-4 rounded-full mr-2 border"
                  style={{ backgroundColor: variant.value.toLowerCase() }}
                />
                {variant.name}
                {!variant.available && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    Out of Stock
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>
      )}

      {sizeVariants.length > 0 && (
        <div className="space-y-3">
          <Label className="text-base font-medium">Size</Label>
          <div className="flex flex-wrap gap-2">
            {sizeVariants.map((variant) => (
              <Button
                key={variant.id}
                variant={selectedVariants.size?.id === variant.id ? "default" : "outline"}
                size="sm"
                disabled={!variant.available}
                onClick={() => handleVariantSelect(variant)}
                className="min-w-[3rem]"
              >
                {variant.value}
                {!variant.available && <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
