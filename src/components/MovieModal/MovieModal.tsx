import { useEffect } from "react";
import { createPortal } from "react-dom";
import css from "./MovieModal.module.css";
import { type Movie } from "../../types/movie";

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

const modalRoot = document.getElementById("modal-root") as HTMLElement;

const MovieModal = ({ movie, onClose }: MovieModalProps) => {
  // Escape closure handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  // Add temp class to prevent backdrop scrolling
  useEffect(() => {
    document.body.classList.add(css.noScroll);
    return () => {
      document.body.classList.remove(css.noScroll);
    };
  });

  return createPortal(
    <div
      onClick={onClose}
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
    >
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className={css.closeButton}
          aria-label="Close modal"
        >
          &times;
        </button>
        <img
          src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
          alt={movie.title}
          className={css.image}
        />
        <div className={css.content}>
          <h2>{movie.title}</h2>
          <p>{movie.overview}</p>
          <p>
            <strong>Release Date:</strong> {movie.release_date}
          </p>
          <p>
            <strong>Rating:</strong> {movie.vote_average}/10
          </p>
        </div>
      </div>
    </div>,
    modalRoot
  );
};

export default MovieModal;
