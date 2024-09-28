import { connectAuthEmulator, getAuth } from "@firebase/auth"
import { connectStorageEmulator, getStorage } from "@firebase/storage"
import { getApp as fbGetApp, initializeApp } from "@firebase/app"
import {
  connectFirestoreEmulator,
  getFirestore,
  initializeFirestore,
} from "@firebase/firestore"

import { connectDatabaseEmulator, getDatabase } from "@firebase/database"

const getApp = (name?: string) => {
  let app = null
  try {
    app = fbGetApp(name)
  } catch (e) {
    // this is expected the first time the app loads
  }
  return app
}

export const init = () => {
  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE

  if (getApp()) return getFirestore()

  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_CONFIG_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_CONFIG_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_CONFIG_PROJECT_ID,
    storageBucket:
      process.env.NEXT_PUBLIC_FIREBASE_CLIENT_CONFIG_STORAGE_BUCKET,
    messagingSenderId:
      process.env.NEXT_PUBLIC_FIREBASE_CLIENT_CONFIG_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_CONFIG_APP_ID,
    measurementId:
      process.env.NEXT_PUBLIC_FIREBASE_CLIENT_CONFIG_MEASUREMENT_ID,
  }

  const app = initializeApp(config)

  const db = initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true,
  })

  const storage = getStorage(app)

  const realTimeDb = getDatabase(app)

  demoMode && connectFirestoreEmulator(db, "localhost", 8071)
  demoMode && connectStorageEmulator(storage, "localhost", 9189)
  demoMode &&
    connectAuthEmulator(getAuth(), "http://localhost:9089", {
      disableWarnings: true,
    })
  demoMode && connectDatabaseEmulator(realTimeDb, "127.0.0.1", 9000)

  return db
}

export const initFb = init
