import ProductDetailPage from "@/components/pages/product-detail-page"

export default function Page({ params }: { params: { productId: string } }) {
  return <ProductDetailPage productId={params.productId} />
}
