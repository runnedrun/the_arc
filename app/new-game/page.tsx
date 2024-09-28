import { rootComponent } from "@/data/serverComponent"
import { NewGamePage } from "./NewGamePageClientEntry"
import { NewGamePageDataFns } from "./NewGamePageData"

export default rootComponent(NewGamePageDataFns, NewGamePage)
