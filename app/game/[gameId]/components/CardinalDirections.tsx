import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "lucide-react"

export function CardinalDirections() {
  return (
    <div className="relative h-32 w-32">
      {/* North */}
      {/* <div className="absolute left-1/2 top-0 flex -translate-x-1/2 transform flex-col items-center">
        <span className="mt-1 text-sm font-bold">N</span>
        <ArrowUp className="h-8 w-8 text-gray-800" />
      </div> */}

      {/* East */}
      <div className="absolute right-0 top-1/2 flex -translate-y-1/2 transform items-center gap-2">
        <ArrowRight className="w-8 text-gray-800" />
        <span className="mt-1 text-sm font-bold">E</span>
      </div>

      {/* South */}
      <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 transform flex-col items-center">
        <ArrowDown className="h-8 text-gray-800" />
        <span className="mt-1 text-sm font-bold">S</span>
      </div>

      {/* West */}
      {/* <div className="absolute left-0 top-1/2 flex -translate-y-1/2 transform items-center gap-2">
        <span className="mt-1 text-sm font-bold">W</span>
        <ArrowLeft className="h-8 w-8 text-gray-800" />
      </div> */}

      {/* Connecting lines */}
    </div>
  )
}
