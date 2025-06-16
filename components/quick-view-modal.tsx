"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Star, ShoppingCart, Eye } from "lucide-react";
import type { Product } from "@/types/product";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/context/cart-context";
import { WishlistButton } from "./wishlist-button";

interface QuickViewModalProps {
  product: Product;
  trigger?: React.ReactNode;
}

export function QuickViewModal({ product, trigger }: QuickViewModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, 1);
    setIsOpen(false);
  };

  return (
    <>
      <div onClick={() => setIsOpen(true)}>
        {trigger || (
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-1" />
            Quick View
          </Button>
        )}
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
            <CardContent className="p-0">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 z-10"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                  {/* Product Image */}
                  <div className="space-y-4">
                    <div className="aspect-square overflow-hidden rounded-lg border">
                      <img
                        src={
                          product.image ||
                          `/placeholder.svg?height=500&width=500&text=${product.name}`
                        }
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{product.category}</Badge>
                        {product.inStock ? (
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800"
                          >
                            In Stock
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="bg-red-100 text-red-800"
                          >
                            Out of Stock
                          </Badge>
                        )}
                      </div>

                      <h2 className="text-2xl font-bold mb-2">
                        {product.name}
                      </h2>

                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < product.rating
                                  ? "fill-primary text-primary"
                                  : "fill-muted text-muted"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          ({product.reviewCount} reviews)
                        </span>
                      </div>

                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-3xl font-bold">
                          {formatCurrency(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-lg text-muted-foreground line-through">
                            {formatCurrency(product.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-muted-foreground">
                      {product.description}
                    </p>

                    <div className="flex gap-2">
                      <Button
                        className="flex-1"
                        onClick={handleAddToCart}
                        disabled={!product.inStock}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                      <WishlistButton product={product} />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
