"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingCart, User, Menu, X, Heart, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"
import { useState, useEffect } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { SearchBar } from "@/components/search-bar"
import { FilterSidebar } from "@/components/filter-sidebar"
import { UserProfileModal } from "@/components/user-profile-modal"

export function SiteHeader() {
  const pathname = usePathname()
  const { cartItems } = useCart()
  const { user } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [compareCount, setCompareCount] = useState(0)

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0)

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
    const compareList = JSON.parse(localStorage.getItem("compareList") || "[]")
    setWishlistCount(wishlist.length)
    setCompareCount(compareList.length)
  }, [])

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Wishlist", path: "/wishlist" },
  ]

  const handleFiltersChange = (filters: any) => {
    // Handle filter changes - this would typically update the products page
    console.log("Filters changed:", filters)
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 md:gap-6">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" aria-label="Menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                <div className="flex flex-col gap-6 py-4">
                  <div className="flex items-center justify-between">
                    <Link href="/" className="text-xl font-bold" onClick={() => setIsMenuOpen(false)}>
                      ShopEase
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <nav className="flex flex-col gap-4">
                    {navLinks.map((link) => (
                      <Link
                        key={link.path}
                        href={link.path}
                        className={`${
                          pathname === link.path
                            ? "text-foreground font-medium"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
            <Link href="/" className="text-xl font-bold hidden md:block">
              ShopEase
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`text-sm font-medium ${
                    pathname === link.path ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Search Bar and Filter */}
          <div className="hidden md:flex items-center gap-2">
            <SearchBar />
            {pathname === "/products" && <FilterSidebar onFiltersChange={handleFiltersChange} isMobile />}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            {compareCount > 0 && (
              <Button variant="ghost" size="icon" className="relative">
                <BarChart3 className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                  {compareCount}
                </span>
              </Button>
            )}

            <Link href="/wishlist" className="relative">
              <Button variant="ghost" size="icon" aria-label="Wishlist">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                    {wishlistCount}
                  </span>
                )}
              </Button>
            </Link>

            <Link href="/cart" className="relative">
              <Button variant="ghost" size="icon" aria-label="Cart">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              aria-label="Account"
              onClick={() => setShowUserModal(true)}
              className="relative"
            >
              <User className="h-5 w-5" />
              {user && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></span>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden px-4 pb-3">
          <div className="flex gap-2">
            <SearchBar />
            {pathname === "/products" && <FilterSidebar onFiltersChange={handleFiltersChange} isMobile />}
          </div>
        </div>
      </header>

      <UserProfileModal isOpen={showUserModal} onClose={() => setShowUserModal(false)} />
    </>
  )
}
