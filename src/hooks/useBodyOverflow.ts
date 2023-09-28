import {useEffect} from 'react';

export function useBodyOverflow(shouldLock: boolean): void {
  useEffect(() => {
    document.body.style.overflow = shouldLock ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [shouldLock]);
}
