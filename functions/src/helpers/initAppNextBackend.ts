import { cert, getApps, initializeApp } from "firebase-admin/app"

export const getFbPrivateKey = () => {
  return JSON.parse(process.env.FIREBASE_PRIVATE_KEY).privateKey
}

export const getBeAppNext = () => {
  // const projectIdObjForLocalScript = {
  // }
  //   databaseURL: `https://${getProjectId()}-default-rtdb.firebaseio.com`,

  const appCert = cert({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_CONFIG_PROJECT_ID,
    privateKey: getFbPrivateKey(),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  })

  const getAppProd = () => {
    return initializeApp({
      credential: appCert,
      storageBucket:
        process.env.NEXT_PUBLIC_FIREBASE_CLIENT_CONFIG_STORAGE_BUCKET,
    })
  }

  const getAppDemo = () => {
    return initializeApp({
      credential: appCert,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_CONFIG_PROJECT_ID,
      storageBucket:
        process.env.NEXT_PUBLIC_FIREBASE_CLIENT_CONFIG_STORAGE_BUCKET,
    })
  }

  const getFbApp = () => {
    return process.env.FIREBASE_AUTH_EMULATOR_HOST ? getAppDemo() : getAppProd()
  }

  const allApps = getApps()

  return allApps.length > 0 ? allApps[0] : getFbApp()
}
