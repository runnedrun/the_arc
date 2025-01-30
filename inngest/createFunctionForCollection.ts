import { CollectionModels } from "@/data/CollectionModels"
import { getBeAppNext } from "@/functions/src/helpers/initAppNextBackend"
import { readDoc } from "@/functions/src/helpers/reader"
import { inngest } from "./client"
import { EventPayload } from "inngest/types"
import { createStepTools } from "inngest/components/InngestStepTools"
import { InngestFunction } from "inngest"
import { getEventNameForCollection } from "./getEventNameForCollection"

export const createFunctionForCollection = <
  CollectionName extends keyof CollectionModels,
>(
  collectionName: CollectionName,
  config: Omit<InngestFunction.Options, "id">,
  handler: (
    data: CollectionModels[CollectionName],
    args: {
      event: EventPayload
      step: ReturnType<typeof createStepTools<typeof inngest>>
    }
  ) => Promise<void>
) => {
  return inngest.createFunction(
    // config
    { id: getEventNameForCollection(collectionName), ...config },
    // trigger (event or cron)
    { event: getEventNameForCollection(collectionName) },
    async ({ event, step }) => {
      getBeAppNext()
      const doc = await readDoc(collectionName, event.data.id)
      await handler(doc, { event, step })
      return
    }
  )
}
