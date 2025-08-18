import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import fetchMovies from "../../services/movieService";
import SearchBar from "../SearchBar/SearchBar";
import Loader from "../Loader/Loader";
import { type Movie } from "../../types/movie";
import MovieGrid from "../MovieGrid/MovieGrid";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

const App = () => {
  //=== States ===
  const [query, setQuery] = useState<string>("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loader, setLoader] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [clickedMovie, setClickedMovie] = useState<Movie | null>(null);

  //=== Handlers ===
  const handleSearch = (searchTerm: string) => {
    setQuery(searchTerm);
  };

  //=== Effects ===
  useEffect(() => {
    // First mount blank query check
    if (!query) {
      return;
    }

    const getMovies = async (): Promise<void> => {
      try {
        setLoader(true);
        setError(false);

        const resultData = await fetchMovies(query);
        // Check if the resut is an empty array
        if (resultData.results.length === 0) {
          toast.error("No movies found for your request");
          return;
        }
        setMovies(resultData.results);
      } catch {
        setError(true);
      } finally {
        setLoader(false);
      }
    };

    getMovies();

    //Search result cleanup before performing the next one.
    return () => {
      setMovies([]);
    };
  }, [query]);

  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      <Toaster position="top-center" reverseOrder={false} />
      {loader && <Loader />}
      {error && <ErrorMessage />}
      {!error && movies.length !== 0 && (
        <MovieGrid movies={movies} onSelect={setClickedMovie} />
      )}

      {clickedMovie && (
        <MovieModal
          movie={clickedMovie}
          onClose={() => setClickedMovie(null)}
        />
      )}
    </>
  );
};

export default App;
