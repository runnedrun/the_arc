
import { deepMapObj } from "@/helpers/deepMapObj"
import { Timestamp } from "@firebase/firestore"
import { Timestamp as BeTimestamp } from "firebase-admin/firestore"
import { isUndefined } from "lodash-es"

const isFbFunction = () =>
  !process.env.NEXT_PUBLIC_FIREBASE_CLIENT_CONFIG_PROJECT_ID

export const jsonifyTimestamps = (obj: object) => {
  return deepMapObj(obj, (nestedValue) => {
    if (
      typeof nestedValue?.nanoseconds !== "undefined" &&
      typeof nestedValue?.seconds !== "undefined"
    ) {
      const ts = new Timestamp(nestedValue.seconds, nestedValue.nanoseconds)
      return ts.toJSON()
    } else if (typeof nestedValue?._key !== "undefined") {
      return nestedValue.path
    }
  })
}

export const hydrateTimestamps = (obj: object) => {
  return deepMapObj(obj || {}, (value) => {
    if (
      !isUndefined(value?.nanoseconds) &&
      !isUndefined(value?.seconds) &&
      isUndefined(value.toJSON)
    ) {
      const TimestampType = isFbFunction() ? BeTimestamp : Timestamp
      return new TimestampType(value.seconds, value.nanoseconds)
    }
  })
}
