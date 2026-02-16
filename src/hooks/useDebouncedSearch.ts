import { useEffect, useState } from 'react';

export const useDebouncedSearch = (value: string, delay: number) => {
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedQuery;
};
