import React, { useEffect, useState, useMemo } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import MovieFilters from '../components/movies/MovieFilters';
import MovieGrid from '../components/movies/MovieGrid';
import { MOVIE_CATALOG } from '../store/useUserStore';

const Movies = () => {
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedDirector, setSelectedDirector] = useState("All");
  const [sortBy, setSortBy] = useState("Popular");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Filter and sort movie catalog
  const filteredAndSortedMovies = useMemo(() => {
    let result = MOVIE_CATALOG.filter(movie => {
      const matchesGenre = selectedGenre === "All" || movie.genre.toLowerCase().includes(selectedGenre.toLowerCase());
      
      const matchesYear = selectedYear === "All" || 
        (selectedYear === "2024" && movie.year === "2024") ||
        (selectedYear === "2023" && movie.year === "2023") ||
        (selectedYear === "2010s" && parseInt(movie.year) >= 2010 && parseInt(movie.year) < 2020) ||
        (selectedYear === "2000s" && parseInt(movie.year) >= 2000 && parseInt(movie.year) < 2010) ||
        (selectedYear === "90s" && parseInt(movie.year) >= 1990 && parseInt(movie.year) < 2000) ||
        (selectedYear === "Classic" && parseInt(movie.year) < 1990);

      const matchesDirector = selectedDirector === "All" || movie.director === selectedDirector;

      const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            movie.director.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            movie.genre.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesGenre && matchesYear && matchesDirector && matchesSearch;
    });

    if (sortBy === "Rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "Year") {
      result.sort((a, b) => parseInt(b.year) - parseInt(a.year));
    } else if (sortBy === "Alpha") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [selectedGenre, selectedYear, selectedDirector, sortBy, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden font-sans">
      <Navbar />
      
      <main className="flex-1 w-full max-w-[1200px] mx-auto pb-16 px-4 md:px-8 pt-8">
        {/* Header Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">Explore Cinema</h1>
          <p className="text-sm md:text-base text-gray-400">Find movies by your mood, taste, or curiosity.</p>
        </div>

        <MovieFilters 
          selectedGenre={selectedGenre} 
          setSelectedGenre={setSelectedGenre}
          selectedYear={selectedYear} 
          setSelectedYear={setSelectedYear}
          selectedDirector={selectedDirector} 
          setSelectedDirector={setSelectedDirector}
          sortBy={sortBy} 
          setSortBy={setSortBy}
          totalCount={filteredAndSortedMovies.length}
        />
        
        <MovieGrid 
          movies={filteredAndSortedMovies} 
          filterQuery={searchQuery}
          setFilterQuery={setSearchQuery}
        />
      </main>

      <Footer />
    </div>
  );
};

export default Movies;
