"use client"

import { useState } from "react"
import FsLightbox from "fslightbox-react"
import Image from "next/image"
import { Product } from "@/types/productType"

export default function ProductImageCell({ product }: { product: Product }) {
  const images = product.images?.map((img) => img.url) || []
  const [toggler, setToggler] = useState(false)
  const [slideIndex, setSlideIndex] = useState(1)

  if (images.length === 0) return <span>No Image</span>

  const openLightbox = (index: number) => {
    setSlideIndex(index + 1) // fslightbox is 1-based
    setToggler(!toggler)
  }

  return (
    <div>
      <Image
        src={images[0]}
        alt={product.name}
        width={50}
        height={50}
        className="rounded cursor-pointer object-cover"
        onClick={() => openLightbox(0)}
      />

      <FsLightbox toggler={toggler} sources={images} slide={slideIndex} />
    </div>
  )
}
