import {
  combineLatest,
  distinctUntilChanged,
  filter,
  isObservable,
  map,
  Observable,
  of,
  switchMap,
} from "rxjs"

import { AllModels } from "@/data/CollectionModels"
import { init } from "@/data/initFb"
import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  DocumentSnapshot,
  getDoc,
  onSnapshot,
  orderBy,
  OrderByDirection,
  Query,
  query,
  QueryConstraint,
  QueryFieldFilterConstraint,
  QueryOrderByConstraint,
  QuerySnapshot,
  SnapshotListenOptions,
  Timestamp,
  where,
  WhereFilterOp,
} from "@firebase/firestore"
import { isArray, isEqual, isNil, isNull } from "lodash-es"
import { ValuesType } from "utility-types"
import { isUndefined } from "lodash-es"

const DEFAULT_OPTIONS = { includeMetadataChanges: true }

export function queryObsFromFbRef(
  ref: CollectionReference | Query | DocumentReference,
  options: SnapshotListenOptions = DEFAULT_OPTIONS
): Observable<QuerySnapshot> {
  return new Observable((subscriber) => {
    const unsubscribe = onSnapshot(ref as CollectionReference, options, {
      next: subscriber.next.bind(subscriber),
      error: subscriber.error.bind(subscriber),
      complete: subscriber.complete.bind(subscriber),
    })
    return { unsubscribe }
  })
}

export function docObsFromFbRef(
  ref: CollectionReference | Query | DocumentReference,
  options: SnapshotListenOptions = DEFAULT_OPTIONS
): Observable<DocumentSnapshot> {
  return new Observable((subscriber) => {
    const unsubscribe = onSnapshot(ref as CollectionReference, options, {
      next: subscriber.next.bind(subscriber),
      error: subscriber.error.bind(subscriber),
      complete: subscriber.complete.bind(subscriber),
    })
    return { unsubscribe }
  })
}

export const readDoc = async <CollectionName extends keyof AllModels>(
  collectionName: CollectionName,
  id: string
): Promise<AllModels[CollectionName]> => {
  const db = init()
  const snap = await getDoc(doc(db, collectionName, id))
  return {
    ...snap.data(),
    uid: id,
  } as AllModels[CollectionName]
}

export const docObs = <CollectionName extends keyof AllModels>(
  collectionName: CollectionName,
  id: string | Observable<string>
) => {
  if (isNull(id)) {
    return of(null)
  }
  const db = init()
  let idObs = isObservable(id) ? id : of(id)

  const docSnapshotObs = idObs.pipe(
    switchMap((id) =>
      id ? docObsFromFbRef(doc(db, collectionName, id)) : of(null)
    )
  )

  let hasSeenDataFromServer = false
  return docSnapshotObs.pipe(
    map((snap: DocumentSnapshot) => {
      if (!snap) {
        return null
      }
      const isValidServerData =
        !snap.metadata.fromCache && !snap.metadata.hasPendingWrites

      hasSeenDataFromServer = hasSeenDataFromServer || isValidServerData

      if (!hasSeenDataFromServer) {
        return undefined
      }

      return {
        ...snap.data(),
        uid: snap.id,
      } as AllModels[CollectionName]
    }),
    filter((_) => !isUndefined(_)),
    distinctUntilChanged<AllModels[CollectionName]>(isEqual)
  )
}

type WhereValues = string | number | boolean | Timestamp | string[] | number[]

type FieldPathPathString = `${string}.${string}`

type TypedWhere<T extends ValuesType<AllModels>> = (
  fieldPath: keyof T,
  opStr: WhereFilterOp,
  value: WhereValues | Observable<WhereValues>
) => QueryFieldFilterConstraint | Observable<QueryFieldFilterConstraint>

type TypedOrderBy<T extends ValuesType<AllModels>> = (
  fieldPath: keyof T | FieldPathPathString,
  directionStr?: Observable<OrderByDirection> | OrderByDirection
) => QueryOrderByConstraint | Observable<QueryOrderByConstraint>

const mapQuerySnapshotToModel =
  <ModelType extends ValuesType<AllModels>>() =>
  (_: QuerySnapshot) => {
    return _.docs.map((docToMap) => {
      return { ...docToMap.data(), uid: docToMap.id } as ModelType
    })
  }

const handleWhereValue = (value: WhereValues, fieldPath: string) => {
  if (isUndefined(value)) {
    throw new Error("undefined value in where for path: " + fieldPath)
  }
  if (isArray(value)) {
    return value.length === 0 ? ["__never__"] : value
  } else {
    return value
  }
}

const whereWithObservable = (
  fieldPath: string,
  opsStr: WhereFilterOp,
  value: WhereValues | Observable<WhereValues>
) => {
  return isObservable(value)
    ? value.pipe(
        map((_) => where(fieldPath, opsStr, handleWhereValue(_, fieldPath)))
      )
    : where(fieldPath, opsStr, handleWhereValue(value, fieldPath))
}

const orderByWithObservable = (
  fieldPath: string,
  directionStr?: OrderByDirection | Observable<OrderByDirection>
) => {
  return isObservable(directionStr)
    ? directionStr.pipe(map((_) => (isNil(_) ? null : orderBy(fieldPath, _))))
    : isNil(directionStr)
      ? null
      : orderBy(fieldPath, directionStr)
}

export const queryObs = <CollectionName extends keyof AllModels>(
  collectionName: CollectionName,
  buildQuery: (queryFns: {
    where: TypedWhere<AllModels[CollectionName]>
    orderBy: TypedOrderBy<AllModels[CollectionName]>
  }) => (QueryConstraint | Observable<QueryConstraint>)[]
): Observable<AllModels[CollectionName][]> => {
  const db = init()
  const ref = collection(db, collectionName)
  const queryConstraintsOrObs = buildQuery({
    where: whereWithObservable as TypedWhere<AllModels[CollectionName]>,
    orderBy: orderByWithObservable as TypedOrderBy<AllModels[CollectionName]>,
  }).filter(Boolean)
  const queryConstraintsObs = queryConstraintsOrObs.map((_) =>
    isObservable(_) ? _ : of(_)
  )

  const orEmpty = queryConstraintsObs.length
    ? queryConstraintsObs
    : ([] as Observable<QueryConstraint>[])

  const resultsObs = combineLatest(orEmpty).pipe(
    switchMap((resolvedQueryContstraints) => {
      const finalQuery = query(
        ref,
        ...resolvedQueryContstraints.filter(Boolean)
      )
      const obs = queryObsFromFbRef(finalQuery)

      let hasSeenDataFromServer = false
      return obs.pipe(
        map((snapshot) => {
          const isValidServerData =
            !snapshot.metadata.fromCache && !snapshot.metadata.hasPendingWrites

          hasSeenDataFromServer = hasSeenDataFromServer || isValidServerData

          if (!hasSeenDataFromServer) {
            return null
          }

          return mapQuerySnapshotToModel<AllModels[CollectionName]>()(snapshot)
        }),
        filter(Boolean),
        distinctUntilChanged(isEqual)
      )
    })
  )
  return resultsObs
}
