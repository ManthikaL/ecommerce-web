"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import type { Product } from "@/types/product";

interface WishlistButtonProps {
  product: Product;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "ghost";
}

export function WishlistButton({
  product,
  size = "default",
  variant = "ghost",
}: WishlistButtonProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setIsWishlisted(wishlist.some((item: Product) => item.id === product.id));
  }, [product.id]);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

    if (isWishlisted) {
      const updatedWishlist = wishlist.filter(
        (item: Product) => item.id !== product.id
      );
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      setIsWishlisted(false);
    } else {
      wishlist.push(product);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      setIsWishlisted(true);
    }
  };

  return (
    <Button
      size={size}
      variant={variant}
      onClick={toggleWishlist}
      className={isWishlisted ? "text-red-500 hover:text-red-600" : ""}
    >
      <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
    </Button>
  );
}
