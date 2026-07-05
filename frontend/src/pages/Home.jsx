import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import MovieSection from '../components/MovieSection';
import ActorSection from '../components/ActorSection';
import FeatureSection from '../components/FeatureSection';
import Footer from '../components/Footer';
import { MOVIE_CATALOG, ACTOR_CATALOG } from '../store/useUserStore';

const Home = () => {
  // Dynamically slice trending, classic movies and popular actors from central catalog
  const trendingMovies = MOVIE_CATALOG.slice(0, 5);
  const classicMovies = MOVIE_CATALOG.filter(m => parseInt(m.year, 10) < 2000).slice(0, 5);
  const starPower = ACTOR_CATALOG.slice(0, 6);

  const platformFeatures = [
    { 
      title: "Community Discussions", 
      buttonText: "Join conversations, share reviews, and debate theories with a passionate community.",
      image: "community" 
    },
    { 
      title: "Film Quizzes", 
      buttonText: "Test your cinematic knowledge with trivia on everything from silent films to modern blockbusters.",
      image: "quiz" 
    },
    { 
      title: "Movie Battles", 
      buttonText: "Pit your favorite films against each other and vote to see which ones come out on top.",
      image: "battle" 
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden font-sans">
      <Navbar />
      
      <main className="flex-1 w-full max-w-[1400px] mx-auto pb-16 px-4 md:px-8">
        <Hero />
        
        <div className="flex flex-col gap-8 mt-4">
          <MovieSection title="Trending Now" movies={trendingMovies} />
          <MovieSection title="Timeless Classics" movies={classicMovies} />
          <FeatureSection title="More Than Just Movies" features={platformFeatures} />
          <ActorSection title="Trending Actors" actors={starPower} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
