const collectionNameEventPrefix = "process-"
export const getEventNameForCollection = (collectionName: string) =>
  `${collectionNameEventPrefix}-${collectionName}`
