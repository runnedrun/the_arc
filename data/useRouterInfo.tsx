import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import {
  usePathname,
  useRouter as next13UseRouter,
  useSearchParams,
} from "next/navigation"
import Router, { useRouter } from "next/router"

export type RouterInfo = {
  router: AppRouterInstance
  pathname: string
  searchParams: Record<string, string>
  searchParamString: string
}

export const useRouterInfoNext12: () => RouterInfo = () => {
  const router = useRouter()

  return {
    router: router as unknown as AppRouterInstance,
    pathname: Router.pathname,
    searchParams: Router.query,
    searchParamString: router.asPath.split("?")[1] || "",
  } as RouterInfo
}

export const useRouterInfoNext13: () => RouterInfo = () => {
  const router = next13UseRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  return {
    router: router as unknown as AppRouterInstance,
    pathname: pathname,
    searchParams: Object.fromEntries(searchParams),
    searchParamString: searchParams.toString(),
  } as RouterInfo
}
