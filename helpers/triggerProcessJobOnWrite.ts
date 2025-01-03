import { DocumentReference, Timestamp } from "@firebase/firestore"

import { CollectionModels } from "@/data/CollectionModels"
import { fbSet } from "@/data/writerFe"

export const triggerProcessOnWrite = async (
  refPromise: Promise<DocumentReference<object>>
) => {
  const ref = await refPromise
  return fbSet("processingJob", ref.id, {
    triggeredAt: Timestamp.now(),
    jobType: ref.parent.path as keyof CollectionModels,
    retriggerCount: 0,
  })
}
