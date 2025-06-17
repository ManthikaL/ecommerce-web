"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { ProductCard } from "@/components/product-card"
import { getFeaturedProducts } from "@/lib/products"
import { RecentlyViewed } from "@/components/recently-viewed"
import { ProductComparison } from "@/components/product-comparison"

export default function HomePage() {
  const featuredProducts = getFeaturedProducts(4)

  return (
    <div className="flex flex-col gap-12 py-6">
      {/* Hero Section */}
      <section className="container px-4 md:px-6 py-12 md:py-24 lg:py-32">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Discover Quality Products for Your Lifestyle
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Shop our curated collection of premium products designed to enhance your everyday life.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/products">
                <Button size="lg" className="gap-1.5">
                  Shop Now <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[500px] aspect-square overflow-hidden rounded-xl">
              <img
                src="/placeholder.svg?height=600&width=600"
                alt="Hero Image"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container px-4 md:px-6 py-12">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Featured Products</h2>
            <Link href="/products" className="text-sm font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container px-4 md:px-6 py-12">
        <h2 className="text-2xl font-bold tracking-tight mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["Electronics", "Clothing", "Home & Kitchen", "Beauty"].map((category) => (
            <div key={category} className="relative aspect-square overflow-hidden rounded-xl group">
              <img
                src={`/placeholder.svg?height=300&width=300&text=${category}`}
                alt={category}
                className="object-cover w-full h-full transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <h3 className="text-white font-bold text-lg md:text-xl">{category}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-muted py-12 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4 max-w-[600px] mx-auto">
            <h2 className="text-2xl font-bold tracking-tight">Subscribe to Our Newsletter</h2>
            <p className="text-muted-foreground">Stay updated with our latest products and exclusive offers.</p>
            <div className="flex w-full max-w-md flex-col gap-2 min-[400px]:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <Button className="min-[400px]:w-auto">Subscribe</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Recently Viewed */}
      <RecentlyViewed />

      {/* Product Comparison */}
      <ProductComparison />
    </div>
  )
}
