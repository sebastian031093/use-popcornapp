import { useEffect, useState } from 'react';
import StartRaiting from './StartRaiting';

//http://www.omdbapi.com/?i=tt3896198&apikey=95e6e2e9
//https://www.omdbapi.com/?s=Guardians+of+the+Galaxy&apikey=95e6e2e9
const average = arr =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = '95e6e2e9';

export default function App() {
  const [movies, setMovies] = useState([]);
  // const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('cars');
  const [error, setError] = useState('');

  const [selctedId, setSelectedId] = useState('');

  const [watched, setWatched] = useState(() => {
    const storedValue = localStorage.getItem('watched');
    return JSON.parse(storedValue);
  });

  // const tempQuery = 'Guardians+of+the+Galaxy';

  function handleSelecMovie(id) {
    setSelectedId(selectedId => (id === selectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(newMovie) {
    setWatched(watched => [...watched, newMovie]);

    //local storage
    // localStorage.setItem('wwatched', JSON.stringify([...watched, newMovie]));
  }

  function handleDeletedMovie(id) {
    // console.log(id);
    setWatched(watched => watched.filter(movie => movie.imdbID !== id));
  }

  useEffect(
    function () {
      localStorage.setItem('watched', JSON.stringify(watched));
    },
    [watched]
  );

  useEffect(() => {
    // fetch(`https://www.omdbapi.com/?s=Guardians+of+the+Galaxy&apikey=${KEY}`)
    //   .then(resp => resp.json())
    //   .then(data => /* console.log(data) */ setMovies(data.Search));
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
    fetchMovies();

    return function () {
      controller.abort();
    };

    // return () => console.log('Cleanup...');
  }, [query]);

  return (
    <>
      <NavBar /* movies={movies} */>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main /* movies={movies} */>
        <Box>
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelecMovie={handleSelecMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        {/* <Box element={<MovieList movies={movies} />} />
        <Box
          element={
            <>
              <WachedSumary watched={watched}></WachedSumary>
              <WachedMoviesList watched={watched}></WachedMoviesList>
            </>
          }
        /> */}

        <Box>
          {selctedId ? (
            <MovieDetails
              selctedId={selctedId}
              onCloseMovie={handleCloseMovie}
              onAddwatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WachedSumary watched={watched}></WachedSumary>
              <WachedMoviesList
                watched={watched}
                selctedId={selctedId}
                onDeletedMovie={handleDeletedMovie}
              ></WachedMoviesList>
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function Loader() {
  return <p className="loader">Loading... </p>;
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>💥💥</span>
      {message}
    </p>
  );
}

function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={e => setQuery(e.target.value)}
    />
  );
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen1, setIsOpen1] = useState(true);
  return (
    <div className="box">
      <Button isOpen={isOpen1} setIsOpen={setIsOpen1} />
      {isOpen1 && children}
    </div>
  );
}

// function WatchedBox() {
//   const [watched, setWatched] = useState(tempWatchedData);
//   const [isOpen2, setIsOpen2] = useState(true);

//   return (
//     <div className="box">
//       <Button isOpen={isOpen2} setIsOpen={setIsOpen2} />
//       {isOpen2 && (
//
//       )}
//     </div>
//   );
// }

function MovieList({ movies, onSelecMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map(movie => (
        <Movie movie={movie} key={movie.imdbID} onSelecMovie={onSelecMovie} />
      ))}
    </ul>
  );
}

function Movie({ movie, onSelecMovie }) {
  return (
    <li onClick={() => onSelecMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function MovieDetails({ selctedId, onCloseMovie, onAddwatched, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState();

  const isWathced = watched.map(movie => movie.imdbID).includes(selctedId);
  const watchedUserRating = watched.find(
    movie => movie.imdbID === selctedId
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  // console.log(title, year);
  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selctedId,
      title,
      year,
      poster,
      imdbRating: +imdbRating,
      runtime: runtime.split(' ').at(0),
      userRating: userRating,
    };

    onAddwatched(newWatchedMovie);
    onCloseMovie();
  }

  useEffect(
    function () {
      document.addEventListener('keydown', function (event) {
        if (event.code === 'Escape') {
          onCloseMovie();
          console.log('closing');
        }
      });

      return function () {
        document.removeEventListener('keydown', function (event) {
          if (event.code === 'Escape') {
            onCloseMovie();
            console.log('closing');
          }
        });
      };
    },
    [onCloseMovie]
  );

  useEffect(() => {
    async function getMovie() {
      setIsLoading(true);
      const resp = await fetch(
        `https://www.omdbapi.com/?i=${selctedId}&apikey=${KEY}`
      );

      const data = await resp.json();
      // console.log(data);
      setMovie(data);
      setIsLoading(false);
    }

    getMovie();
  }, [selctedId]);

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      return function () {
        document.title = 'use PopcornApp';
      };
    },
    [title]
  );

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${poster} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull;{runtime}{' '}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span> {imdbRating} ImdB rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {!isWathced ? (
                <>
                  <StartRaiting
                    maxRating={10}
                    size={24}
                    onNumStarts={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      Add movie
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You rated with movie {watchedUserRating} <span>🌟</span>
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

function WachedSumary({ watched }) {
  const avgImdbRating = average(watched.map(movie => movie.imdbRating));
  const avgUserRating = average(watched.map(movie => movie.userRating));
  const avgRuntime = average(watched.map(movie => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(2)} min</span>
        </p>
      </div>
    </div>
  );
}

function WachedMoviesList({ watched, onDeletedMovie }) {
  return (
    <ul className="list">
      {watched.map(movie => (
        <WatchedMovie
          key={movie.imdbID}
          movie={movie}
          onDeletedMovie={onDeletedMovie}
        ></WatchedMovie>
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, onDeletedMovie }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button
          className="btn-delete"
          onClick={() => onDeletedMovie(movie.imdbID)}
        >
          X
        </button>
      </div>
    </li>
  );
}

function Button({ isOpen, setIsOpen }) {
  return (
    <button className="btn-toggle" onClick={() => setIsOpen(open => !open)}>
      {isOpen ? '–' : '+'}
    </button>
  );
}
