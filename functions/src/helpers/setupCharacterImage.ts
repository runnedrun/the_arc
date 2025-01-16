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
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content:
          "Create a single, detailed sentence for DALL-E that describes a fantasy character's visual appearance. Focus only on visual elements like physical features, clothing, and atmosphere. Do not include non-visual elements or background story.",
      },
      {
        role: "user",
        content: `Character name: ${name}\nPersonality: ${personality}\nWorld description: ${environmentDescription}`,
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
    size: "1024x1024",
  })

  const imageUrl = response.data[0]?.url
  const filePath = path.join(collectionName, uid, "image.jpg")
  const fbUrl = await uploadImageToStorage(imageUrl, gameId, filePath)
  return fbUrl
}
