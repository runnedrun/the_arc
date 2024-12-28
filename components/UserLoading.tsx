import { UserContext } from "@/data/context/UserContext"
import { useContext } from "react"
import { Skeleton } from "./ui/skeleton"

export const UserLoading = ({
  children,
  allowNoUser = false,
  SkeletonComponent = Skeleton,
  className,
}: React.PropsWithChildren<{
  allowNoUser?: boolean
  SkeletonComponent?: React.ComponentType<any>
  className?: string
}>) => {
  const user = useContext(UserContext)
  const hasUser = allowNoUser || !!user.user
  return !user.loading && hasUser ? (
    <>{children}</>
  ) : (
    <SkeletonComponent className={className} />
  )
}
