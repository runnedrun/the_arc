import { Skeleton } from "./ui/skeleton"
import { isUndefined } from "lodash"

export const LoadingComponent = ({
  children,
  SkeletonComponent = Skeleton,
  className,
  isLoading,
}: React.PropsWithChildren<{
  isLoading: any
  SkeletonComponent?: React.ComponentType<any>
  className?: string
}>) => {
  return isLoading ? (
    <SkeletonComponent className={className} />
  ) : (
    <>{children}</>
  )
}
