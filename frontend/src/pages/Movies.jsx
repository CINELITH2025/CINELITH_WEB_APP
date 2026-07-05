import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MovieFilters from '../components/movies/MovieFilters';
import MovieGrid from '../components/movies/MovieGrid';

const movieData = [
  { title: "Dune", year: "2021", genre: "Sci-Fi, Adventure", rating: 8.0, image: "/images/poster_1.png" },
  { title: "The Creator", year: "2023", genre: "Sci-Fi, Action", rating: 7.1, image: "/images/poster_2.png" },
  { title: "Oppenheimer", year: "2023", genre: "Drama, History", rating: 8.1, image: "/images/poster_1.png" },
  { title: "The Dark Knight", year: "2008", genre: "Action, Crime", rating: 8.5, image: "/images/poster_2.png" },
  { title: "Blade Runner 2049", year: "2017", genre: "Sci-Fi, Thriller", rating: 7.9, image: "/images/poster_1.png" }
];

const Movies = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden font-sans">
      <Navbar />
      
      <main className="flex-1 w-full max-w-[1200px] mx-auto pb-16 px-4 md:px-8 pt-8">
        {/* Header Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">Explore Cinema</h1>
          <p className="text-sm md:text-base text-gray-400">Find movies by your mood, taste, or curiosity.</p>
        </div>

        <MovieFilters />
        <MovieGrid movies={movieData} />
      </main>

      <Footer />
    </div>
  );
};

export default Movies;
