import { UserProvider } from "@/data/context/UserContext"
import { SampleGameDisplay } from "./SampleGameDisplay"

export default function SampleGamePage() {
  return (
    <UserProvider>
      <SampleGameDisplay />
    </UserProvider>
  )
}

export const generateMetadata = () => {
  return {
    title: "The Arc - Sample Game",
    description: "Bend the arc of history— one letter at a time.",
  }
}
