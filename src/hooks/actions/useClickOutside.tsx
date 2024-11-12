import { useEffect } from 'react';

export const useClickOutside = (ref: React.MutableRefObject<HTMLElement | null>, callback: () => void) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("mouseup", handleClickOutside);
    return () => document.removeEventListener("mouseup", handleClickOutside);
  }, [ref, callback]);
};