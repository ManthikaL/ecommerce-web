"use client"

import { Button } from "@/components/ui/button"
import { Share2, Facebook, Twitter, MessageCircle, Link2 } from "lucide-react"
import { useState } from "react"

interface SocialShareProps {
  url: string
  title: string
  description?: string
}

export function SocialShare({ url, title, description }: SocialShareProps) {
  const [copied, setCopied] = useState(false)

  const shareData = {
    title,
    text: description,
    url,
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        console.log("Error sharing:", error)
      }
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.log("Error copying to clipboard:", error)
    }
  }

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">Share:</span>

      {navigator.share && (
        <Button variant="outline" size="sm" onClick={handleNativeShare}>
          <Share2 className="h-4 w-4" />
        </Button>
      )}

      <Button variant="outline" size="sm" onClick={() => window.open(shareUrls.facebook, "_blank")}>
        <Facebook className="h-4 w-4" />
      </Button>

      <Button variant="outline" size="sm" onClick={() => window.open(shareUrls.twitter, "_blank")}>
        <Twitter className="h-4 w-4" />
      </Button>

      <Button variant="outline" size="sm" onClick={() => window.open(shareUrls.whatsapp, "_blank")}>
        <MessageCircle className="h-4 w-4" />
      </Button>

      <Button variant="outline" size="sm" onClick={copyToClipboard}>
        <Link2 className="h-4 w-4" />
        {copied ? "Copied!" : "Copy"}
      </Button>
    </div>
  )
}
