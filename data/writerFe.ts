import { ModelBase } from "@/data/baseTypes/Model"
import { AllModels, CollectionModels } from "@/data/CollectionModels"
import { CreateOptions } from "@/functions/src/helpers/writer"
import batchPromises from "batch-promises"
import {
  PartialWithFieldValue,
  Timestamp,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore"
import { chunk } from "lodash-es"

export const genExtraData = () => {
  return {
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    archived: false,
  }
}

export const backendNow = () => Timestamp.now()

export const fbSet = async <CollectionName extends keyof AllModels>(
  collectionName: CollectionName,
  docId: string,
  data: PartialWithFieldValue<AllModels[CollectionName]>
) => {
  const firestore = getFirestore()

  await setDoc(
    doc(firestore, collectionName, docId),
    {
      updatedAt: Timestamp.now(),
      ...data,
    },
    { merge: true }
  )

  return doc(firestore, collectionName, docId)
}

export const fbDelete = async <CollectionName extends keyof AllModels>(
  collectionName: CollectionName,
  docId: string
) => {
  const firestore = getFirestore()

  await deleteDoc(doc(firestore, collectionName, docId))
}

export const fbUpdate = async <CollectionName extends keyof AllModels>(
  collectionName: CollectionName,
  docId: string,
  data: Partial<AllModels[CollectionName]>
) => {
  const firestore = getFirestore()

  await updateDoc(doc(firestore, collectionName, docId), {
    updatedAt: Timestamp.now(),
    ...data,
  })

  return doc(firestore, collectionName, docId)
}

export const fbCreate = async <Key extends keyof CollectionModels>(
  collectionName: Key,
  data: Omit<AllModels[Key], keyof ModelBase>,
  opts?: CreateOptions
) => {
  const firestore = getFirestore()
  const ref = opts?.id
    ? doc(firestore, collectionName, opts.id)
    : doc(collection(firestore, collectionName))
  await setDoc(
    ref,
    {
      ...genExtraData(),
      ...data,
    },
    { merge: true }
  )
  return ref
}

export const fbBatchSet = async <CollectionName extends keyof AllModels>(
  collectionName: CollectionName,
  records: AllModels[CollectionName][],
  getDocKey?: (record: AllModels[CollectionName], i: number) => string,
  batchSize: number = 100
) => {
  const firestore = getFirestore()
  const chunked = chunk(records, batchSize)
  const entries = Array.from(chunked.entries())

  return batchPromises(
    5,
    entries,
    async ([batchIndex, sentenceBatch]: [
      number,
      AllModels[CollectionName][],
    ]) => {
      const writer = writeBatch(firestore)
      sentenceBatch.forEach((record, sentenceIndex) => {
        const recordToWrite = {
          ...record,
          ...genExtraData(),
        } as AllModels[CollectionName]

        const recordRef = getDocKey
          ? doc(
              firestore,
              collectionName,
              getDocKey(record, sentenceIndex + batchIndex * batchSize)
            )
          : doc(collection(firestore, collectionName))

        writer.set(recordRef, recordToWrite, { merge: true })
      })
      return writer.commit()
    }
  )
}

export const fbBatchDelete = async <CollectionName extends keyof AllModels>(
  collectionName: CollectionName,
  recordIds: string[],
  batchSize: number = 100
) => {
  const firestore = getFirestore()
  const chunked = chunk(recordIds, batchSize)
  const entries = Array.from(chunked.entries())

  return batchPromises(
    5,
    entries,
    async ([, sentenceBatch]: [number, string[]]) => {
      const writer = writeBatch(firestore)
      sentenceBatch.forEach((recordId) => {
        const recordRef = doc(firestore, collectionName, recordId)

        writer.delete(recordRef)
      })

      return writer.commit()
    }
  )
}
