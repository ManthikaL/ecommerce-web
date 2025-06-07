import type { Product } from "@/types/product"

// Mock product data
const products: Product[] = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    description: "Premium noise-cancelling headphones with crystal clear sound and long battery life.",
    price: 129.99,
    originalPrice: 159.99,
    category: "Electronics",
    rating: 4.5,
    reviewCount: 128,
    image: "/placeholder.svg?height=400&width=400&text=Headphones",
    inStock: true,
    discount: 20,
    createdAt: "2023-01-15T00:00:00Z",
  },
  {
    id: "2",
    name: "Smart Fitness Tracker",
    description: "Track your fitness goals, heart rate, sleep patterns and more with this advanced fitness tracker.",
    price: 89.99,
    originalPrice: 99.99,
    category: "Electronics",
    rating: 4,
    reviewCount: 75,
    image: "/placeholder.svg?height=400&width=400&text=Fitness+Tracker",
    inStock: true,
    discount: 10,
    createdAt: "2023-02-20T00:00:00Z",
  },
  {
    id: "3",
    name: "Organic Cotton T-Shirt",
    description: "Comfortable, eco-friendly t-shirt made from 100% organic cotton.",
    price: 24.99,
    category: "Clothing",
    rating: 4.5,
    reviewCount: 42,
    image: "/placeholder.svg?height=400&width=400&text=T-Shirt",
    inStock: true,
    createdAt: "2023-03-10T00:00:00Z",
  },
  {
    id: "4",
    name: "Stainless Steel Water Bottle",
    description:
      "Eco-friendly, double-walled insulated water bottle that keeps drinks cold for 24 hours or hot for 12 hours.",
    price: 34.99,
    originalPrice: 39.99,
    category: "Home & Kitchen",
    rating: 5,
    reviewCount: 93,
    image: "/placeholder.svg?height=400&width=400&text=Water+Bottle",
    inStock: true,
    createdAt: "2023-01-05T00:00:00Z",
  },
  {
    id: "5",
    name: "Natural Face Moisturizer",
    description: "Hydrating face cream made with natural ingredients for all skin types.",
    price: 28.99,
    category: "Beauty",
    rating: 4,
    reviewCount: 56,
    image: "/placeholder.svg?height=400&width=400&text=Moisturizer",
    inStock: false,
    createdAt: "2023-04-12T00:00:00Z",
  },
  {
    id: "6",
    name: "Wireless Charging Pad",
    description: "Fast wireless charging for all Qi-enabled devices with sleek, minimalist design.",
    price: 29.99,
    originalPrice: 39.99,
    category: "Electronics",
    rating: 4,
    reviewCount: 31,
    image: "/placeholder.svg?height=400&width=400&text=Charging+Pad",
    inStock: true,
    discount: 25,
    createdAt: "2023-05-18T00:00:00Z",
  },
  {
    id: "7",
    name: "Leather Wallet",
    description: "Genuine leather wallet with RFID blocking technology and multiple card slots.",
    price: 49.99,
    category: "Accessories",
    rating: 4.5,
    reviewCount: 28,
    image: "/placeholder.svg?height=400&width=400&text=Wallet",
    inStock: true,
    createdAt: "2023-02-28T00:00:00Z",
  },
  {
    id: "8",
    name: "Smart LED Light Bulb",
    description: "Wi-Fi enabled color-changing LED bulb that can be controlled via smartphone app.",
    price: 19.99,
    originalPrice: 24.99,
    category: "Home & Kitchen",
    rating: 4,
    reviewCount: 45,
    image: "/placeholder.svg?height=400&width=400&text=Light+Bulb",
    inStock: true,
    discount: 20,
    createdAt: "2023-03-25T00:00:00Z",
  },
  {
    id: "9",
    name: "Ceramic Coffee Mug Set",
    description: "Set of 4 handcrafted ceramic coffee mugs in assorted colors.",
    price: 39.99,
    category: "Home & Kitchen",
    rating: 5,
    reviewCount: 19,
    image: "/placeholder.svg?height=400&width=400&text=Mug+Set",
    inStock: true,
    createdAt: "2023-04-05T00:00:00Z",
  },
  {
    id: "10",
    name: "Yoga Mat",
    description: "Non-slip, eco-friendly yoga mat with alignment markings for proper positioning.",
    price: 45.99,
    originalPrice: 59.99,
    category: "Fitness",
    rating: 4.5,
    reviewCount: 37,
    image: "/placeholder.svg?height=400&width=400&text=Yoga+Mat",
    inStock: true,
    discount: 15,
    createdAt: "2023-05-10T00:00:00Z",
  },
  {
    id: "11",
    name: "Portable Bluetooth Speaker",
    description: "Waterproof, portable speaker with 360° sound and 20-hour battery life.",
    price: 79.99,
    originalPrice: 99.99,
    category: "Electronics",
    rating: 4,
    reviewCount: 64,
    image: "/placeholder.svg?height=400&width=400&text=Speaker",
    inStock: true,
    discount: 20,
    createdAt: "2023-01-20T00:00:00Z",
  },
  {
    id: "12",
    name: "Organic Herbal Tea Set",
    description: "Collection of 6 organic herbal teas in biodegradable tea bags.",
    price: 18.99,
    category: "Food & Drink",
    rating: 4.5,
    reviewCount: 22,
    image: "/placeholder.svg?height=400&width=400&text=Tea+Set",
    inStock: true,
    createdAt: "2023-02-15T00:00:00Z",
  },
]

// Get all products
export function getAllProducts(): Product[] {
  return products
}

// Get featured products
export function getFeaturedProducts(limit = 4): Product[] {
  return products.filter((product) => product.inStock && product.discount).slice(0, limit)
}

// Get product by ID
export function getProductById(id: string, limit = 0, related = false): Product | Product[] {
  if (related) {
    const product = products.find((p) => p.id === id)
    if (!product) return []

    return products.filter((p) => p.id !== id && p.category === product.category).slice(0, limit)
  }

  return products.find((product) => product.id === id) as Product
}

// Search products
export function searchProducts(query: string): Product[] {
  const lowercaseQuery = query.toLowerCase()
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.category.toLowerCase().includes(lowercaseQuery),
  )
}

// Filter products by category
export function filterProductsByCategory(category: string): Product[] {
  return products.filter((product) => product.category === category)
}

// Filter products by price range
export function filterProductsByPriceRange(min: number, max: number): Product[] {
  return products.filter((product) => product.price >= min && product.price <= max)
}
