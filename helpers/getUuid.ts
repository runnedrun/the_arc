import { v4 as uuidv4 } from "uuid"
import rand from "random-seed"
import { isServerside } from "./isServerside"

let testMode = false
let seededRandom = rand.create(isServerside() ? "5678" : "1234")

const seeededRandomUUID = () => {
  const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
  let result = ""
  for (let i = 0; i < 10; i++) {
    result += chars[seededRandom.range(chars.length)]
  }
  return result
}

export const getUuid = () => (testMode ? seeededRandomUUID() : uuidv4())

export const setTestMode = (mode: boolean) => {
  seededRandom = rand.create("1234")
  testMode = mode
}

export const safeSetTestMode = async (
  mode: boolean,
  callback: () => Promise<any>
) => {
  try {
    setTestMode(mode)
    await callback()
  } finally {
    testMode = false
  }
}

export const isTestMode = () => testMode
