import { defineString } from "firebase-functions/params"
import axios from "axios"
const apiKey = defineString("GET_IMG_API_KEY")
import dotenv from "dotenv"

const getApiKey = () => {
  return apiKey.value() || process.env.GET_IMG_API_KEY
}

type GenerateWithGetImageOpts = {
  width?: number
  height?: number
  steps?: number
  response_format?: string
  model?: string
}

const defaultOpts: GenerateWithGetImageOpts = {
  width: 512,
  height: 512,
  steps: 10,
  response_format: "url",
  model: "stable-diffusion-v1-5",
}

export const generateWithGetImage = async (
  prompt: string,
  opts: GenerateWithGetImageOpts = {}
) => {
  opts = { ...defaultOpts, ...opts }
  const response = await axios({
    method: "post",
    url: "https://api.getimg.ai/v1/stable-diffusion/text-to-image",
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      "Content-Type": "application/json",
      accept: "application/json",
    },
    data: {
      prompt,
      ...opts,
    },
  })

  const url = response.data.url as string
  return url
}

// const testGenerateWithGetImage = async () => {
//   dotenv.config({ path: ".env.local" })
//   const response = await generateWithGetImage(
//     "A beautiful sunset over the ocean"
//   )
//   console.log("rew", response)
// }

// testGenerateWithGetImage()
