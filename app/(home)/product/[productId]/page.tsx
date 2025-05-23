"use client"

import { useProduct } from "@/app/hooks/useProduct"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useState } from "react"

export default function ProductDetailPage() {
  const { productId } = useParams()
  const { data: product, isLoading } = useProduct(productId as string)
  const [selectedImage, setSelectedImage] = useState(0)

  if (isLoading || !product) {
    return <div className="container mx-auto p-6">Loading...</div>
  }

  const images = product.images || []

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-4">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground">
          <span>Home</span> {" > "}
          {product.category?.name} {" > "}
          {product.name}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            // Main image display
            <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
              {images[selectedImage] && (
                <Image
                  src={images[selectedImage].url}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              )}
            </div>
            
            // Thumbnail gallery
            <div className="grid grid-cols-5 gap-2">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  className={`relative aspect-square overflow-hidden rounded-md ${selectedImage === index ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <Image
                    src={image.url}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold">{product.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star}>★</span>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  3.0 (1 Reviews)
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">SKU: {product.stocks?.[0]?.sku}</p>
              <p className="text-2xl font-bold mt-1">K{product.basePrice}</p>
            </div>

            {/* Stock Status */}
            {product.totalStock > 0 && product.totalStock <= 5 && (
              <div className="text-primary text-sm border border-primary rounded-md p-2">
                Hurry! Only {product.totalStock} left in stock.
              </div>
            )}

            {/* Size Selection */}
            <div className="space-y-2">
              <p className="font-medium">SIZE: SMALL</p>
              <div className="flex gap-2">
                <Button variant="outline" className="h-10 px-6">Small</Button>
              </div>
            </div>

            {/* Color Selection */}
            <div className="space-y-2">
              <p className="font-medium">COLOR: SLATE BLUE</p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="h-10 w-10 rounded-md p-0 border-2"
                  style={{ backgroundColor: '#647D87' }}
                />
              </div>
            </div>

            {/* Material */}
            <div className="space-y-2">
              <p className="font-medium">MATERIAL: PU</p>
              <Button variant="outline" className="h-10 px-6">PU</Button>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex gap-4 items-center">
              <div className="flex items-center border rounded-md">
                <Button variant="ghost" className="h-10 px-3">-</Button>
                <input
                  type="number"
                  className="w-16 text-center border-0 focus:ring-0"
                  value="1"
                  readOnly
                />
                <Button variant="ghost" className="h-10 px-3">+</Button>
              </div>
              <Button className="flex-1" size="lg">Add to Cart</Button>
            </div>

            {/* Customer Service */}
            <Button variant="outline" className="w-full" size="lg">
              Customer Service
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}