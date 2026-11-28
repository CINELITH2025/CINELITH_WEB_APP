import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import MovieHero from '../components/movie/MovieHero';
import CastAndCrew from '../components/movie/CastAndCrew';
import Discussion from '../components/movie/Discussion';
import RelatedMovies from '../components/movie/RelatedMovies';
import useUserStore from '../store/useUserStore';

const MovieDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const isSeries = location.pathname.startsWith('/series/');
  const fetchCatalogMovie = useUserStore((state) => state.fetchCatalogMovie);
  const fetchCatalogSeries = useUserStore((state) => state.fetchCatalogSeries);
  const fetchMovieComments = useUserStore((state) => state.fetchMovieComments);
  const [movie, setMovie] = useState(null);
  const [loadedId, setLoadedId] = useState(null);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!id || id === "undefined" || id === "null") {
      return;
    }
    let cancelled = false;

    // Fetch verified title details from live catalog API
    (isSeries ? fetchCatalogSeries(id) : fetchCatalogMovie(id))
      .then((data) => {
        if (!cancelled && data) {
          setMovie(data);
          setError("");
          setLoadedId(id);
        } else if (!cancelled) {
          setError("Title could not be found in the catalog.");
          setLoadedId(id);
        }
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Movie fetch error:", err);
        setError("Unable to load movie details. Please try again later.");
        setLoadedId(id);
      });

    // Fetch genuine community reviews (starts empty if no reviews exist)
    (isSeries ? Promise.resolve([]) : fetchMovieComments(id))
      .then((liveComments) => {
        if (!cancelled) setComments(Array.isArray(liveComments) ? liveComments : []);
      })
      .catch(() => {
        if (!cancelled) setComments([]);
      });
    return () => { cancelled = true; };
  }, [id, isSeries, fetchCatalogMovie, fetchCatalogSeries, fetchMovieComments]);

  const invalidId = !id || id === "undefined" || id === "null";
  const visibleMovie = loadedId === id ? movie : null;
  const visibleError = invalidId
    ? "This title is not in the live catalog."
    : loadedId === id ? error : "";

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden font-sans">
      <Navbar />

      <main className="flex-1 w-full max-w-[1200px] mx-auto pb-16 px-4 md:px-8 pt-8">
        {visibleError && (
          <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl text-center max-w-md mx-auto my-12">
            <p className="text-red-400 text-sm font-semibold">{visibleError}</p>
          </div>
        )}
        {!visibleMovie && !visibleError && (
          <div className="p-12 text-center text-gray-500 text-sm font-semibold animate-pulse">
            Loading title details from live catalog...
          </div>
        )}
        {visibleMovie && (
          <>
            <MovieHero movie={visibleMovie} />
            <CastAndCrew cast={visibleMovie.cast || []} />
            {!isSeries && <Discussion
              comments={comments}
              movieId={visibleMovie.id}
              movieTitle={visibleMovie.title}
              onCommentsChange={setComments}
            />}
            <RelatedMovies movies={visibleMovie.related || []} />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MovieDetails;
