'use client';
import { AppRouterInstance, NavigateOptions } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter as useNextRouter, usePathname } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import * as NProgress from 'nprogress';

/**
 * Custom useRouter hook to work with NextTopLoader
 * Compatible with app router only.
 * Solution Provided by @sho-pb
 * @returns {AppRouterInstance}
 */
export const useRouter = (): AppRouterInstance => {
  const router = useNextRouter();
  const pathname = usePathname();
  useEffect(() => {
    NProgress.done();
  }, [pathname]);
  const replace = useCallback(
    (href: string, options?: NavigateOptions) => {
      href !== pathname && NProgress.start();
      router.replace(href, options);
    },
    [router, pathname]
  );

  const push = useCallback(
    (href: string, options?: NavigateOptions) => {
      href !== pathname && NProgress.start();
      router.push(href, options);
    },
    [router, pathname]
  );

  return {
    ...router,
    replace,
    push,
  };
};
