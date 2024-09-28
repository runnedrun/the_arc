import { useContext } from "react"
import { ExamplePageDataContext } from "./ExamplePageData"

export const ExamplePageComponent = () => {
  const { allActions, exampleAction, _isLoading } = useContext(
    ExamplePageDataContext
  )
  console.log(allActions, exampleAction)
  if (_isLoading) {
    return <div>Loading...</div>
  }
  return <div>Example Page Component</div>
}
