"use client"
import { queryObs } from "@/data/readerFe"
import { fbUpdate, fbCreate, fbBatchDelete } from "@/data/writerFe"
import { triggerProcessOnWrite } from "@/helpers/triggerProcessJobOnWrite"
import { Timestamp } from "firebase/firestore"
import { firstValueFrom, filter, map } from "rxjs"
import { joinGame } from "../join/[gameId]/JoinGameFlow"
import { createNewGameWithCreatorPlayer } from "../new-game/NewGamePage"
import { setTestMode } from "@/helpers/getUuid"
import { defaultGameEnvironments } from "../game/[gameId]/defaultGameEnvironments"
import { getDefaultMessage } from "@/data/types/Message"

const testGameId = "2A7IZLkJwK"
export const setupTestGameValley = async ({ userId }: { userId: string }) => {
  const allMessageIdsForGame = await firstValueFrom(
    queryObs("messages", ({ where }) => [
      where("gameId", "==", testGameId),
    ]).pipe(map((messages) => messages.map((m) => m.uid)))
  )

  await fbBatchDelete("messages", allMessageIdsForGame)

  setTestMode(true)

  const { game, player } = await createNewGameWithCreatorPlayer(userId, {
    isTestGame: true,
    environmentDescription: defaultGameEnvironments["The Valley"].description,
    environmentName: defaultGameEnvironments["The Valley"].name,
  })

  await joinGame({
    gameId: game.uid,
    userId: userId,
    playerName: "testPlayer",
    existingPlayer: player,
    playerPersonality:
      "I am a farmer who wants to create a world where everyone loves water and swimming.",
  })
  await triggerProcessOnWrite(
    fbUpdate("games", game.uid, {
      startTime: Timestamp.now(),
    })
  )

  const npc = await firstValueFrom(
    queryObs("npcs", ({ where }) => [
      where("gameId", "==", game.uid),
      where("playerTribeId", "==", player.uid),
    ]).pipe(
      filter((npcs) => npcs.length > 0),
      map((npcs) => npcs[0])
    )
  )

  console.log("npc exists", npc)

  const round = await firstValueFrom(
    queryObs("rounds", ({ where }) => [where("gameId", "==", game.uid)]).pipe(
      filter((rounds) => rounds.length > 0),
      map((rounds) => rounds[0])
    )
  )
  console.log("round exists", round)

  await fbCreate(
    "messages",
    getDefaultMessage({
      content: "You love swimming, you want to do it all the time",
      gameId: game.uid,
      roundId: round.uid,
      senderId: player.uid,
      type: "npc",
      processedAt: null,
      receiverId: npc.uid,
      tileLocation: null,
      roundIndex: 0,
    })
  )

  await fbCreate(
    "messages",
    getDefaultMessage({
      content:
        "People should not be allowed to swim. It's dangerous, and it could pollute the water for everyone.",
      gameId: game.uid,
      roundId: round.uid,
      senderId: player.uid,
      type: "elderCouncil",
      processedAt: null,
      receiverId: "elderCouncil",
      tileLocation: null,
      roundIndex: 0,
    })
  )

  await fbCreate(
    "messages",
    getDefaultMessage({
      content:
        "I spend the year creating  small water play ground in the river.",
      gameId: game.uid,
      roundId: round.uid,
      senderId: player.uid,
      type: "tileAction",
      processedAt: null,
      receiverId: null,
      tileLocation: {
        x: 0,
        y: 0,
      },
      roundIndex: 0,
    })
  )

  await triggerProcessOnWrite(
    fbUpdate("rounds", round.uid, {
      playersCompletedAt: {
        [player.uid]: Timestamp.now(),
      },
    })
  )

  return game.uid
}

export const setupTestGameNeonCity = async ({ userId }: { userId: string }) => {
  const allMessageIdsForGame = await firstValueFrom(
    queryObs("messages", ({ where }) => [
      where("gameId", "==", testGameId),
    ]).pipe(map((messages) => messages.map((m) => m.uid)))
  )

  await fbBatchDelete("messages", allMessageIdsForGame)

  setTestMode(true)

  const { game, player } = await createNewGameWithCreatorPlayer(userId, {
    isTestGame: true,
    environmentDescription: defaultGameEnvironments["Neon City"].description,
    environmentName: defaultGameEnvironments["Neon City"].name,
  })

  await joinGame({
    gameId: game.uid,
    userId: userId,
    playerName: "testPlayer",
    existingPlayer: player,
    playerPersonality:
      "I am a hacker who wants to take down the corporate system. I have a cybernetic arm, but actually I'm kind of a wimp. I'm not very strong in general, but my cyber arm is really strong.",
  })

  await triggerProcessOnWrite(
    fbUpdate("games", game.uid, {
      startTime: Timestamp.now(),
    })
  )

  const npc = await firstValueFrom(
    queryObs("npcs", ({ where }) => [
      where("gameId", "==", game.uid),
      where("playerTribeId", "==", player.uid),
    ]).pipe(
      filter((npcs) => npcs.length > 0),
      map((npcs) => npcs[0])
    )
  )

  const round = await firstValueFrom(
    queryObs("rounds", ({ where }) => [where("gameId", "==", game.uid)]).pipe(
      filter((rounds) => rounds.length > 0),
      map((rounds) => rounds[0])
    )
  )

  // Create NPC message
  await fbCreate(
    "messages",
    getDefaultMessage({
      content: "We need to establish secure data havens across the city grid",
      gameId: game.uid,
      roundId: round.uid,
      senderId: player.uid,
      type: "npc",
      processedAt: null,
      receiverId: npc.uid,
      tileLocation: null,
      roundIndex: 0,
    })
  )

  // Create Elder Council message
  await fbCreate(
    "messages",
    getDefaultMessage({
      content:
        "Unauthorized hacking and data manipulation threatens the stability of our corporate systems. This must be stopped.",
      gameId: game.uid,
      roundId: round.uid,
      senderId: player.uid,
      type: "elderCouncil",
      processedAt: null,
      receiverId: "elderCouncil",
      tileLocation: null,
      roundIndex: 0,
    })
  )

  // Create tile action
  await fbCreate(
    "messages",
    getDefaultMessage({
      content:
        "I establish a hidden server farm in an abandoned subway terminal.",
      gameId: game.uid,
      roundId: round.uid,
      senderId: player.uid,
      type: "tileAction",
      processedAt: null,
      receiverId: null,
      tileLocation: {
        x: 0,
        y: 0,
      },
      roundIndex: 0,
    })
  )

  await triggerProcessOnWrite(
    fbUpdate("rounds", round.uid, {
      playersCompletedAt: {
        [player.uid]: Timestamp.now(),
      },
    })
  )

  return game.uid
}
