import { Game } from "@/data/types/Game"

export const getEnvironmentContextString = (game: Game): string => {
  const environmentName = game.environmentName || "this realm"
  const contextString = game.environmentDescription
    ? `\Desription of world: ${game.environmentDescription}`
    : ""

  return `${environmentName}
  ${contextString}`
}
