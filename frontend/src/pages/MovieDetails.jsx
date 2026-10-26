import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import MovieHero from '../components/movie/MovieHero';
import CastAndCrew from '../components/movie/CastAndCrew';
import Discussion from '../components/movie/Discussion';
import RelatedMovies from '../components/movie/RelatedMovies';
import useUserStore from '../store/useUserStore';

const MovieDetails = () => {
  const { id } = useParams();
  const fetchCatalogMovie = useUserStore((state) => state.fetchCatalogMovie);
  const fetchMovieComments = useUserStore((state) => state.fetchMovieComments);
  const [movie, setMovie] = useState(null);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    setMovie(null);
    setError("");
    if (!id || id === "undefined" || id === "null") {
      setError("This title is not in the live catalog.");
      return;
    }
    fetchCatalogMovie(id)
      .then(setMovie)
      .catch(() => setError("This title is not in the live catalog."));
    fetchMovieComments(id)
      .then(setComments)
      .catch(() => setComments([]));
  }, [id, fetchCatalogMovie, fetchMovieComments]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden font-sans">
      <Navbar />

      <main className="flex-1 w-full max-w-[1200px] mx-auto pb-16 px-4 md:px-8 pt-8">
        {error && <p className="text-red-400 text-sm font-semibold">{error}</p>}
        {!movie && !error && <p className="text-gray-500 text-sm font-semibold">Loading title...</p>}
        {movie && (
          <>
            <MovieHero movie={movie} />
            <CastAndCrew cast={movie.cast || []} />
            <Discussion comments={comments} movieId={movie.id} movieTitle={movie.title} movieImage={movie.image} onCommentsChange={setComments} />
            <RelatedMovies movies={movie.related || []} />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MovieDetails;
