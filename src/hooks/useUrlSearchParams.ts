'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

import { SearchParamsType } from '@/helpers/interface/url-search-params';

export function useUrlSearchParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getParam = useCallback(
    <T extends string | number | null>(param: string, defaultValue: T = null as T): T => {
      const value = searchParams.get(param);

      return value !== null ? (value as unknown as T) : defaultValue;
    },
    [searchParams],
  );

  const updateSearchParams = useCallback(
    (params: Partial<SearchParamsType>): void => {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '') {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      });

      const newUrl = `${pathname}?${newSearchParams.toString()}`;

      router.push(newUrl);
    },
    [searchParams, pathname, router],
  );

  const deleteSearchParams = useCallback(
    (paramsToDelete: string[]): void => {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      paramsToDelete.forEach((param) => {
        newSearchParams.delete(param);
      });

      const newUrl = pathname + (newSearchParams.toString() ? `?${newSearchParams.toString()}` : '');

      router.push(newUrl);
    },
    [searchParams, pathname, router],
  );

  return {
    searchParams,
    getParam,
    updateSearchParams,
    deleteSearchParams,
  };
}
