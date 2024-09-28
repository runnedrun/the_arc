import { ProcessingJob } from "./types/ProcessJob"

export const CollectionNames: (keyof AllModels)[] = [
  "processingJob"
]

export type AllModels = { 
  processingJob: ProcessingJob
}

export type CollectionModels = Omit<AllModels, "user">
