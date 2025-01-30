import { DocumentReference } from "@firebase/firestore"

import { triggerEventProcessingOnWrite } from "./triggerEventProcessing"

export const triggerProcessOnWrite = async (
  refPromise: Promise<DocumentReference<object>>
) => {
  triggerEventProcessingOnWrite(refPromise)
}
