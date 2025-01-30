import {
  EventsWithData,
  TriggerRecordProcessingEventData,
} from "@/app/api/trigger-event/route"
import { getEventNameForCollection } from "@/inngest/getEventNameForCollection"
import axios from "axios"
import { DocumentReference } from "firebase/firestore"

export const triggerEventProcessing = async <T extends keyof EventsWithData>(
  event: T,
  data: EventsWithData[T]
) => {
  axios.post("/api/trigger-event", { event, data })
}

export const triggerEventProcessingOnWrite = async (
  refPromise: Promise<DocumentReference<object>>
) => {
  const ref = await refPromise
  const eventName = getEventNameForCollection(ref.parent.path)
  return triggerEventProcessing(
    eventName as keyof EventsWithData,
    {
      id: ref.id,
    } as TriggerRecordProcessingEventData
  )
}
