import { useEffect, useState } from 'react';

export default function useMediaQuery(view: string) {
  const [matches, setMatches] = useState(false);
  let query = '';

  if (view === 'mobile') {
    query = '(max-width: 430px)';
  } else {
    query = '(min-width: 431px)';
  }
  useEffect(() => {
    const media = window.matchMedia(query);

    setMatches(media.matches);
    const listener = () => setMatches(media.matches);

    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}
