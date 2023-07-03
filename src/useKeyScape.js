import { useEffect } from 'react';

export function useKeyScape(key, callback) {
  //your code here.....

  useEffect(
    function () {
      //TODO: create a callback for events

      document.addEventListener('keydown', function (event) {
        if (event.code === key) {
          callback();
          console.log('closing');
        }
      });

      return function () {
        document.removeEventListener('keydown', function (event) {
          if (event.code === key) {
            callback();
            console.log('closing');
          }
        });
      };
    },
    [key, callback]
  );
}
