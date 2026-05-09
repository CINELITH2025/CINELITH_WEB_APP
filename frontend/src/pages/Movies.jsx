import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MovieFilters from '../components/movies/MovieFilters';
import MovieGrid from '../components/movies/MovieGrid';

const movieData = [
  { title: "The Midnight Bloom", year: "2023", genre: "Drama, Romance", image: "/images/poster_1.png" },
  { title: "Echoes of the Past", year: "2022", genre: "Thriller, Mystery", image: "/images/poster_2.png" },
  { title: "Crimson Horizon", year: "2024", genre: "Action, Adventure", image: "/images/poster_1.png" },
  { title: "Whispers of the Wind", year: "2023", genre: "Fantasy, Sci-Fi", image: "/images/poster_2.png" },
  { title: "Starlight Serenade", year: "2022", genre: "Musical, Romance", image: "/images/poster_1.png" },
  { title: "Shadows of Destiny", year: "2024", genre: "Crime, Drama", image: "/images/poster_2.png" },
  { title: "Emerald Enigma", year: "2023", genre: "Mystery, Thriller", image: "/images/poster_1.png" },
  { title: "Golden Legacy", year: "2022", genre: "Historical, Drama", image: "/images/poster_2.png" },
  { title: "Silver Lining", year: "2024", genre: "Romance, Comedy", image: "/images/poster_1.png" },
  { title: "Velvet Veil", year: "2023", genre: "Drama, Mystery", image: "/images/poster_2.png" },
  { title: "Azure Ascent", year: "2022", genre: "Sci-Fi, Adventure", image: "/images/poster_1.png" },
  { title: "Obsidian Echo", year: "2024", genre: "Thriller, Crime", image: "/images/poster_2.png" }
];

const Movies = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden font-sans">
      <Navbar />
      
      <main className="flex-1 w-full max-w-[1400px] mx-auto pb-16 px-4 md:px-8 pt-8">
        <MovieFilters />
        <MovieGrid movies={movieData} />
      </main>

      <Footer />
    </div>
  );
};

export default Movies;
