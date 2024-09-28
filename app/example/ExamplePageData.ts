import { dataFn } from "@/data/dataFn"
import { docObs, queryObs } from "@/data/readerFe"
import { logObs } from "@/helpers/logObs"
import { of, startWith } from "rxjs"

export const ExamplePageData = dataFn<{ actionIdParam: string }>()(({
  getParam,
}) => {
  return {
    exampleAction: docObs("actions", getParam("actionIdParam")).pipe(
      startWith({}),
      logObs("exampleAction")
    ),
    allActions: queryObs("actions", ({ where }) => [
      where("archived", "==", false),
    ]),
  }
})

export const ExamplePageDataFns = {
  examplePageData: ExamplePageData,
}
