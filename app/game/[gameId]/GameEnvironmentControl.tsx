import { GameInterfaceContext } from "@/app/game/[gameId]/GameInterfaceContext"
import { fbUpdate } from "@/data/writerFe"
import { useContext, useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { defaultGameEnvironments } from "./defaultGameEnvironments"
import { Game } from "@/data/types/Game"

export function GameEnvironmentControl({
  game,
  currentUserId,
}: {
  game: Game
  currentUserId: string
}) {
  const [localDescription, setLocalDescription] = useState(
    game?.environmentDescription || ""
  )

  const isCreator = game.createdBy === currentUserId

  const handleEnvironmentSelect = async (value: string) => {
    const selectedEnv =
      defaultGameEnvironments[value as keyof typeof defaultGameEnvironments]
    if (selectedEnv) {
      setLocalDescription(selectedEnv.description)
      await fbUpdate<"games">("games", game.uid, {
        environmentName: selectedEnv.name,
        environmentDescription: selectedEnv.description,
      })
    }
  }

  const handleDescriptionChange = async (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setLocalDescription(e.target.value)
    await fbUpdate<"games">("games", game.uid, {
      environmentDescription: e.target.value,
    })
  }

  return (
    <div className="space-y-4 pb-4">
      <div className="text-sm text-slate-500">Choose your world:</div>
      <div className="text-slate-500">Arcon:</div>
      <div className="space-y-2">
        <Select
          value={game.environmentName || ""}
          onValueChange={handleEnvironmentSelect}
          disabled={!!game.startTime || !isCreator}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an environment" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(defaultGameEnvironments).map((env) => (
              <SelectItem key={env.name} value={env.name}>
                {env.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="envDescription">Environment Description</Label>
        <Textarea
          disabled={!!game.startTime || !isCreator}
          id="envDescription"
          value={localDescription}
          onChange={handleDescriptionChange}
          placeholder="Describe your game environment"
          className="h-24"
        />
      </div>
    </div>
  )
}
