export const isEmptyObj = (obj: object) =>
  !Object.values(obj).filter((_) => _).length