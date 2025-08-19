import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import fetchMovies from "../../services/movieService";
import SearchBar from "../SearchBar/SearchBar";
import Loader from "../Loader/Loader";
import { type Movie } from "../../types/movie";
import MovieGrid from "../MovieGrid/MovieGrid";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import css from "./App.module.css";

const App = () => {
  //=== States ===
  const [query, setQuery] = useState<string>("");
  const [clickedMovie, setClickedMovie] = useState<Movie | null>(null);
  const [page, setPage] = useState<number>(1);

  //=== Handlers ===
  const handleSearch = (searchTerm: string) => {
    setQuery(searchTerm);
  };

  //=== Hooks ===
  const { data, isLoading, isError } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: !!query,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (data && data.results.length === 0) {
      toast.error("No movies found for your request");
    }
  });

  const totalPages = data?.total_pages ?? 0; // condition check: if data is null or und, use 0

  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      <Toaster position="top-center" reverseOrder={false} />

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {!isError && data && data.results.length !== 0 && (
        <MovieGrid movies={data.results} onSelect={setClickedMovie} />
      )}

      {clickedMovie && (
        <MovieModal
          movie={clickedMovie}
          onClose={() => setClickedMovie(null)}
        />
      )}
      {totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
    </>
  );
};

export default App;
