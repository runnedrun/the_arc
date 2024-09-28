import { getAuth } from "@firebase/auth"
import {
  collection,
  doc,
  DocumentReference,
  PartialWithFieldValue,
  setDoc,
  Timestamp,
  WriteBatch,
} from "@firebase/firestore"
import { isUndefined } from "lodash-es"
import { CollectionModels, CollectionNames } from "./CollectionModels"
import { init } from "./initFb"

const refFunctions = {} as {
  [key in keyof CollectionModels]: (id?: string) => DocumentReference
}

type SetOptions = {
  overwrite: boolean
}

const setterFunctions = {} as {
  [key in keyof CollectionModels]: (
    id: string,
    newData: PartialWithFieldValue<CollectionModels[key]>,
    setOptions?: SetOptions
  ) => Promise<DocumentReference>
}

const batchSetterFunctions = {} as {
  [key in keyof CollectionModels]: (
    batch: WriteBatch,
    id: string,
    newData: Partial<CollectionModels[key]>
  ) => WriteBatch
}

const archiveFunctions = {} as {
  [key in keyof CollectionModels]: (id: string) => Promise<DocumentReference>
}

export type CreateOptions = {
  id?: string
}
type CreatorFunction<Key extends keyof CollectionModels> = (
  newData: Omit<CollectionModels[Key], "uid">,
  opts?: CreateOptions
) => Promise<DocumentReference<CollectionModels[Key]>>

const creatorFunctions = {} as {
  [key in keyof CollectionModels]: CreatorFunction<key>
}

const loadAuthSoPermissionsWork = () => {
  // for some reason we need to getAuth() before writing, otherwise the user doesn't get sent.
  // probably can remove this later.
  getAuth()
}

CollectionNames.forEach(
  <CollectionName extends keyof CollectionModels>(
    collectionName: CollectionName
  ) => {
    const refFunction = (docId?: string) => {
      const firestore = init()

      const collectionRef = collection(firestore, collectionName)

      const newOrExistingDoc = docId
        ? doc(collectionRef, docId)
        : doc(collectionRef)

      return newOrExistingDoc
    }

    const cleanObjectForWrite = (object: object) => {
      const objClone = { ...object }
      const keys = Object.keys(objClone) as (keyof typeof objClone)[]
      delete objClone["hydrated"]
      return keys
        .filter((key) => {
          const value = objClone[key]
          return typeof value !== "undefined" && key !== "uid"
        })
        .reduce(
          (builder, key) => {
            builder[key] = objClone[key]
            return builder
          },
          {} as typeof objClone
        )
    }

    refFunctions[collectionName] = refFunction

    const prepDataForSet = (newData: object) => {
      const undefFiltered = cleanObjectForWrite(newData)
      delete undefFiltered["hydrated"]
      delete undefFiltered["uid"]

      const withUpdatedAt = {
        ...undefFiltered,
        updatedAt: Timestamp.now(),
      }
      return withUpdatedAt
    }

    setterFunctions[collectionName] = async (
      docId: string,
      newData: object,
      options?: SetOptions
    ) => {
      loadAuthSoPermissionsWork()
      const withUpdatedAt = prepDataForSet(newData)

      await setDoc(refFunction(docId) as DocumentReference, withUpdatedAt, {
        merge: isUndefined(options?.overwrite) ? true : !options?.overwrite,
      })
      return refFunction(docId)
    }

    batchSetterFunctions[collectionName] = (batch, id, newData: object) => {
      loadAuthSoPermissionsWork()
      return batch.set(refFunction(id), prepDataForSet(newData), {
        merge: true,
      })
    }

    archiveFunctions[collectionName] = (id: string) => {
      const setter = setterFunctions[collectionName] as (
        ...args
      ) => Promise<DocumentReference<object>>

      return setter(id, {
        archived: true,
        archivedOn: Timestamp.now(),
      })
    }

    const creatorFunction = (initData: object, opts: CreateOptions = {}) => {
      loadAuthSoPermissionsWork()
      const undefFiltered = cleanObjectForWrite(initData)
      const withArchivedFalse = {
        ...undefFiltered,
        archived: false,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      }
      const ref = opts.id ? refFunction(opts.id) : refFunction()
      return setDoc(ref, withArchivedFalse, {
        merge: true,
      }).then(() => ref)
    }

    creatorFunctions[collectionName] =
      creatorFunction as (typeof creatorFunctions)[CollectionName]
  }
)

export const fb = refFunctions
export const setters = setterFunctions
export const creators = creatorFunctions
export const archiveDoc = archiveFunctions
export const batchSetters = batchSetterFunctions
