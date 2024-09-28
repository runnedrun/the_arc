import { Timestamp } from "@firebase/firestore"
import { CollectionModels } from "../CollectionModels"
import { Model } from "../baseTypes/Model"

type SubJobNames = "checkForTasksCompleteInUniversalImport"
export type OneOffJobNames = "fanoutUpdatesForFolders"
export type JobTypes = keyof CollectionModels | SubJobNames | OneOffJobNames

export type ProcessingJob = Model<
  {
    expiresAt?: Timestamp
    triggeredAt: Timestamp
    jobType: JobTypes
    retriggerCount?: number
    oneOffJobData?: object
  }
>
