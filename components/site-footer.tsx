import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t py-6 md:py-10">
      <div className="container flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} ShopEase. All rights reserved.</p>
        </div>
        <div className="flex gap-4">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            Terms
          </Link>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            Privacy
          </Link>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  )
}
