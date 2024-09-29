import { useEffect, useState } from "react"
import { Observable } from "rxjs"

export const useObs = <DataType extends unknown>(
  observable: Observable<DataType>,
  deps?: unknown[]
) => {
  const [value, setValue] = useState<DataType | null>(null)

  useEffect(() => {
    const subscription = observable.subscribe((newValue) => {
      setValue(newValue)
    })

    return () => subscription.unsubscribe()
  }, deps || [])

  return value
}
