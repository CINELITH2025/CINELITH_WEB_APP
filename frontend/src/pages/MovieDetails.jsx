import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MovieHero from '../components/movie/MovieHero';
import CastAndCrew from '../components/movie/CastAndCrew';
import Discussion from '../components/movie/Discussion';
import RelatedMovies from '../components/movie/RelatedMovies';

const mockMovie = {
  title: "Movie Title",
  year: "2023",
  pgRating: "PG-13",
  clScore: 88,
  userScore: 92,
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod malesuada. Nullam ac erat ante. Pellentesque eget urna at lectus gravida ultricies. Phasellus quis justo sem. Duis non erat id nisl vestibulum finibus. Nulla facilisi. Sed ac lorem feugiat, scelerisque sem et, varius nibh. Suspendisse potenti. In hac habitasse platea dictumst. Curabitur et libero lacus. Nunc at elit nec est laoreet posuere. Morbi non quam nec dui commodo tincidunt.",
  genre: "Action, Sci-Fi, Adventure",
  runtime: "2h 28m",
  releaseDate: "October 26, 2023",
  awards: "Winner of 4 Academy Awards",
  image: "/images/poster_1.png",
  director: "Jane Doe",
  writer: "John Smith, Emily Rogers",
  cast: [
    { name: "Actor Name", role: "Character Role", image: "/images/actor_1.png" },
    { name: "Actress Name", role: "Character Role", image: "/images/actor_1.png" },
    { name: "Another Actor", role: "Another Character", image: "/images/actor_1.png" },
    { name: "Another Actress", role: "Main Antagonist", image: "/images/actor_1.png" },
    { name: "Veteran Actor", role: "Supporting Role", image: "/images/actor_1.png" }
  ],
  comments: [
    { 
      user: "CommentorName", 
      time: "2 hours ago", 
      text: "This is an amazing take on the source material. The cinematography alone is worth the price of admission. What did everyone think of the final act?",
      likes: 12,
      avatar: "/images/actor_1.png"
    },
    { 
      user: "AnotherUser", 
      time: "1 hour ago", 
      text: "Totally agree! I was on the edge of my seat. I think it was a bold choice but it paid off.",
      likes: 3,
      avatar: "/images/actor_1.png"
    }
  ],
  related: [
    { title: "Similar Film One", image: "/images/poster_2.png" },
    { title: "Another Sci-Fi", image: "/images/poster_1.png" },
    { title: "The Prequel", image: "/images/poster_2.png" },
    { title: "From the Same Director", image: "/images/poster_1.png" },
    { title: "Fan Favorite", image: "/images/poster_2.png" },
    { title: "Classic Flick", image: "/images/poster_1.png" }
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
        {/* Main Movie Hero Section */}
        <MovieHero movie={mockMovie} />
        
        {/* Cast section beneath overview */}
        <CastAndCrew cast={mockMovie.cast} />
        
        {/* Community Discussion forums */}
        <Discussion comments={mockMovie.comments} />
        
        {/* Related Titles */}
        <RelatedMovies movies={mockMovie.related} />
      </main>

      <Footer />
    </div>
  );
};

export default MovieDetails;
