import { inngest } from "@/inngest/client"
import { NextResponse } from "next/server"

export type TriggerEventRequestForName<T extends keyof EventsWithData> = {
  event: T
  data: EventsWithData[T]
}

export type TriggerRecordProcessingEventData = {
  id: string
}

export type EventsWithData = {
  "setup-player": {
    playerId: string
  }
  players: TriggerRecordProcessingEventData
}

export type TriggerEventRequest = {
  event: keyof EventsWithData
  data: EventsWithData[keyof EventsWithData]
}

export async function POST(req: Request) {
  const { event, data } = await req.json()
  await inngest.send({
    name: event,
    data,
  })
  return NextResponse.json({})
}
