import { rootComponent } from "@/data/serverComponent"
import { ExamplePage } from "./ExamplePageClientEntry"
import { ExamplePageDataFns } from "./ExamplePageData"

export default rootComponent(ExamplePageDataFns, ExamplePage)
