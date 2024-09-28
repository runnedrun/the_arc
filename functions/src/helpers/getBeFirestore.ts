import { App, initializeApp } from "firebase-admin/app"
import { getDatabase } from "firebase-admin/database"
import { initializeFirestore } from "firebase-admin/firestore"
import { getStorage } from "firebase-admin/storage"

let cachedApp = null as App

export const getBeApp = () => {
  // const projectIdObjForLocalScript = {
  //   databaseURL: `https://${getProjectId()}-default-rtdb.firebaseio.com`,
  // }
  cachedApp = cachedApp || initializeApp()

  return cachedApp
}
export const getBeFirestore = () => {
  const app = getBeApp()
  return initializeFirestore(app)
}

export const getBeStorage = () => {
  const app = getBeApp()
  return getStorage(app)
}

export const getBeRealtimeDb = () => {
  const app = getBeApp()
  return getDatabase(app)
}
