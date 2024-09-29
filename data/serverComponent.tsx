import { jsonifyTimestampsFe } from "@/data/fetchHelpers/jsonifyTimestampsFe"
import {
  distinctUntilChanged,
  firstValueFrom,
  map,
  Observable,
  of,
  withLatestFrom,
} from "rxjs"
import { DataWithoutStatics, splitDataAndStatics } from "./DataWithStatics"
import { ServerDataReceiverComponent } from "./ServerDataReceiverComponent"

export type PassFromServerToClientProp<
  InitialValuesType extends Record<string, unknown>,
  ParamsType extends Record<string, unknown> = Record<never, never>,
> = {
  _initialValues?: InitialValuesType
  params?: ParamsType
}
export type ComponentWithInitialValues<
  InitialValuesType extends Record<string, unknown>,
  ParamsType extends Record<string, unknown> = Record<never, never>,
  StaticProps extends Record<string, unknown> = Record<never, never>,
> = (
  props: PassFromServerToClientProp<InitialValuesType, ParamsType> & StaticProps
) => JSX.Element

export type GetObsForArgFn<ArgObject extends Record<string, unknown>> = <
  ArgName extends keyof ArgObject,
>(
  argName: ArgName
) => Observable<ArgObject[ArgName]>

export type DataFnType<
  DataType extends Record<string, unknown> = Record<never, never>,
  ParamsType extends Record<string, unknown> = Record<never, never>,
  PropsType extends Record<string, unknown> = Record<never, never>,
> = (args: {
  getParam?: GetObsForArgFn<ParamsType>
  getProp?: GetObsForArgFn<PropsType>
}) => DataType & { _deps?: unknown[] }

export const buildKeyGetterFromObs = <
  ParamsType extends Record<string, unknown>,
>(
  paramObs: Observable<ParamsType>,
  castUndefToNull = of(false)
): GetObsForArgFn<ParamsType> => {
  return (paramName) => {
    const $param = paramObs.pipe(
      map((_) => {
        return _[paramName] as ParamsType[any]
      }),
      distinctUntilChanged()
    )
    const withPossibleNullCast = $param.pipe(
      withLatestFrom(castUndefToNull),
      map(([param, castUndefToNull]) => {
        return castUndefToNull && param === undefined ? null : param
      })
    )
    return withPossibleNullCast
  }
}

export const rootComponent = <
  InputDataFnsType extends Record<string, DataFnType>,
>(
  dataFns: InputDataFnsType,
  ClientComponent: ServerDataReceiverComponent<InputDataFnsType>
) => {
  const Component = async ({
    params,
    searchParams,
  }: {
    params: Record<string, any>
    searchParams: Record<string, any>
  }) => {
    const res = {}
    const dataPromises = Object.keys(dataFns).map(async (dataFnName) => {
      const dataObj = dataFns[dataFnName]({
        getParam: buildKeyGetterFromObs(of({ params, ...searchParams })),
        getProp: buildKeyGetterFromObs(of({})),
      })

      const { dataObs } = splitDataAndStatics(dataObj)
      const data = await firstValueFrom(dataObs)
      res[dataFnName] = data
    })

    await Promise.all(dataPromises)

    return (
      <ClientComponent
        _initialValues={
          jsonifyTimestampsFe(res) as {
            [key in keyof InputDataFnsType]: DataWithoutStatics<
              ReturnType<InputDataFnsType[key]>
            >
          }
        }
        params={{ ...params, ...searchParams }}
      ></ClientComponent>
    )
  }
  return Component
}
