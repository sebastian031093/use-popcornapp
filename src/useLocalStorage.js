import { useState, useEffect } from 'react';

export function useLocalStorage(initialArrayState, key) {
  //Here you put your code....
  const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(key);
    console.log(storedValue);
    return storedValue ? JSON.parse(storedValue) : initialArrayState;
  });

  useEffect(
    function () {
      localStorage.setItem(key, JSON.stringify(value));
    },
    [value, key]
  );

  return [value, setValue];
}
