import axios from "axios";
import { type Movie } from "../types/movie";

interface TmdbResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

const fetchMovies = async (query: string): Promise<TmdbResponse> => {
  const baseURL = "https://api.themoviedb.org/3/search/movie";
  const tmdbToken = import.meta.env.VITE_TMDB_TOKEN;
  const config = {
    params: { query: query },
    headers: { Authorization: `Bearer ${tmdbToken}` },
  };

  const response = await axios.get<TmdbResponse>(baseURL, config);
  return response.data;
};

export default fetchMovies;
