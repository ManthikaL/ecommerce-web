"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getProductById } from "@/lib/products";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Star,
  Truck,
  ShieldCheck,
  ArrowLeft,
  Minus,
  Plus,
  ShoppingCart,
} from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Badge } from "@/components/ui/badge";
import { CSSProductViewer } from "@/components/css-product-viewer";
import { WishlistButton } from "@/components/wishlist-button";
import { ProductVariants } from "@/components/product-variants";
import { SocialShare } from "@/components/social-share";
import { QuickViewModal } from "@/components/quick-view-modal";

interface ProductDetailPageProps {
  productId: string;
}

export default function ProductDetailPage({
  productId,
}: ProductDetailPageProps) {
  const product = getProductById(productId) as any;
  const relatedProducts = product
    ? (getProductById(product.id, 4, true) as any[])
    : [];
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"2d" | "3d">("2d");

  // Mock variants data
  const variants = [
    {
      id: "1",
      name: "Red",
      type: "color" as const,
      value: "red",
      available: true,
    },
    {
      id: "2",
      name: "Blue",
      type: "color" as const,
      value: "blue",
      available: true,
    },
    {
      id: "3",
      name: "Green",
      type: "color" as const,
      value: "green",
      available: false,
    },
    {
      id: "4",
      name: "Small",
      type: "size" as const,
      value: "S",
      available: true,
    },
    {
      id: "5",
      name: "Medium",
      type: "size" as const,
      value: "M",
      available: true,
    },
    {
      id: "6",
      name: "Large",
      type: "size" as const,
      value: "L",
      available: false,
    },
  ];

  useEffect(() => {
    if (product) {
      // Add to recently viewed
      const recentlyViewed = JSON.parse(
        localStorage.getItem("recentlyViewed") || "[]"
      );
      const filtered = recentlyViewed.filter(
        (item: any) => item.id !== product.id
      );
      const updated = [product, ...filtered].slice(0, 10);
      localStorage.setItem("recentlyViewed", JSON.stringify(updated));
    }
  }, [product]);

  if (!product) {
    return (
      <div className="container px-4 md:px-6 py-12 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <p className="text-muted-foreground mt-2">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Link href="/products">
          <Button className="mt-4">Back to Products</Button>
        </Link>
      </div>
    );
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const addToCompare = () => {
    const compareList = JSON.parse(localStorage.getItem("compareList") || "[]");
    if (!compareList.find((item: any) => item.id === product.id)) {
      compareList.push(product);
      localStorage.setItem("compareList", JSON.stringify(compareList));
    }
  };

  const currentUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/products/${product.id}`
      : "";

  return (
    <div className="container px-4 md:px-6 py-6 md:py-10">
      <Link
        href="/products"
        className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
        {/* Product Images */}
        <div className="flex flex-col gap-4">
          <div className="flex gap-2 mb-4">
            <Button
              variant={viewMode === "2d" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("2d")}
            >
              2D View
            </Button>
            <Button
              variant={viewMode === "3d" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("3d")}
            >
              3D View
            </Button>
          </div>

          {viewMode === "3d" ? (
            <CSSProductViewer
              productName={product.name}
              productImage={
                product.image ||
                `/placeholder.svg?height=400&width=400&text=${product.name}`
              }
            />
          ) : (
            <>
              <div className="overflow-hidden rounded-lg border bg-background">
                <img
                  src={
                    product.image ||
                    `/placeholder.svg?height=600&width=600&text=${product.name}`
                  }
                  alt={product.name}
                  className="aspect-square w-full object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="overflow-hidden rounded-lg border bg-background"
                  >
                    <img
                      src={
                        product.image ||
                        `/placeholder.svg?height=150&width=150&text=${i + 1}`
                      }
                      alt={`${product.name} thumbnail ${i + 1}`}
                      className="aspect-square w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{product.category}</Badge>
              {product.inStock ? (
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400"
                >
                  In Stock
                </Badge>
              ) : (
                <Badge
                  variant="secondary"
                  className="bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400"
                >
                  Out of Stock
                </Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
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
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <p className="text-muted-foreground">{product.description}</p>

          {/* Product Variants */}
          <ProductVariants
            variants={variants}
            onVariantChange={setSelectedVariant}
          />

          {/* Quantity Selector */}
          <div className="flex items-center gap-2 py-4">
            <span className="font-medium">Quantity:</span>
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button variant="outline" size="icon" onClick={increaseQuantity}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <WishlistButton product={product} size="lg" />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={addToCompare}>
              Add to Compare
            </Button>
          </div>

          {/* Social Share */}
          {currentUrl && (
            <SocialShare
              url={currentUrl}
              title={product.name}
              description={product.description}
            />
          )}

          {/* Shipping & Returns */}
          <div className="grid gap-2 pt-4">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">Free shipping on orders over $50</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">30-day return policy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="description">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0">
            <TabsTrigger
              value="description"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              Description
            </TabsTrigger>
            <TabsTrigger
              value="specifications"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              Specifications
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              Reviews
            </TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="pt-4">
            <div className="space-y-4">
              <p>{product.description}</p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl,
                eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget
                ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl
                nisl eget nisl.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="specifications" className="pt-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Product Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-sm font-medium">Brand</span>
                      <span className="text-sm">
                        {product.brand || "ShopEase"}
                      </span>
                      <span className="text-sm font-medium">Model</span>
                      <span className="text-sm">
                        {product.model || "Standard"}
                      </span>
                      <span className="text-sm font-medium">Weight</span>
                      <span className="text-sm">
                        {product.weight || "0.5 kg"}
                      </span>
                      <span className="text-sm font-medium">Dimensions</span>
                      <span className="text-sm">
                        {product.dimensions || "10 x 5 x 2 cm"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-sm font-medium">Material</span>
                      <span className="text-sm">
                        {product.material || "Various"}
                      </span>
                      <span className="text-sm font-medium">Color</span>
                      <span className="text-sm">
                        {product.color || "Multiple options"}
                      </span>
                      <span className="text-sm font-medium">Warranty</span>
                      <span className="text-sm">
                        {product.warranty || "1 year"}
                      </span>
                      <span className="text-sm font-medium">Made in</span>
                      <span className="text-sm">
                        {product.madeIn || "Various countries"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="pt-4">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Customer Reviews</h3>
                <Button>Write a Review</Button>
              </div>
              <div className="space-y-4">
                {product.reviewCount > 0 ? (
                  [...Array(3)].map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                <span className="text-sm font-medium">
                                  {["JD", "SM", "AK"][i]}
                                </span>
                              </div>
                              <span className="font-medium">
                                {["John Doe", "Sarah Miller", "Alex Kim"][i]}
                              </span>
                            </div>
                            <div className="flex">
                              {[...Array(5)].map((_, j) => (
                                <Star
                                  key={j}
                                  className={`h-4 w-4 ${
                                    j < [4, 5, 3][i]
                                      ? "fill-primary text-primary"
                                      : "fill-muted text-muted"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {
                              [
                                "Great product! Exactly what I was looking for.",
                                "Excellent quality and fast shipping. Would buy again.",
                                "Good product but took a while to arrive. Overall satisfied.",
                              ][i]
                            }
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {
                              [
                                "Posted 2 days ago",
                                "Posted 1 week ago",
                                "Posted 2 weeks ago",
                              ][i]
                            }
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No reviews yet</p>
                    <Button variant="outline" className="mt-2">
                      Be the first to review
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.id} className="relative">
                <ProductCard product={relatedProduct} />
                <div className="absolute top-2 right-2">
                  <QuickViewModal
                    product={relatedProduct}
                    trigger={
                      <Button variant="secondary" size="sm">
                        Quick View
                      </Button>
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
