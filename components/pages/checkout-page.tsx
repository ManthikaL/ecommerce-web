"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, CreditCard, Edit } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { ShippingMethodSelector } from "@/components/shipping-method-selector"

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    sameAsBilling: true,
    billingFirstName: "",
    billingLastName: "",
    billingCompany: "",
    billingAddress: "",
    billingApartment: "",
    billingCity: "",
    billingState: "",
    billingZipCode: "",
    billingCountry: "United States",
  })

  // Add shipping method state
  const [selectedShippingMethod, setSelectedShippingMethod] = useState({
    id: "standard",
    name: "Standard Shipping",
    description: "Delivered within business days",
    price: 5.99,
    estimatedDays: "5-7 business days",
    icon: null,
  })

  const subtotal = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)

  // Update shipping calculation
  const shipping = subtotal > 50 ? 0 : selectedShippingMethod.price
  const tax = subtotal * 0.07
  const total = subtotal + shipping + tax

  // Auto-fill form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.shippingAddress.firstName || user.name.split(" ")[0] || "",
        lastName: user.shippingAddress.lastName || user.name.split(" ").slice(1).join(" ") || "",
        company: user.shippingAddress.company || "",
        email: user.email,
        phone: user.phone,
        address: user.shippingAddress.street,
        apartment: user.shippingAddress.apartment || "",
        city: user.shippingAddress.city,
        state: user.shippingAddress.state,
        zipCode: user.shippingAddress.zipCode,
        country: user.shippingAddress.country,
        sameAsBilling: true,
        billingFirstName: user.billingAddress.firstName || user.name.split(" ")[0] || "",
        billingLastName: user.billingAddress.lastName || user.name.split(" ").slice(1).join(" ") || "",
        billingCompany: user.billingAddress.company || "",
        billingAddress: user.billingAddress.street,
        billingApartment: user.billingAddress.apartment || "",
        billingCity: user.billingAddress.city,
        billingState: user.billingAddress.state,
        billingZipCode: user.billingAddress.zipCode,
        billingCountry: user.billingAddress.country,
      })
    }
  }, [user])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate order processing
    setTimeout(() => {
      clearCart()
      router.push("/checkout/success")
    }, 1500)
  }

  if (cartItems.length === 0) {
    return (
      <div className="container px-4 md:px-6 py-12">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h2 className="text-xl font-semibold">Your cart is empty</h2>
          <p className="mt-2 text-center text-muted-foreground">
            You need to add items to your cart before checking out.
          </p>
          <Link href="/products">
            <Button className="mt-6">Browse Products</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 md:px-6 py-12">
      <Link
        href="/cart"
        className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Cart
      </Link>

      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* User Info Display */}
              {user && !isEditing && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Shipping Information</CardTitle>
                      <CardDescription>Using your saved address</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="font-medium">
                      {user.shippingAddress.firstName} {user.shippingAddress.lastName}
                    </p>
                    {user.shippingAddress.company && (
                      <p className="text-muted-foreground">{user.shippingAddress.company}</p>
                    )}
                    <p className="text-muted-foreground">{user.email}</p>
                    <p className="text-muted-foreground">{user.phone}</p>
                    <div className="text-muted-foreground">
                      <p>{user.shippingAddress.street}</p>
                      {user.shippingAddress.apartment && <p>{user.shippingAddress.apartment}</p>}
                      <p>
                        {user.shippingAddress.city}, {user.shippingAddress.state} {user.shippingAddress.zipCode}
                      </p>
                      <p>{user.shippingAddress.country}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Shipping Information Form */}
              {(!user || isEditing) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Information</CardTitle>
                    <CardDescription>
                      {user ? "Edit your shipping details" : "Enter your shipping details"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">First Name</Label>
                        <Input
                          id="first-name"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Last Name</Label>
                        <Input
                          id="last-name"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company (Optional)</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Street Address</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apartment">Apartment, suite, etc. (Optional)</Label>
                      <Input
                        id="apartment"
                        value={formData.apartment}
                        onChange={(e) => handleInputChange("apartment", e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => handleInputChange("city", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Select value={formData.state} onValueChange={(value) => handleInputChange("state", value)}>
                          <SelectTrigger id="state">
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AL">Alabama</SelectItem>
                            <SelectItem value="AK">Alaska</SelectItem>
                            <SelectItem value="AZ">Arizona</SelectItem>
                            <SelectItem value="CA">California</SelectItem>
                            <SelectItem value="CO">Colorado</SelectItem>
                            <SelectItem value="FL">Florida</SelectItem>
                            <SelectItem value="NY">New York</SelectItem>
                            <SelectItem value="TX">Texas</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zip">ZIP Code</Label>
                        <Input
                          id="zip"
                          value={formData.zipCode}
                          onChange={(e) => handleInputChange("zipCode", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                        <SelectTrigger id="country">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="United States">United States</SelectItem>
                          <SelectItem value="Canada">Canada</SelectItem>
                          <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                          <SelectItem value="Australia">Australia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {isEditing && (
                      <div className="flex gap-2 pt-4 border-t">
                        <Button type="button" onClick={() => setIsEditing(false)}>
                          Save Changes
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Shipping Method */}
              <ShippingMethodSelector
                onMethodChange={setSelectedShippingMethod}
                defaultMethod={user?.preferences?.defaultShippingMethod || "standard"}
              />

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                  <CardDescription>Select your preferred payment method</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="card">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="card">Credit Card</TabsTrigger>
                      <TabsTrigger value="paypal">PayPal</TabsTrigger>
                      <TabsTrigger value="apple">Apple Pay</TabsTrigger>
                    </TabsList>
                    <TabsContent value="card" className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="card-number">Card Number</Label>
                        <Input id="card-number" placeholder="1234 5678 9012 3456" required />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input id="expiry" placeholder="MM/YY" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvc">CVC</Label>
                          <Input id="cvc" placeholder="123" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="name-on-card">Name on Card</Label>
                        <Input id="name-on-card" required />
                      </div>
                    </TabsContent>
                    <TabsContent value="paypal" className="py-4">
                      <div className="flex flex-col items-center justify-center py-6 text-center">
                        <p className="text-muted-foreground">
                          You will be redirected to PayPal to complete your payment.
                        </p>
                      </div>
                    </TabsContent>
                    <TabsContent value="apple" className="py-4">
                      <div className="flex flex-col items-center justify-center py-6 text-center">
                        <p className="text-muted-foreground">
                          You will be prompted to complete your payment with Apple Pay.
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <svg
                      className="mr-2 h-4 w-4 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Place Order
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Cart Items */}
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-md border overflow-hidden">
                        <img
                          src={item.product.image || `/placeholder.svg?height=40&width=40&text=${item.product.name}`}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="text-sm font-medium">{formatCurrency(item.product.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping === 0 ? "Free" : formatCurrency(shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (7%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
