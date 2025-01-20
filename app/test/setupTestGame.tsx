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
    queryObs("npcs", ({ where }) => [where("gameId", "==", game.uid)]).pipe(
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

  return game.uid
}

export const resetToStartOfRound0 = async ({ gameId }: { gameId: string }) => {
  const allRounds = await firstValueFrom(
    queryObs("rounds", ({ where }) => [where("gameId", "==", gameId)])
  )

  const allRoundsAfterRound0 = allRounds.filter((r) => r.index > 0)

  await fbBatchDelete(
    "rounds",
    allRoundsAfterRound0.map((r) => r.uid)
  )

  const allMessages = await firstValueFrom(
    queryObs("messages", ({ where }) => [where("gameId", "==", gameId)])
  )

  const messagesFromRoundsAfterRound0 = allMessages.filter(
    (m) => m.roundIndex > 0
  )

  await fbBatchDelete(
    "messages",
    messagesFromRoundsAfterRound0.map((m) => m.uid)
  )

  const allNpcs = await firstValueFrom(
    queryObs("npcs", ({ where }) => [where("gameId", "==", gameId)])
  )

  const allNpcsCreatedAfterRound0 = allNpcs.filter(
    (n) => n.createdRoundIndex > 0
  )

  await fbBatchDelete(
    "npcs",
    allNpcsCreatedAfterRound0.map((n) => n.uid)
  )

  const npcFromRound0 = allNpcsCreatedAfterRound0.find(
    (n) => n.createdRoundIndex === 0
  )

  await fbUpdate("npcs", npcFromRound0.uid, {
    currentTileLocation: {
      x: 0,
      y: 0,
    },
  })

  const player = await firstValueFrom(
    queryObs("players", ({ where }) => [where("gameId", "==", gameId)]).pipe(
      filter((players) => players.length > 0),
      map((players) => players[0])
    )
  )

  await fbUpdate("players", player.uid, {
    currentTileLocation: {
      x: 0,
      y: 0,
    },
  })
}

export const advanceRound = async ({ gameId }: { gameId: string }) => {
  const currentRound = await firstValueFrom(
    queryObs("rounds", ({ where }) => [where("gameId", "==", gameId)]).pipe(
      filter((rounds) => rounds.length > 0),
      map((rounds) => rounds[0])
    )
  )
  const player1 = await firstValueFrom(
    queryObs("players", ({ where }) => [where("gameId", "==", gameId)]).pipe(
      filter((players) => players.length > 0),
      map((players) => players[0])
    )
  )
  const npc1 = await firstValueFrom(
    queryObs("npcs", ({ where }) => [where("gameId", "==", gameId)]).pipe(
      filter((npcs) => npcs.length > 0),
      map((npcs) => npcs[0])
    )
  )
  await fbCreate(
    "messages",
    getDefaultMessage({
      content: "You should head east!",
      gameId: gameId,
      roundId: currentRound.uid,
      senderId: player1.uid,
      type: "npc",
      processedAt: null,
      receiverId: npc1.uid,
      tileLocation: null,
      roundIndex: 0,
    })
  )

  await fbCreate(
    "messages",
    getDefaultMessage({
      content:
        "People should not be allowed to swim. It's dangerous, and it could pollute the water for everyone.",
      gameId: gameId,
      roundId: currentRound.uid,
      senderId: player1.uid,
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
        "I spend the year creating  small water play ground in the river. Then I move south.",
      gameId: gameId,
      roundId: currentRound.uid,
      senderId: player1.uid,
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
    fbUpdate("rounds", currentRound.uid, {
      playersCompletedAt: {
        [player1.uid]: Timestamp.now(),
      },
    })
  )
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
