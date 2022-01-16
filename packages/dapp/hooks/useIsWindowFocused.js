import debounce from 'lodash.debounce';
import { useCallback, useState, useEffect } from 'react';

const useIsWindowFocused = () => {
  const [windowIsActive, setWindowIsActive] = useState(true);

  const handleActivity = useCallback(
    debounce(
      (e) => {
        if (e?.type == 'focus') {
          return setWindowIsActive(true);
        }
        if (e?.type == 'blur') {
          return setWindowIsActive(false);
        }
        if (e?.type == 'visibilitychange') {
          if (document.hidden) {
            return setWindowIsActive(false);
          } else {
            return setWindowIsActive(true);
          }
        }
      },
      100,
      { leading: false }
    ),
    []
  );

  useEffect(() => {
    window.addEventListener('blur', handleActivity);
    document.addEventListener('blur', handleActivity);
    window.addEventListener('focus', handleActivity);
    document.addEventListener('focus', handleActivity);
    document.addEventListener('visibilitychange', handleActivity);

    return () => {
      window.removeEventListener('blur', handleActivity);
      document.removeEventListener('blur', handleActivity);
      window.removeEventListener('focus', handleActivity);
      document.removeEventListener('focus', handleActivity);
      document.removeEventListener('visibilitychange', handleActivity);
    };
  }, []);

  return windowIsActive;
};

export default useIsWindowFocused;
