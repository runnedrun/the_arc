import { DataWithoutStatics } from "../../data/DataWithStatics"
import {
  DataFnType,
  ComponentWithInitialValues,
} from "../../data/serverComponent"

export type ServerDataReceiverComponent<
  InputDataFnsType extends Record<string, DataFnType>,
> = ComponentWithInitialValues<
  {
    [key in keyof InputDataFnsType]: DataWithoutStatics<
      ReturnType<InputDataFnsType[key]>
    >
  },
  {},
  { params: any }
>
