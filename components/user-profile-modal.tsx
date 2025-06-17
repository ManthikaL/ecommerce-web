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
import { User, X, LogOut, Settings, MapPin, CreditCard, AlertCircle } from "lucide-react"
import { useAuth } from "@/context/auth-context"

interface UserProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

interface ValidationErrors {
  name?: string
  email?: string
  age?: string
  phone?: string
  shippingAddress?: {
    firstName?: string
    lastName?: string
    street?: string
    city?: string
    zipCode?: string
  }
  billingAddress?: {
    firstName?: string
    lastName?: string
    street?: string
    city?: string
    zipCode?: string
  }
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
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})

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

  // Validation functions
  const validateName = (name: string): string | undefined => {
    if (!name.trim()) return "Name is required"
    if (!/^[a-zA-Z\s]+$/.test(name)) return "Name should only contain letters and spaces"
    if (name.trim().length < 2) return "Name should be at least 2 characters long"
    return undefined
  }

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) return "Email is required"
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return "Please enter a valid email address (e.g., testmail@gmail.com)"
    return undefined
  }

  const validateAge = (age: string): string | undefined => {
    if (!age.trim()) return "Age is required"
    const ageNum = Number.parseInt(age)
    if (isNaN(ageNum)) return "Age must be a number"
    if (ageNum < 18) return "You must be at least 18 years old"
    if (ageNum > 120) return "Please enter a valid age"
    return undefined
  }

  const validatePhone = (phone: string): string | undefined => {
    if (!phone.trim()) return "Phone number is required"
    if (!/^\d+$/.test(phone)) return "Phone number should only contain numbers"
    if (phone.length !== 10) return "Phone number must be exactly 10 digits"
    return undefined
  }

  const validateZipCode = (zipCode: string): string | undefined => {
    if (!zipCode.trim()) return "ZIP code is required"
    if (!/^\d{5}(-\d{4})?$/.test(zipCode)) return "Please enter a valid ZIP code (e.g., 12345 or 12345-6789)"
    return undefined
  }

  const validateRequired = (value: string, fieldName: string): string | undefined => {
    if (!value.trim()) return `${fieldName} is required`
    return undefined
  }

  const validateAllFields = (): boolean => {
    const errors: ValidationErrors = {}

    // Personal info validation
    const nameError = validateName(formData.name)
    if (nameError) errors.name = nameError

    const emailError = validateEmail(formData.email)
    if (emailError) errors.email = emailError

    const ageError = validateAge(formData.age)
    if (ageError) errors.age = ageError

    const phoneError = validatePhone(formData.phone)
    if (phoneError) errors.phone = phoneError

    // Shipping address validation
    const shippingErrors: any = {}
    const shippingFirstNameError = validateName(formData.shippingAddress.firstName)
    if (shippingFirstNameError) shippingErrors.firstName = shippingFirstNameError

    const shippingLastNameError = validateName(formData.shippingAddress.lastName)
    if (shippingLastNameError) shippingErrors.lastName = shippingLastNameError

    const shippingStreetError = validateRequired(formData.shippingAddress.street, "Street address")
    if (shippingStreetError) shippingErrors.street = shippingStreetError

    const shippingCityError = validateName(formData.shippingAddress.city)
    if (shippingCityError) shippingErrors.city = shippingCityError

    const shippingZipError = validateZipCode(formData.shippingAddress.zipCode)
    if (shippingZipError) shippingErrors.zipCode = shippingZipError

    if (Object.keys(shippingErrors).length > 0) {
      errors.shippingAddress = shippingErrors
    }

    // Billing address validation
    const billingErrors: any = {}
    const billingFirstNameError = validateName(formData.billingAddress.firstName)
    if (billingFirstNameError) billingErrors.firstName = billingFirstNameError

    const billingLastNameError = validateName(formData.billingAddress.lastName)
    if (billingLastNameError) billingErrors.lastName = billingLastNameError

    const billingStreetError = validateRequired(formData.billingAddress.street, "Street address")
    if (billingStreetError) billingErrors.street = billingStreetError

    const billingCityError = validateName(formData.billingAddress.city)
    if (billingCityError) billingErrors.city = billingCityError

    const billingZipError = validateZipCode(formData.billingAddress.zipCode)
    if (billingZipError) billingErrors.zipCode = billingZipError

    if (Object.keys(billingErrors).length > 0) {
      errors.billingAddress = billingErrors
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    // Clear validation error for this field when user starts typing
    if (typeof value === "string") {
      const newErrors = { ...validationErrors }
      if (field.includes(".")) {
        const [parent, child] = field.split(".")
        if (newErrors[parent as keyof ValidationErrors]) {
          delete (newErrors[parent as keyof ValidationErrors] as any)?.[child]
          if (Object.keys(newErrors[parent as keyof ValidationErrors] || {}).length === 0) {
            delete newErrors[parent as keyof ValidationErrors]
          }
        }
      } else {
        delete newErrors[field as keyof ValidationErrors]
      }
      setValidationErrors(newErrors)
    }

    // Handle special input restrictions
    if (
      field === "name" ||
      field === "shippingAddress.firstName" ||
      field === "shippingAddress.lastName" ||
      field === "billingAddress.firstName" ||
      field === "billingAddress.lastName" ||
      field === "shippingAddress.city" ||
      field === "billingAddress.city"
    ) {
      // Only allow letters and spaces
      if (typeof value === "string" && !/^[a-zA-Z\s]*$/.test(value)) {
        return
      }
    }

    if (field === "phone") {
      // Only allow numbers and limit to 10 digits
      if (typeof value === "string") {
        const numericValue = value.replace(/\D/g, "")
        if (numericValue.length > 10) return
        value = numericValue
      }
    }

    if (field === "age") {
      // Only allow numbers
      if (typeof value === "string" && !/^\d*$/.test(value)) {
        return
      }
    }

    if (field === "shippingAddress.zipCode" || field === "billingAddress.zipCode") {
      // Only allow numbers and hyphens for ZIP codes
      if (typeof value === "string" && !/^[\d-]*$/.test(value)) {
        return
      }
    }

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

    // Basic validation for login
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields")
      return
    }

    const emailError = validateEmail(formData.email)
    if (emailError) {
      setError(emailError)
      return
    }

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

    // Validate registration fields
    const nameError = validateName(formData.name)
    const emailError = validateEmail(formData.email)
    const ageError = formData.age ? validateAge(formData.age) : undefined
    const phoneError = formData.phone ? validatePhone(formData.phone) : undefined

    if (nameError || emailError || ageError || phoneError) {
      setError(nameError || emailError || ageError || phoneError || "Please fix the validation errors")
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

    if (!validateAllFields()) {
      setError("Please fix all validation errors before saving")
      return
    }

    updateProfile({
      ...formData,
      age: Number.parseInt(formData.age) || 0,
    })
    setIsEditing(false)
    setError("")
  }

  const handleLogout = () => {
    logout()
    onClose()
  }

  const startEditing = () => {
    setIsEditing(true)
    setValidationErrors({})
    setError("")
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
    setValidationErrors({})
    setError("")
  }

  const ErrorMessage = ({ error }: { error?: string }) => {
    if (!error) return null
    return (
      <div className="flex items-center gap-1 text-sm text-destructive mt-1">
        <AlertCircle className="h-3 w-3" />
        <span>{error}</span>
      </div>
    )
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

              {error && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <span className="text-sm text-destructive">{error}</span>
                </div>
              )}

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
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          disabled={!isEditing}
                          className={validationErrors.name ? "border-destructive" : ""}
                          placeholder="Enter your full name"
                        />
                        <ErrorMessage error={validationErrors.name} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          disabled={!isEditing}
                          className={validationErrors.email ? "border-destructive" : ""}
                          placeholder="testmail@gmail.com"
                        />
                        <ErrorMessage error={validationErrors.email} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="age">Age * (Must be 18+)</Label>
                        <Input
                          id="age"
                          type="text"
                          value={formData.age}
                          onChange={(e) => handleInputChange("age", e.target.value)}
                          disabled={!isEditing}
                          className={validationErrors.age ? "border-destructive" : ""}
                          placeholder="Enter your age"
                        />
                        <ErrorMessage error={validationErrors.age} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number * (10 digits)</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          disabled={!isEditing}
                          className={validationErrors.phone ? "border-destructive" : ""}
                          placeholder="1234567890"
                          maxLength={10}
                        />
                        <ErrorMessage error={validationErrors.phone} />
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
                          <Label>First Name *</Label>
                          <Input
                            placeholder="First Name"
                            value={formData.shippingAddress.firstName}
                            onChange={(e) => handleInputChange("shippingAddress.firstName", e.target.value)}
                            disabled={!isEditing}
                            className={validationErrors.shippingAddress?.firstName ? "border-destructive" : ""}
                          />
                          <ErrorMessage error={validationErrors.shippingAddress?.firstName} />
                        </div>
                        <div className="space-y-2">
                          <Label>Last Name *</Label>
                          <Input
                            placeholder="Last Name"
                            value={formData.shippingAddress.lastName}
                            onChange={(e) => handleInputChange("shippingAddress.lastName", e.target.value)}
                            disabled={!isEditing}
                            className={validationErrors.shippingAddress?.lastName ? "border-destructive" : ""}
                          />
                          <ErrorMessage error={validationErrors.shippingAddress?.lastName} />
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
                        <Label>Street Address *</Label>
                        <Input
                          placeholder="Street Address"
                          value={formData.shippingAddress.street}
                          onChange={(e) => handleInputChange("shippingAddress.street", e.target.value)}
                          disabled={!isEditing}
                          className={validationErrors.shippingAddress?.street ? "border-destructive" : ""}
                        />
                        <ErrorMessage error={validationErrors.shippingAddress?.street} />
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
                          <Label>City *</Label>
                          <Input
                            placeholder="City"
                            value={formData.shippingAddress.city}
                            onChange={(e) => handleInputChange("shippingAddress.city", e.target.value)}
                            disabled={!isEditing}
                            className={validationErrors.shippingAddress?.city ? "border-destructive" : ""}
                          />
                          <ErrorMessage error={validationErrors.shippingAddress?.city} />
                        </div>
                        <div className="space-y-2">
                          <Label>State *</Label>
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
                          <Label>ZIP Code *</Label>
                          <Input
                            placeholder="12345 or 12345-6789"
                            value={formData.shippingAddress.zipCode}
                            onChange={(e) => handleInputChange("shippingAddress.zipCode", e.target.value)}
                            disabled={!isEditing}
                            className={validationErrors.shippingAddress?.zipCode ? "border-destructive" : ""}
                          />
                          <ErrorMessage error={validationErrors.shippingAddress?.zipCode} />
                        </div>
                        <div className="space-y-2">
                          <Label>Country *</Label>
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
                          <Label>First Name *</Label>
                          <Input
                            placeholder="First Name"
                            value={formData.billingAddress.firstName}
                            onChange={(e) => handleInputChange("billingAddress.firstName", e.target.value)}
                            disabled={!isEditing}
                            className={validationErrors.billingAddress?.firstName ? "border-destructive" : ""}
                          />
                          <ErrorMessage error={validationErrors.billingAddress?.firstName} />
                        </div>
                        <div className="space-y-2">
                          <Label>Last Name *</Label>
                          <Input
                            placeholder="Last Name"
                            value={formData.billingAddress.lastName}
                            onChange={(e) => handleInputChange("billingAddress.lastName", e.target.value)}
                            disabled={!isEditing}
                            className={validationErrors.billingAddress?.lastName ? "border-destructive" : ""}
                          />
                          <ErrorMessage error={validationErrors.billingAddress?.lastName} />
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
                        <Label>Street Address *</Label>
                        <Input
                          placeholder="Street Address"
                          value={formData.billingAddress.street}
                          onChange={(e) => handleInputChange("billingAddress.street", e.target.value)}
                          disabled={!isEditing}
                          className={validationErrors.billingAddress?.street ? "border-destructive" : ""}
                        />
                        <ErrorMessage error={validationErrors.billingAddress?.street} />
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
                          <Label>City *</Label>
                          <Input
                            placeholder="City"
                            value={formData.billingAddress.city}
                            onChange={(e) => handleInputChange("billingAddress.city", e.target.value)}
                            disabled={!isEditing}
                            className={validationErrors.billingAddress?.city ? "border-destructive" : ""}
                          />
                          <ErrorMessage error={validationErrors.billingAddress?.city} />
                        </div>
                        <div className="space-y-2">
                          <Label>State *</Label>
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
                          <Label>ZIP Code *</Label>
                          <Input
                            placeholder="12345 or 12345-6789"
                            value={formData.billingAddress.zipCode}
                            onChange={(e) => handleInputChange("billingAddress.zipCode", e.target.value)}
                            disabled={!isEditing}
                            className={validationErrors.billingAddress?.zipCode ? "border-destructive" : ""}
                          />
                          <ErrorMessage error={validationErrors.billingAddress?.zipCode} />
                        </div>
                        <div className="space-y-2">
                          <Label>Country *</Label>
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
                      placeholder="testmail@gmail.com"
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
                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                      <AlertCircle className="h-4 w-4 text-destructive" />
                      <span className="text-sm text-destructive">{error}</span>
                    </div>
                  )}
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
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-age">Age (Must be 18+)</Label>
                      <Input
                        id="register-age"
                        type="text"
                        value={formData.age}
                        onChange={(e) => handleInputChange("age", e.target.value)}
                        placeholder="Enter your age"
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
                      placeholder="testmail@gmail.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-phone">Phone Number (10 digits)</Label>
                    <Input
                      id="register-phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="1234567890"
                      maxLength={10}
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
                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                      <AlertCircle className="h-4 w-4 text-destructive" />
                      <span className="text-sm text-destructive">{error}</span>
                    </div>
                  )}
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
