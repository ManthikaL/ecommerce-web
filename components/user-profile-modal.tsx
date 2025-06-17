"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, X, LogOut, Settings, MapPin, CreditCard } from "lucide-react"
import { useAuth } from "@/context/auth-context"

interface UserProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export function UserProfileModal({ isOpen, onClose }: UserProfileModalProps) {
  const { user, login, register, logout, updateProfile, isLoading } = useAuth()
  const [activeTab, setActiveTab] = useState("login")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    age: "",
    phone: "",
    shippingAddress: {
      firstName: "",
      lastName: "",
      company: "",
      street: "",
      apartment: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
    },
    billingAddress: {
      firstName: "",
      lastName: "",
      company: "",
      street: "",
      apartment: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
    },
    preferences: {
      newsletter: false,
      smsUpdates: false,
      defaultShippingMethod: "standard",
    },
  })
  const [error, setError] = useState("")
  const [isEditing, setIsEditing] = useState(false)

  // Initialize form data with user data when user is logged in
  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        password: "",
        name: user.name,
        age: user.age.toString(),
        phone: user.phone,
        shippingAddress: user.shippingAddress,
        billingAddress: user.billingAddress,
        preferences: user.preferences,
      })
    }
  }, [user])

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const success = await login(formData.email, formData.password)
    if (success) {
      onClose()
    } else {
      setError("Invalid email or password")
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all required fields")
      return
    }

    const success = await register({
      ...formData,
      age: Number.parseInt(formData.age) || 0,
    })

    if (success) {
      onClose()
    } else {
      setError("User already exists with this email")
    }
  }

  const handleUpdateProfile = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    updateProfile({
      ...formData,
      age: Number.parseInt(formData.age) || 0,
    })
    setIsEditing(false)
  }

  const handleLogout = () => {
    logout()
    onClose()
  }

  const startEditing = () => {
    setIsEditing(true)
  }

  const cancelEditing = () => {
    // Reset form data to original user data
    if (user) {
      setFormData({
        email: user.email,
        password: "",
        name: user.name,
        age: user.age.toString(),
        phone: user.phone,
        shippingAddress: user.shippingAddress,
        billingAddress: user.billingAddress,
        preferences: user.preferences,
      })
    }
    setIsEditing(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            <CardTitle>{user ? "My Profile" : "Sign In"}</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent>
          {user ? (
            // User Profile View
            <div className="space-y-6">
              {/* Global Edit Controls */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Profile Information</h3>
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button size="sm" onClick={handleUpdateProfile}>
                        Save All Changes
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelEditing}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" variant="outline" onClick={startEditing}>
                      <Settings className="h-4 w-4 mr-1" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>

              <Tabs defaultValue="profile">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="profile">Personal Info</TabsTrigger>
                  <TabsTrigger value="addresses">Addresses</TabsTrigger>
                  <TabsTrigger value="preferences">Preferences</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-4">
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="age">Age</Label>
                        <Input
                          id="age"
                          type="number"
                          value={formData.age}
                          onChange={(e) => handleInputChange("age", e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </form>

                  <div className="pt-4 border-t">
                    <Button variant="destructive" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="addresses" className="space-y-6">
                  {/* Shipping Address */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <h3 className="font-medium">Shipping Address</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>First Name</Label>
                          <Input
                            placeholder="First Name"
                            value={formData.shippingAddress.firstName}
                            onChange={(e) => handleInputChange("shippingAddress.firstName", e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Last Name</Label>
                          <Input
                            placeholder="Last Name"
                            value={formData.shippingAddress.lastName}
                            onChange={(e) => handleInputChange("shippingAddress.lastName", e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Company (Optional)</Label>
                        <Input
                          placeholder="Company (Optional)"
                          value={formData.shippingAddress.company}
                          onChange={(e) => handleInputChange("shippingAddress.company", e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Street Address</Label>
                        <Input
                          placeholder="Street Address"
                          value={formData.shippingAddress.street}
                          onChange={(e) => handleInputChange("shippingAddress.street", e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Apartment, suite, etc. (Optional)</Label>
                        <Input
                          placeholder="Apartment, suite, etc. (Optional)"
                          value={formData.shippingAddress.apartment}
                          onChange={(e) => handleInputChange("shippingAddress.apartment", e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>City</Label>
                          <Input
                            placeholder="City"
                            value={formData.shippingAddress.city}
                            onChange={(e) => handleInputChange("shippingAddress.city", e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>State</Label>
                          <Select
                            value={formData.shippingAddress.state}
                            onValueChange={(value) => handleInputChange("shippingAddress.state", value)}
                            disabled={!isEditing}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="State" />
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
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>ZIP Code</Label>
                          <Input
                            placeholder="ZIP Code"
                            value={formData.shippingAddress.zipCode}
                            onChange={(e) => handleInputChange("shippingAddress.zipCode", e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Country</Label>
                          <Select
                            value={formData.shippingAddress.country}
                            onValueChange={(value) => handleInputChange("shippingAddress.country", value)}
                            disabled={!isEditing}
                          >
                            <SelectTrigger>
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
                      </div>
                    </div>
                  </div>

                  {/* Billing Address */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      <h3 className="font-medium">Billing Address</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>First Name</Label>
                          <Input
                            placeholder="First Name"
                            value={formData.billingAddress.firstName}
                            onChange={(e) => handleInputChange("billingAddress.firstName", e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Last Name</Label>
                          <Input
                            placeholder="Last Name"
                            value={formData.billingAddress.lastName}
                            onChange={(e) => handleInputChange("billingAddress.lastName", e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Company (Optional)</Label>
                        <Input
                          placeholder="Company (Optional)"
                          value={formData.billingAddress.company}
                          onChange={(e) => handleInputChange("billingAddress.company", e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Street Address</Label>
                        <Input
                          placeholder="Street Address"
                          value={formData.billingAddress.street}
                          onChange={(e) => handleInputChange("billingAddress.street", e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Apartment, suite, etc. (Optional)</Label>
                        <Input
                          placeholder="Apartment, suite, etc. (Optional)"
                          value={formData.billingAddress.apartment}
                          onChange={(e) => handleInputChange("billingAddress.apartment", e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>City</Label>
                          <Input
                            placeholder="City"
                            value={formData.billingAddress.city}
                            onChange={(e) => handleInputChange("billingAddress.city", e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>State</Label>
                          <Select
                            value={formData.billingAddress.state}
                            onValueChange={(value) => handleInputChange("billingAddress.state", value)}
                            disabled={!isEditing}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="State" />
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
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>ZIP Code</Label>
                          <Input
                            placeholder="ZIP Code"
                            value={formData.billingAddress.zipCode}
                            onChange={(e) => handleInputChange("billingAddress.zipCode", e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Country</Label>
                          <Select
                            value={formData.billingAddress.country}
                            onValueChange={(value) => handleInputChange("billingAddress.country", value)}
                            disabled={!isEditing}
                          >
                            <SelectTrigger>
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
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="preferences" className="space-y-4">
                  <h3 className="font-medium">Communication Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="newsletter"
                        checked={formData.preferences.newsletter}
                        onCheckedChange={(checked) => handleInputChange("preferences.newsletter", !!checked)}
                        disabled={!isEditing}
                      />
                      <Label htmlFor="newsletter">Subscribe to newsletter</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="sms"
                        checked={formData.preferences.smsUpdates}
                        onCheckedChange={(checked) => handleInputChange("preferences.smsUpdates", !!checked)}
                        disabled={!isEditing}
                      />
                      <Label htmlFor="sms">Receive SMS updates</Label>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-medium">Shipping Preferences</h3>
                    <div className="space-y-2">
                      <Label>Default Shipping Method</Label>
                      <Select
                        value={formData.preferences.defaultShippingMethod}
                        onValueChange={(value) => handleInputChange("preferences.defaultShippingMethod", value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard Shipping (5-7 days)</SelectItem>
                          <SelectItem value="express">Express Shipping (2-3 days)</SelectItem>
                          <SelectItem value="overnight">Overnight Shipping (1 day)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            // Login/Register View
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      required
                    />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-name">Full Name *</Label>
                      <Input
                        id="register-name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-age">Age</Label>
                      <Input
                        id="register-age"
                        type="number"
                        value={formData.age}
                        onChange={(e) => handleInputChange("age", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email *</Label>
                    <Input
                      id="register-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-phone">Phone Number</Label>
                    <Input
                      id="register-phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password *</Label>
                    <Input
                      id="register-password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      required
                    />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
