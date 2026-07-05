import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import MovieSection from '../components/MovieSection';
import ActorSection from '../components/ActorSection';
import FeatureSection from '../components/FeatureSection';
import Footer from '../components/Footer';

const trendingMovies = [
  { title: "Dune: Part Two", genre: "2024", image: "/images/poster_1.png" },
  { title: "Oppenheimer", genre: "2023", image: "/images/poster_2.png" },
  { title: "Poor Things", genre: "2023", image: "/images/poster_1.png" },
  { title: "The Holdovers", genre: "2023", image: "/images/poster_2.png" },
  { title: "Anatomy of a Fall", genre: "2023", image: "/images/poster_1.png" }
];

const classicMovies = [
  { title: "The Godfather", genre: "1972", image: "/images/poster_2.png" },
  { title: "Pulp Fiction", genre: "1994", image: "/images/poster_1.png" },
  { title: "2001: A Space Odyssey", genre: "1968", image: "/images/poster_2.png" },
  { title: "Blade Runner", genre: "1982", image: "/images/poster_1.png" },
  { title: "Citizen Kane", genre: "1941", image: "/images/poster_2.png" }
];

const starPower = [
  { name: "Timothée Chalamet", image: "/images/actor_1.png" },
  { name: "Zendaya", image: "/images/actor_1.png" },
  { name: "Austin Butler", image: "/images/actor_1.png" },
  { name: "Cillian Murphy", image: "/images/actor_1.png" },
  { name: "Emma Stone", image: "/images/actor_1.png" },
  { name: "Mark Ruffalo", image: "/images/actor_1.png" }
];

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

const Home = () => {
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
