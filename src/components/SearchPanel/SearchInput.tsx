import { useMemo } from 'react';
import { useSearchBox } from 'react-instantsearch';

interface SearchInputProps {
  externalQuery: string;
}

/**
 * Internal component that syncs external query changes to Algolia search.
 * Uses react-instantsearch's useSearchBox hook to trigger searches.
 */
export function SearchInput({ externalQuery }: SearchInputProps) {
  const { refine } = useSearchBox();

  useMemo(() => {
    refine(externalQuery);
  }, [externalQuery, refine]);

  return null;
}
