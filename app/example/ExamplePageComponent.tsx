import { useContext } from "react"
import { ExamplePageDataContext } from "./ExamplePageClientEntry"

export const ExamplePageComponent = () => {
  const { allActions, exampleAction, _isLoading } = useContext(
    ExamplePageDataContext
  )
  if (_isLoading) {
    return <div>Loading...</div>
  }
  return <div>Example Page Component</div>
}
