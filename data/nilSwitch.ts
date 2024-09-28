import { isNil } from "lodash-es"
import { Observable, switchMap } from "rxjs"

export const nilSwitch = <T extends any, InputType extends any>(
  valueToReturnIfNil: (value: InputType) => Observable<T>,
  valueToReturnIfNotNil: (value: InputType) => Observable<T>
) => {
  return (source: Observable<InputType>): Observable<T> => {
    return source.pipe(
      switchMap((value) =>
        isNil(value) ? valueToReturnIfNil(value) : valueToReturnIfNotNil(value)
      )
    )
  }
}
