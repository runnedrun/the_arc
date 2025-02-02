import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"
import { useState } from "react"

interface ImageWithModalProps {
  src: string
  alt: string
  title?: string
  description?: string
  imageClassName?: string
}

export function ImageWithModal({
  src,
  alt,
  title,
  description,
  imageClassName = "h-24 w-24 rounded-full object-cover",
}: ImageWithModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className="flex items-center gap-2">
        <Image
          src={src}
          alt={alt}
          className={`cursor-pointer ${imageClassName}`}
          width={400}
          height={400}
          onClick={() => setIsModalOpen(true)}
        />
        {(title || description) && (
          <div>
            {title && <h2 className="text-lg font-bold">{title}</h2>}
            {description && (
              <p className="font-light italic text-gray-600">{description}</p>
            )}
          </div>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTitle className="sr-only">Large Image</DialogTitle>
        <DialogContent className="flex items-center justify-center sm:max-w-[600px]">
          <Image
            src={src}
            alt={alt}
            className="max-h-[80vh] w-auto"
            width={500}
            height={500}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
