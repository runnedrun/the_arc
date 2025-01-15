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

export function GameEnvironmentControl() {
  const { game, currentUserId } = useContext(GameInterfaceContext)
  const [localDescription, setLocalDescription] = useState(
    game?.environmentDescription || ""
  )

  // Only show for game creator
  if (!game || game.createdBy !== currentUserId) {
    return null
  }

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
    <Card className="w-96 p-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="envName">Environment Name</Label>
          <Select
            value={game.environmentName || ""}
            onValueChange={handleEnvironmentSelect}
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
            id="envDescription"
            value={localDescription}
            onChange={handleDescriptionChange}
            placeholder="Describe your game environment"
            className="h-24"
          />
        </div>
      </div>
    </Card>
  )
}
