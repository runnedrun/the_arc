import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Player } from "@/data/types/Player"
import Image from "next/image"

interface PlayerInfoModalProps {
  player: Player
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const PlayerInfoModal = ({
  player,
  open,
  onOpenChange,
}: PlayerInfoModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{player?.name}'s Information</DialogTitle>
        </DialogHeader>
        <div className="mb-6 flex justify-center">
          <div className="relative h-32 w-32 overflow-hidden rounded-full">
            {player?.playerImageUrl && (
              <Image
                src={player?.playerImageUrl}
                alt={`${player?.name}`}
                fill
                className="object-cover"
                sizes="(max-width: 128px) 100vw, 128px"
              />
            )}
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Personality</h3>
            <p>{player?.playerPersonality || "No personality set"}</p>
          </div>
          <div>
            <h3 className="font-semibold">Secret Objective</h3>
            <p>{player?.secretVision || "No objective set"}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
