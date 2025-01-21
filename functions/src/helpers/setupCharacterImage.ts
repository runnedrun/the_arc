import path from "path"
import { uploadImageToStorage } from "../triggers/processGame/uploadImageToCloudStorage"
import { getOpenAIClient } from "./getOpenAIClient"
import { fbUpdate } from "./writer"

export type CharacterImageArgs = {
  gameId: string
  name: string
  personality: string
  environmentDescription: string
  collectionName: "players" | "npcs"
  uid: string
}

export const setupCharacterImage = async ({
  gameId,
  name,
  personality,
  environmentDescription,
  collectionName,
  uid,
}: CharacterImageArgs) => {
  const openAiClient = getOpenAIClient()

  // First, generate an optimized prompt using GPT-4
  const promptResponse = await openAiClient.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are an expert dall-e prompt creator. Given the following description of a character generate a very brief (12 words or less) prompt for generating a high quality image of the following character, in a handrawn disney style. Specify that there must be no text.",
      },
      {
        role: "system",
        content: `Character: ${personality}\nWorld description: ${environmentDescription}`,
      },
    ],
    temperature: 0.7,
  })

  const optimizedPrompt = promptResponse.choices[0]?.message?.content

  // Then use the optimized prompt with DALL-E
  const response = await openAiClient.images.generate({
    model: "dall-e-3",
    prompt: optimizedPrompt,
    n: 1,
    quality: "standard",
    size: "1024x1024",
  })

  const imageUrl = response.data[0]?.url
  const filePath = path.join(collectionName, uid, "image.jpg")
  const fbUrl = await uploadImageToStorage(imageUrl, gameId, filePath)
  return fbUrl
}
