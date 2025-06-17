"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Truck, Zap, Clock } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface ShippingMethod {
  id: string
  name: string
  description: string
  price: number
  estimatedDays: string
  icon: React.ReactNode
}

interface ShippingMethodSelectorProps {
  onMethodChange: (method: ShippingMethod) => void
  defaultMethod?: string
}

export function ShippingMethodSelector({ onMethodChange, defaultMethod = "standard" }: ShippingMethodSelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState(defaultMethod)

  const shippingMethods: ShippingMethod[] = [
    {
      id: "standard",
      name: "Standard Shipping",
      description: "Delivered within business days",
      price: 5.99,
      estimatedDays: "5-7 business days",
      icon: <Truck className="h-5 w-5" />,
    },
    {
      id: "express",
      name: "Express Shipping",
      description: "Faster delivery for urgent orders",
      price: 12.99,
      estimatedDays: "2-3 business days",
      icon: <Zap className="h-5 w-5" />,
    },
    {
      id: "overnight",
      name: "Overnight Shipping",
      description: "Next business day delivery",
      price: 24.99,
      estimatedDays: "1 business day",
      icon: <Clock className="h-5 w-5" />,
    },
  ]

  const handleMethodChange = (methodId: string) => {
    setSelectedMethod(methodId)
    const method = shippingMethods.find((m) => m.id === methodId)
    if (method) {
      onMethodChange(method)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping Method</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedMethod} onValueChange={handleMethodChange}>
          <div className="space-y-3">
            {shippingMethods.map((method) => (
              <div key={method.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value={method.id} id={method.id} />
                <div className="flex items-center gap-3 flex-1">
                  <div className="text-muted-foreground">{method.icon}</div>
                  <div className="flex-1">
                    <Label htmlFor={method.id} className="font-medium cursor-pointer">
                      {method.name}
                    </Label>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                    <p className="text-sm text-muted-foreground">{method.estimatedDays}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{method.price === 0 ? "Free" : formatCurrency(method.price)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  )
}
