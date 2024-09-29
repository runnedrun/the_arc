"use client"

import { buildDataContext } from "@/data/context/buildDataContext"
import { NewGamePageData, NewGamePageDataFns } from "./NewGamePageData"
import { NewGamePageComponent } from "./NewGamePageComponent"
import { ServerDataReceiverComponent } from "../example/ServerDataReceiverComponent"

export const [NewGamePageDataContext, ProvideNewGamePageData] =
  buildDataContext(NewGamePageData)

export const NewGamePage: ServerDataReceiverComponent<
  typeof NewGamePageDataFns
> = ({ _initialValues, params }) => {
  return (
    <ProvideNewGamePageData
      _initialValues={_initialValues.newGamePageData}
      params={params}
    >
      <NewGamePageComponent />
    </ProvideNewGamePageData>
  )
}
