
import { FieldValue, Timestamp } from "firebase-admin/firestore"
import { error } from "firebase-functions/logger"
import { onDocumentWritten } from "firebase-functions/v2/firestore"
import { fbSet } from "../helpers/writer"

import { toTimestamp } from "../helpers/toTimestamp"
import { JobTypes, ProcessingJob } from "@/data/types/ProcessJob"


export type ProcessJobFn<OneOffJobDataType extends unknown = object> = (args: {
  docId: string
  trigger: number
  oneOffJobData: OneOffJobDataType
}) => Promise<boolean>
const jobTypeMap: Partial<Record<JobTypes, ProcessJobFn>> = {
  
}

const timeoutSeconds = 540
export const triggerProcessJob = onDocumentWritten(
  {
    document: "processingJob/{docId}",
    maxInstances: 80,
    minInstances: 1,
    memory: "4GiB",
    timeoutSeconds: timeoutSeconds,
    cpu: 2,
  },
  async (change) => {
    const after = (change.data.after.data() || {}) as ProcessingJob
    const before = (change.data.before.data() || {}) as ProcessingJob
    const oldTrigger = toTimestamp(before?.triggeredAt)
    const newTrigger = toTimestamp(after.triggeredAt)

    if (after.retriggerCount > 200) {
      error("retrigger count exceeeded", change.data.after.id)
      return
    }

    if (oldTrigger.toMillis() !== newTrigger.toMillis()) {
      if (after.retriggerCount > 0) {
        console.log(
          "running retrigger",
          change.data.after.id,
          after.retriggerCount
        )
      }
      const jobfn = jobTypeMap[after.jobType]
      if (!jobfn) {
        console.error("No job type found: ", after.jobType)
        return
      }

      const shouldRetrigger = await jobfn({
        docId: change.data.after.id,
        trigger: newTrigger.toMillis(),
        oneOffJobData: after.oneOffJobData,
      })
      if (shouldRetrigger) {
        console.log("retriggering", change.data.after.id, after.retriggerCount)
        fbSet("processingJob", change.data.after.id, {
          triggeredAt: Timestamp.now(),
          retriggerCount: FieldValue.increment(1),
        })
      }
      return
    }
  }
)
