import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import MovieSection from '../components/MovieSection';
import ActorSection from '../components/ActorSection';
import FeatureSection from '../components/FeatureSection';
import Footer from '../components/Footer';

const trendingMovies = [
  { title: "The Crimson Tide", genre: "Action, Adventure", image: "/images/poster_1.png" },
  { title: "Echoes of Tomorrow", genre: "Sci-Fi, Thriller", image: "/images/poster_2.png" },
  { title: "Starlight Serenade", genre: "Romance, Drama", image: "/images/poster_1.png" },
  { title: "Whispers of the Past", genre: "Mystery, Historical", image: "/images/poster_2.png" }
];

const classicMovies = [
  { title: "The Golden Age", genre: "Drama, Romance", image: "/images/poster_2.png" },
  { title: "Eternal Echoes", genre: "Adventure, Historical", image: "/images/poster_1.png" },
  { title: "Starlight Serenade", genre: "Musical, Romance", image: "/images/poster_2.png" },
  { title: "Whispers of the Past", genre: "Mystery, Thriller", image: "/images/poster_1.png" }
];

const starPower = [
  { name: "Ethan Blake", image: "/images/actor_1.png" },
  { name: "Olivia Hayes", image: "/images/actor_1.png" },
  { name: "Caleb Reed", image: "/images/actor_1.png" },
  { name: "Sophia Grant", image: "/images/actor_1.png" },
  { name: "Liam Carter", image: "/images/actor_1.png" }
];

const platformFeatures = [
  { title: "Play Movie & Actor Quiz", buttonText: "Start Quiz", image: "/images/feature_bg.png" },
  { title: "Daily Trivia", buttonText: "Submit", image: "/images/hero_bg.png" }
];

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden font-sans">
      <Navbar />
      
      <main className="flex-1 w-full max-w-[1600px] mx-auto pb-16">
        <Hero />
        
        <div className="flex flex-col gap-12 mt-12">
          <MovieSection title="Now Trending" movies={trendingMovies} />
          <ActorSection title="Star Power" actors={starPower} />
          <MovieSection title="Timeless Classics" movies={classicMovies} />
          <FeatureSection title="Platform Features" features={platformFeatures} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
