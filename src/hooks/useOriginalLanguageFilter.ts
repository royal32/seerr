import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

export type OriginalLanguageFilter = 'en' | 'all';

const ORIGINAL_LANGUAGE_FILTER_STORAGE_KEY = 'seerr.originalLanguageFilter';
const ORIGINAL_LANGUAGE_FILTER_CHANGE_EVENT =
  'seerr.originalLanguageFilter.change';

const getOriginalLanguageFilterFromQuery = (
  value: string | string[] | undefined
): OriginalLanguageFilter | undefined => {
  if (value === 'all' || value === 'en') {
    return value;
  }

  return undefined;
};

const getStoredOriginalLanguageFilter = (): OriginalLanguageFilter => {
  if (typeof window === 'undefined') {
    return 'en';
  }

  return window.sessionStorage.getItem(ORIGINAL_LANGUAGE_FILTER_STORAGE_KEY) ===
    'all'
    ? 'all'
    : 'en';
};

const storeOriginalLanguageFilter = (
  filter: OriginalLanguageFilter,
  notify = false
) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.setItem(ORIGINAL_LANGUAGE_FILTER_STORAGE_KEY, filter);

  if (notify) {
    window.dispatchEvent(
      new CustomEvent(ORIGINAL_LANGUAGE_FILTER_CHANGE_EVENT, {
        detail: filter,
      })
    );
  }
};

const useOriginalLanguageFilter = () => {
  const router = useRouter();
  const [originalLanguageFilter, setOriginalLanguageFilterState] =
    useState<OriginalLanguageFilter>(
      () =>
        getOriginalLanguageFilterFromQuery(router.query.originalLanguage) ??
        'en'
    );

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    const queryFilter = getOriginalLanguageFilterFromQuery(
      router.query.originalLanguage
    );

    if (queryFilter) {
      storeOriginalLanguageFilter(queryFilter);
      setOriginalLanguageFilterState(queryFilter);
      return;
    }

    setOriginalLanguageFilterState(getStoredOriginalLanguageFilter());
  }, [router.isReady, router.query.originalLanguage]);

  useEffect(() => {
    const handleOriginalLanguageFilterChange = (event: Event) => {
      const filter = (event as CustomEvent<OriginalLanguageFilter>).detail;

      if (filter === 'all' || filter === 'en') {
        setOriginalLanguageFilterState(filter);
      }
    };

    window.addEventListener(
      ORIGINAL_LANGUAGE_FILTER_CHANGE_EVENT,
      handleOriginalLanguageFilterChange
    );

    return () => {
      window.removeEventListener(
        ORIGINAL_LANGUAGE_FILTER_CHANGE_EVENT,
        handleOriginalLanguageFilterChange
      );
    };
  }, []);

  const setOriginalLanguageFilter = useCallback(
    (filter: OriginalLanguageFilter) => {
      storeOriginalLanguageFilter(filter, true);
      setOriginalLanguageFilterState(filter);
    },
    []
  );

  return {
    originalLanguageFilter,
    setOriginalLanguageFilter,
  };
};

export default useOriginalLanguageFilter;
