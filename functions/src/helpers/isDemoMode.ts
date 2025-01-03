import { defineBoolean } from "firebase-functions/params"

const isDemoModeParam = defineBoolean("DEMO_MODE")

export const isDemoMode = () => {
  console.log("isDemoModePa", isDemoModeParam.value())
  return isDemoModeParam.value()
}
