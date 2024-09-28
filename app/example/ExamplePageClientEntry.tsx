"use client"

import { ServerDataReceiverComponent } from "@/data/serverComponent"
import { ExamplePageData, ProvideExamplePageData } from "./ExamplePageData"

export const ExamplePageDataFns = {
  examplePageData: ExamplePageData
}

export const ExamplePage: ServerDataReceiverComponent<
typeof ExamplePageDataFns
> = ({ _initialValues, params }) => {
  return <ProvideExamplePageData>
    
  </ProvideExamplePageData>
}



