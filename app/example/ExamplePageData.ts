import { buildDataContext } from "@/data/buildDataContext";
import { dataFn } from "@/data/dataFn";
import { docObs, queryObs } from "@/data/readerFe";

export const ExamplePageData = dataFn<{actionIdParam: string}>()(({ getParam}) => {
  return {
    exampleAction: docObs("actions", getParam("actionIdParam")),
    allActions: queryObs("actions", ({where}) => [
      where("archived", "==", false),
    ]),
  }
})

export const [ExamplePageDataContext, ProvideExamplePageData] = buildDataContext(ExamplePageData)