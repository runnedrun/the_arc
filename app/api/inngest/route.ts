export const maxDuration = 60

import { serve } from "inngest/next"
import { inngest as client } from "@/inngest/client"
import { processPlayer } from "@/inngest/functions/processPlayer"
import { processGame } from "@/inngest/functions/processGame"
import { processRound } from "@/inngest/functions/processRound"

export const { GET, POST, PUT } = serve({
  client: client,
  functions: [processPlayer, processGame, processRound],
})
