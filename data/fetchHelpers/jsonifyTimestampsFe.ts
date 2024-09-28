import { deepMapObj } from "@/helpers/deepMapObj"
import { Timestamp } from "@firebase/firestore"
import { isUndefined } from "lodash-es"

export const jsonifyTimestampsFe = (obj: object) => {
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

export const hydrateTimestampsFe = (obj: object) => {
  return deepMapObj(obj || {}, (value) => {
    if (
      !isUndefined(value?.nanoseconds) &&
      !isUndefined(value?.seconds) &&
      isUndefined(value.toJSON)
    ) {
      return new Timestamp(value.seconds, value.nanoseconds)
    }
  })
}
