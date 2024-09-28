import { isNil } from "lodash-es"
import { useCallback } from "react"
import {
  RouterInfo,
  useRouterInfoNext12,
  useRouterInfoNext13,
} from "./useRouterInfo"

export type SearchParamSetter<ParamName extends string> = (
  param: ParamName,
  value: string
) => void

export const useSearchParamSetterNext12 = <
  ParamName extends string = string,
>() => {
  return useSearchParamSetterBase<ParamName>(useRouterInfoNext12())
}

export const useSearchParamSetter = <ParamName extends string = string>() => {
  return useSearchParamSetterBase<ParamName>(useRouterInfoNext13())
}

export const useSearchParamSetterBase = <ParamName extends string = string>(
  routerInfo: RouterInfo
): SearchParamSetter<ParamName> => {
  const { pathname, searchParams, router } = routerInfo
  const createQueryString = useCallback(
    (name: ParamName, value: string) => {
      const params = new URLSearchParams(searchParams)

      isNil(value) ? params.delete(name) : params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  return useCallback(
    (paramName: ParamName, paramValue: string) => {
      router.replace(pathname + "?" + createQueryString(paramName, paramValue))
    },
    [router, createQueryString]
  )
}
