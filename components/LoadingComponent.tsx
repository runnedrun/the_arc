import { Skeleton } from "./ui/skeleton"

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
