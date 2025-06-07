export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  category: string
  rating: number
  reviewCount: number
  image?: string
  inStock: boolean
  discount?: number
  createdAt: string
  brand?: string
  model?: string
  weight?: string
  dimensions?: string
  material?: string
  color?: string
  warranty?: string
  madeIn?: string
}
