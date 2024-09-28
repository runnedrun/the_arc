import { isEmptyObj } from "@/helpers/isEmptyObj"
import { Observable, combineLatest, isObservable, of } from "rxjs"

export type DataWithStatics<DataType extends Record<string, unknown>> = {
  [key in keyof DataType]: DataType[key] extends Observable<infer T>
    ? T
    : DataType[key]
}

export type DataWithoutStatics<DataType extends Record<string, unknown>> = {
  [key in keyof DataType]: DataType[key] extends Observable<infer T> ? T : never
}

export type DataObsWithoutStatics<DataType extends Record<string, unknown>> = {
  [key in keyof DataType]: DataType[key] extends Observable<unknown>
    ? DataType[key]
    : never
}

export const splitDataAndStatics = <DataType extends Record<string, unknown>>(
  dataObj: DataType
) => {
  const dataWithoutStatics = {} as Record<string, Observable<unknown>>
  const statics = {} as Record<string, unknown>
  Object.keys(dataObj).forEach((key) => {
    const value = dataObj[key]
    if (isObservable(value)) {
      dataWithoutStatics[key] = value
    } else {
      statics[key] = value
    }
  })

  const oneObs = isEmptyObj(dataWithoutStatics)
    ? of({})
    : combineLatest(dataWithoutStatics)
  return { dataObs: oneObs, statics }
}
