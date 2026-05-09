import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MovieHero from '../components/movie/MovieHero';
import MovieStats from '../components/movie/MovieStats';
import CastAndCrew from '../components/movie/CastAndCrew';
import Discussion from '../components/movie/Discussion';
import RelatedMovies from '../components/movie/RelatedMovies';
import { Award } from 'lucide-react';

const mockMovie = {
  title: "The Mystery Of Adventure Island",
  description: "A seasoned detective, Sarah Walker, haunted by a past case, finds herself entangled in a web of deceit and danger when a series of cryptic clues resurface, leading her on a relentless pursuit of a cunning criminal mastermind.",
  genre: "Drama, Mystery",
  runtime: "2h 15m",
  releaseDate: "November 15, 2023",
  awards: "3 Wins & 7 Nominations",
  image: "/images/poster_1.png",
  stats: {
    views: "4.5M",
    likes: "1.1M",
    shares: "50K"
  },
  cast: [
    { name: "Olivia Bennett", image: "/images/actor_1.png" },
    { name: "Ethan Carter", image: "/images/actor_1.png" },
    { name: "Daniel Hayes", image: "/images/actor_1.png" },
    { name: "Sophia Clark", image: "/images/actor_1.png" },
    { name: "James Foster", image: "/images/actor_1.png" }
  ],
  crew: {
    director: "Mark Thompson",
    writers: ["Laura Evans", "Mark Thompson"],
    producers: ["Robert Green", "Emily White"]
  },
  comments: [
    { 
      user: "Alex Turner", 
      time: "2 weeks ago", 
      text: "The plot twists kept me on the edge of my seat! Olivia Bennett's performance was outstanding.",
      likes: 12,
      dislikes: 2,
      avatar: "/images/actor_1.png"
    },
    { 
      user: "Chloe Davis", 
      time: "1 week ago", 
      text: "I agree! The cinematography was also top-notch, creating a truly immersive experience.",
      likes: 8,
      dislikes: 1,
      avatar: "/images/actor_1.png"
    }
  ],
  related: [
    { title: "Shadows of Doubt", image: "/images/poster_2.png" },
    { title: "The Silent Witness", image: "/images/poster_1.png" },
    { title: "Code Red", image: "/images/poster_2.png" },
    { title: "Twisted Fate", image: "/images/poster_1.png" },
    { title: "Crimson Tide", image: "/images/poster_2.png" }
  ]
};

const MovieDetails = () => {
  const { id } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden font-sans">
      <Navbar />
      
      <main className="flex-1 w-full max-w-[1200px] mx-auto pb-16 px-4 md:px-8 pt-8">
        <MovieHero movie={mockMovie} />
        <MovieStats stats={mockMovie.stats} />
        
        {/* Awards Small Row */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">Awards & Recognition</h2>
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-xl w-fit">
            <div className="p-3 bg-primary/20 rounded-lg">
              <Award className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-bold text-white">Best Thriller Film</p>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Nominee</p>
            </div>
          </div>
        </div>

        <CastAndCrew cast={mockMovie.cast} crew={mockMovie.crew} />
        <Discussion comments={mockMovie.comments} />
        <RelatedMovies movies={mockMovie.related} />
      </main>

      <Footer />
    </div>
  );
};

export default MovieDetails;
