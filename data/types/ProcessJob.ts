import { Timestamp } from "@firebase/firestore"
import { CollectionModels } from "../CollectionModels"
import { Model } from "../baseTypes/Model"

export type JobTypes = keyof CollectionModels

export type ProcessingJob = Model<{
  expiresAt?: Timestamp
  triggeredAt: Timestamp
  jobType: JobTypes
  retriggerCount?: number
  oneOffJobData?: object
}>
