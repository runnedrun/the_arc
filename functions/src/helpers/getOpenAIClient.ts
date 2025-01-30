import { defineString } from "firebase-functions/params"
import OpenAI from "openai"

const openAiApiKey = defineString("OPENAI_API_KEY")

export const getOpenAIClient = () => {
  return new OpenAI({
    apiKey: openAiApiKey.value() || process.env.OPENAI_API_KEY,
  })
}
