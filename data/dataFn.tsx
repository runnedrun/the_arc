import { DataFnType } from "./serverComponent"

export const dataFn =
  <
    ParamsType extends Record<string, unknown> = Record<string, unknown>,
    StaticProps extends Record<string, unknown> = Record<string, unknown>,
  >() =>
  <DataType extends Record<string, unknown>>(
    fn: DataFnType<DataType, ParamsType, StaticProps>
  ) => {
    return fn
  }
