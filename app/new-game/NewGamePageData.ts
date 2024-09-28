import { dataFn } from "@/data/dataFn"
import { queryObs } from "@/data/readerFe"

export const NewGamePageData = dataFn()(() => {
  return {
    allGames: queryObs("games", ({ where }) => [
      where("archived", "==", false),
    ]),
  }
})

export const NewGamePageDataFns = {
  newGamePageData: NewGamePageData,
}
