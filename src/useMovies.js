import { useEffect, useState } from 'react';
const KEY = '95e6e2e9';
export function useMovies(query, callback) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // fetch(`https://www.omdbapi.com/?s=Guardians+of+the+Galaxy&apikey=${KEY}`)
    //   .then(resp => resp.json())
    //   .then(data => /* console.log(data) */ setMovies(data.Search));
    callback?.();
    const controller = new AbortController();
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        setError('');
        const resp = await fetch(
          `https://www.omdbapi.com/?s=${query}&apikey=${KEY}`,
          { signal: controller.signal }
        );

        if (!resp.ok)
          throw new Error('Something went wrogn whit fetching movies.');

        const data = await resp.json();

        if (data.Response === 'False') throw new Error(data.Error);
        // console.log(data.Search);
        setMovies(data.Search);
        setError('');
      } catch (error) {
        console.log(error.message);

        if (error.name !== 'AbortError') {
          setError(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (query.length < 3) {
      setMovies([]);
      setError('');
      return;
    }

    // handleCloseMovie();

    fetchMovies();

    return function () {
      controller.abort();
    };

    // return () => console.log('Cleanup...');
  }, [query]);

  return { movies, isLoading, error };
}
