"use client"

import { buildDataContext } from "@/data/buildDataContext"

import { ServerDataReceiverComponent } from "./ServerDataReceiverComponent"
import { ExamplePageData, ExamplePageDataFns } from "./ExamplePageData"
import { ExamplePageComponent } from "./ExamplePageComponent"

export const [ExamplePageDataContext, ProvideExamplePageData] =
  buildDataContext(ExamplePageData)

export const ExamplePage: ServerDataReceiverComponent<
  typeof ExamplePageDataFns
> = ({ _initialValues, params }) => {
  return (
    <ProvideExamplePageData
      _initialValues={_initialValues.examplePageData}
      params={params}
    >
      <ExamplePageComponent />
    </ProvideExamplePageData>
  )
}
