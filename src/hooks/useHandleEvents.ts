import { useEffect, useRef } from 'react';

export const useHandleEvents = (handleClick: (event: MouseEvent) => void) => {
  const ref = useRef(null);

  useEffect(() => {
    document.addEventListener('mousedown', handleClick);

    return () => document.removeEventListener('mousedown', handleClick);
    // Need not to render on handleClick func changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
};
