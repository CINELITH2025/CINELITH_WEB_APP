import React, { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/home/Hero';
import MovieSection from '../components/home/MovieSection';
import FeatureSection from '../components/home/FeatureSection';
import Footer from '../components/layout/Footer';
import useUserStore from '../store/useUserStore';

const Home = () => {
  const fetchHomeCatalog = useUserStore((state) => state.fetchHomeCatalog);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [classicMovies, setClassicMovies] = useState([]);

  useEffect(() => {
    fetchHomeCatalog()
      .then((data) => {
        setTrendingMovies(data.trending || []);
        setClassicMovies(data.classics || []);
      })
      .catch(() => {
        setTrendingMovies([]);
        setClassicMovies([]);
      });
  }, [fetchHomeCatalog]);

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
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
