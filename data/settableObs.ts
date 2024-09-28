import { BehaviorSubject, Observable, of } from "rxjs"

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export const settableObs = <Name extends string, T extends unknown>(
  name: Name,
  initialValue: T
) => {
  type SetterAndValueObs = {
    [K in `set${Capitalize<Name>}`]: Observable<(value: T) => void>
  } & {
    [K in Name]: BehaviorSubject<T>
  }

  const subject = new BehaviorSubject<T>(initialValue)
  return {
    [`set${capitalizeFirstLetter(name)}`]: of(subject.next.bind(subject)),
    [name]: subject,
  } as SetterAndValueObs
}
