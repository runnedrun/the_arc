"use client"

import { hydrateTimestamps } from "@/data/fetchHelpers/jsonifyTimestamps"
import { objHasUndef } from "@/helpers/filterUndef"
import { objKeys } from "@/helpers/objKeys"
import { omit } from "lodash-es"
import { useParams, useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { Suspense, useEffect, useMemo, useState } from "react"
import { BehaviorSubject, of } from "rxjs"
import {
  DataWithoutStatics,
  DataWithStatics,
  splitDataAndStatics,
} from "./DataWithStatics"
import {
  buildKeyGetterFromObs,
  DataFnType,
  PassFromServerToClientProp,
} from "./serverComponent"
import { useSearchParamSetter } from "./useSearchParamSetter"

type WithDataOptions = {
  allowUndefined?: boolean
  name?: string
  loadingComponent?: JSX.Element
}

export type DataTypeFromDataFn<DataFn extends DataFnType> =
  DataFn extends DataFnType<infer DataType> ? DataType : never

export type ParamsTypeFromDataFn<DataFn extends DataFnType> =
  DataFn extends DataFnType<infer DataType, infer ParamsType>
    ? ParamsType
    : never

export type PropsTypeFromDataFn<DataFn extends DataFnType> =
  DataFn extends DataFnType<infer DataType, infer ParamsType, infer Props>
    ? Props
    : never

export type ResolvedDataTypeFromDataFn<DataFn extends DataFnType> =
  DataWithStatics<DataTypeFromDataFn<DataFn>>

export type PropsFromDataFn<DataFn extends DataFnType> =
  DataFn extends DataFnType<infer DataType, infer Params, infer StaticProps>
    ? ComponentProps<DataType, Params, StaticProps>
    : never

type ComponentProps<
  DataType extends Record<string, unknown>,
  Params extends Record<string, unknown> = Record<never, never>,
  StaticProps extends Record<string, unknown> = Record<never, never>,
> = {
  data: DataWithStatics<DataType>
} & StaticProps & {
    setParam: (name: keyof Params, value: string) => void
    _isLoading: boolean
  }
type TopLevelReturnComponentProps<DataFn extends DataFnType> =
  PassFromServerToClientProp<
    DataWithStatics<DataTypeFromDataFn<DataFn>>,
    ParamsTypeFromDataFn<DataFn>
  > &
    PropsTypeFromDataFn<DataFn>

type TopLevelReturnComponentType<DataFn extends DataFnType> = (
  props: TopLevelReturnComponentProps<DataFn>
) => JSX.Element

export const withData =
  <
    ParamsType extends Record<string, unknown> = Record<never, never>,
    StaticProps extends Record<string, unknown> = Record<never, never>,
  >() =>
  <
    DataType extends Record<string, unknown>,
    DataFn extends DataFnType<DataType, ParamsType, StaticProps> = DataFnType<
      DataType,
      ParamsType,
      StaticProps
    >,
  >(
    dataFn: DataFn,
    Component: (
      props: ComponentProps<
        DataTypeFromDataFn<DataFn>,
        ParamsTypeFromDataFn<DataFn>,
        PropsFromDataFn<DataFn>
      >
    ) => JSX.Element,
    options?: WithDataOptions
  ): TopLevelReturnComponentType<DataFn> => {
    const UnderlyingComponent = (
      props: TopLevelReturnComponentProps<DataFn>
    ) => {
      const setParam = useSearchParamSetter() as (
        name: keyof ParamsType,
        value: string
      ) => void
      const propsForCompare = omit(
        props,
        "_initialValues",
        "children",
        "params"
      ) as unknown as StaticProps

      const propsForPassingToChild = omit(
        props,
        "_initialValues",
        "params"
      ) as unknown as StaticProps

      const params = useParams()
      const searchParams = useSearchParams()

      const allSearchParams = {} as Record<string, string>
      searchParams.forEach((value, key) => {
        allSearchParams[key] = value
      })
      const allParams = {
        ...params,
        ...allSearchParams,
      } as unknown as ParamsType

      const routerReadySubj = useMemo(() => new BehaviorSubject(true), [])

      const paramsSub = useMemo(() => new BehaviorSubject(allParams), [])
      const getObsForParam = buildKeyGetterFromObs(paramsSub, routerReadySubj)

      useEffect(() => {
        paramsSub.next(allParams)
      }, [allParams])

      const propsSubj = useMemo(
        () => new BehaviorSubject(propsForPassingToChild),
        []
      )
      const getObsForProp = buildKeyGetterFromObs(propsSubj, of(true))
      useEffect(() => {
        propsSubj.next(propsForCompare)
      }, [propsForCompare])

      const dataObj = dataFn({
        getParam: getObsForParam,
        getProp: getObsForProp,
      })

      const { dataObs, statics } = splitDataAndStatics(dataObj)

      const [resolvedData, setResolvedData] = useState(
        hydrateTimestamps(
          props._initialValues || {}
        ) as DataWithoutStatics<DataType>
      )

      useEffect(() => {
        const sub = dataObs.subscribe((data) => {
          setResolvedData(data as DataWithoutStatics<DataType>)
        })
        return () => sub.unsubscribe()
      }, [...(dataObj._deps || [])])

      const resolvedWithStatics = { ...resolvedData, ...statics }

      const dataKeys = objKeys(dataObj)

      const allKeysResolvedData = dataKeys.reduce((acc, key) => {
        return { ...acc, [key]: resolvedWithStatics[key] }
      }, {} as DataWithoutStatics<DataType>)

      const isLoading = objHasUndef(allKeysResolvedData)
      const shouldShow = !isLoading || options?.allowUndefined

      return shouldShow ? (
        <Component
          _isLoading={isLoading}
          setParam={setParam}
          data={
            { ...allKeysResolvedData, ...statics } as DataWithStatics<
              DataTypeFromDataFn<DataFn>
            >
          }
          {...(propsForPassingToChild as PropsFromDataFn<DataFn>)}
        />
      ) : (
        options?.loadingComponent || <div></div>
      )
    }
    return (props: TopLevelReturnComponentProps<DataFn>) => (
      <Suspense fallback={<div></div>}>
        <UnderlyingComponent {...props}></UnderlyingComponent>
      </Suspense>
    )
  }
