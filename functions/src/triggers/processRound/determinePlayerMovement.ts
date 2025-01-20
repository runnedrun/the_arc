import { GameProcessingArgs } from "../processGame/getGameData"
import { getMessagesForTiles } from "./getMessagesForTiles"
import { getOpenAIClient } from "../../helpers/getOpenAIClient"
import { z } from "zod"
import { zodResponseFormat } from "openai/helpers/zod"
import { getDefaultMessage } from "@/data/types/Message"
import { fbSet, fbCreate, backendNow } from "../../helpers/writer"
import { MapPosition } from "@/data/types/MapTile"

// Schema for GPT response
const MovementSchema = z.object({
  movements: z.array(
    z.object({
      entityIndex: z.number(),
      direction: z.enum(["north", "south", "east", "west"]),
    })
  ),
})

const getNewPosition = (
  currentPos: MapPosition,
  direction: string,
  mapSize: number
): MapPosition | null => {
  const pos = { ...currentPos }

  switch (direction) {
    case "north":
      if (pos.y > 0) pos.y -= 1
      else return null
      break
    case "south":
      if (pos.y < mapSize - 1) pos.y += 1
      else return null
      break
    case "east":
      if (pos.x < mapSize - 1) pos.x += 1
      else return null
      break
    case "west":
      if (pos.x > 0) pos.x -= 1
      else return null
      break
  }

  return pos
}

export const determinePlayerMovement = async (args: GameProcessingArgs) => {
  const { game, currentRound, players, npcs } = args

  // Get all messages for this round
  const tileMessages = await getMessagesForTiles({
    roundId: currentRound.uid,
    gameId: game.uid,
  })

  // Process all tiles in parallel
  await Promise.all(
    Object.entries(tileMessages).map(async ([locationStr, messages]) => {
      const location = JSON.parse(locationStr)

      // Get all entities on this tile
      const entitiesOnTile = [
        ...players.filter(
          (p) =>
            p.currentTileLocation?.x === location.x &&
            p.currentTileLocation?.y === location.y
        ),
        ...npcs.filter(
          (n) =>
            n.currentTileLocation?.x === location.x &&
            n.currentTileLocation?.y === location.y
        ),
      ]

      if (entitiesOnTile.length === 0) return

      // Format messages for GPT
      const formattedActions = messages
        .map((msg, index) => {
          const entity = entitiesOnTile.find((e) => e.uid === msg.senderId)
          if (!entity) return null
          const entityIndex = entitiesOnTile.indexOf(entity)
          return `${entityIndex}: ${msg.content}`
        })
        .filter(Boolean)
        .join("\n")

      // Get movement decisions from GPT
      const openAiClient = getOpenAIClient()
      const completion = await openAiClient.beta.chat.completions.parse({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "You are a movement coordinator. Based on the actions described, determine with a direction (if any) each entity should move. Respond with an index-to-direction mapping. If no movement is described, do not move that entity.",
          },
          {
            role: "user",
            content: `Based on these actions, which are in the format "Entity Index: Action", determine where each entity should move:\n${formattedActions}`,
          },
        ],
        response_format: zodResponseFormat(MovementSchema, "movements"),
        temperature: 0.2,
      })

      // Process all movements for this tile in parallel
      await Promise.all(
        completion.choices[0].message.parsed.movements.map(
          async ({ entityIndex, direction }) => {
            const entity = entitiesOnTile[entityIndex]
            if (!entity?.currentTileLocation) return

            const newPosition = getNewPosition(
              entity.currentTileLocation,
              direction,
              game.mapSize
            )

            // Create an array of promises for parallel execution
            const updatePromises = [
              fbCreate(
                "messages",
                getDefaultMessage({
                  gameId: game.uid,
                  roundId: currentRound.uid,
                  type: "tileMovement",
                  content: newPosition
                    ? `${entity.name} moved ${direction}`
                    : `${entity.name} tried to move ${direction} but reached the end of the map`,
                  tileLocation: entity.currentTileLocation,
                  senderId: null,
                  receiverId: null,
                  roundIndex: currentRound.index,
                  processedAt: backendNow(),
                })
              ),
            ]

            // Only add position update and explored status if movement is valid
            if (newPosition) {
              updatePromises.push(
                fbSet(
                  entity.hasOwnProperty("userId") ? "players" : "npcs",
                  entity.uid,
                  {
                    currentTileLocation: newPosition,
                  }
                )
              )

              const newMapTile = args.mapTiles.find(
                (mt) =>
                  mt.position.x === newPosition.x &&
                  mt.position.y === newPosition.y
              )

              // Mark new tile as explored only for players
              if (entity.hasOwnProperty("userId")) {
                updatePromises.push(
                  fbSet(`mapTiles`, newMapTile.uid, {
                    explored: true,
                    exploredInRoundId: currentRound.uid,
                    exploredInRoundIndex: currentRound.index,
                  })
                )
              }
            }

            // Execute all updates in parallel
            await Promise.all(updatePromises)
          }
        )
      )
    })
  )
}
