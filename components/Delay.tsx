import { PropsWithChildren, useEffect, useState } from "react"

export const Delay = ({
  waitTime,
  children,
}: PropsWithChildren<{ waitTime: number }>) => {
  const [waitComplete, setWaitComplete] = useState(false)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setWaitComplete(true)
    }, waitTime)

    return () => clearTimeout(timeout)
  })

  return waitComplete ? <div>{children}</div> : <div></div>
}
