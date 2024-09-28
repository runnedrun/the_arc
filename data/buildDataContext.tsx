"use client"

import { createContext } from "react"
import { DataWithStatics } from "./DataWithStatics"
import { DataFnType } from "./serverComponent"
import { useSearchParamSetter } from "./useSearchParamSetter"
import { ParamsTypeFromDataFn, withData } from "./withData"

export const buildDataContext = <DataFn extends DataFnType>(dataFn: DataFn) => {
  type DataObjType = DataWithStatics<ReturnType<DataFn>>
  type ParamsType = ParamsTypeFromDataFn<DataFn>
  type KeyType = keyof ParamsType extends string ? keyof ParamsType : never

  const newContext = createContext({
    setParam: () => {},
    _isLoading: true,
  } as DataObjType & {
    setParam: (name: keyof ParamsType, value: string) => void
    _isLoading: boolean
  })
  const Provider = newContext.Provider
  const ProviderComponent = withData<{}, React.PropsWithChildren<object>>()<
    ReturnType<DataFn>
  >(
    (args) => {
      return dataFn(args) as ReturnType<DataFn> & { _deps?: unknown[] }
    },
    ({ data, children, _isLoading }) => {
      const paramSetter = useSearchParamSetter<KeyType>()

      return (
        <Provider value={{ ...data, setParam: paramSetter, _isLoading }}>
          {children}
        </Provider>
      )
    },
    {
      allowUndefined: true,
    }
  )
  return [newContext, ProviderComponent] as const
}
