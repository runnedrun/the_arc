import { getStorage } from "firebase-admin/storage"
import fetch from "node-fetch"
import path from "path"

export const uploadImageToStorage = async (
  imageUrl: string,
  gameId: string,
  filePath: string
): Promise<string> => {
  // Download image from URL
  const response = await fetch(imageUrl)
  const imageBuffer = await response.buffer()

  // Upload to Firebase Storage
  const storage = getStorage()
  const bucket = storage.bucket()
  const fileName = path.basename(filePath)
  const fileNameWithTimestamp = `${Date.now()}-${fileName}`
  const filePathWithTimestamp = filePath.replace(
    fileName,
    fileNameWithTimestamp
  )
  const fileLocation = path.join("games", gameId, filePathWithTimestamp)
  console.log("fileLocation", fileLocation)
  const fileRef = bucket.file(fileLocation)

  await fileRef.save(imageBuffer, {
    metadata: {
      contentType: "image/jpeg",
    },
  })

  // Get the public URL
  const [signedUrl] = await fileRef.getSignedUrl({
    action: "read",
    expires: "01-01-2100",
  })

  return signedUrl
}
