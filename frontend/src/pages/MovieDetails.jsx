import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import MovieHero from '../components/movie/MovieHero';
import CastAndCrew from '../components/movie/CastAndCrew';
import Discussion from '../components/movie/Discussion';
import RelatedMovies from '../components/movie/RelatedMovies';
import UnlockGate from '../components/auth/UnlockGate';
import { MOVIE_CATALOG } from '../store/useUserStore';

// Extended movie details data keyed by catalog ID
const MOVIE_DETAILS = {
  1:  { pgRating: "PG-13", clScore: 92, userScore: 94, runtime: "2h 46m", releaseDate: "March 1, 2024", awards: "Winner of 5 Academy Awards", writer: "Denis Villeneuve, Jon Spaihts", description: "Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavors to prevent a terrible future only he can foresee." },
  2:  { pgRating: "R", clScore: 93, userScore: 91, runtime: "3h 0m", releaseDate: "July 21, 2023", awards: "Winner of 7 Academy Awards", writer: "Christopher Nolan", description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb. This epic thriller thrusts audiences into the pulse-pounding paradox of the enigmatic man who must risk destroying the world in order to save it." },
  3:  { pgRating: "R", clScore: 87, userScore: 85, runtime: "2h 21m", releaseDate: "December 8, 2023", awards: "Winner of 4 Academy Awards", writer: "Tony McNamara", description: "The incredible tale of Bella Baxter, a young woman brought back to life by the brilliant and unorthodox scientist Dr. Godwin Baxter. Under Baxter's protection, Bella is eager to learn, growing rapidly and thirsting for the worldliness she is lacking." },
  4:  { pgRating: "R", clScore: 84, userScore: 88, runtime: "2h 13m", releaseDate: "October 27, 2023", awards: "Nominee for 5 Academy Awards", writer: "David Hemingson", description: "A curmudgeonly instructor at a New England prep school is forced to remain on campus during Christmas break to babysit the handful of students with nowhere to go. Eventually, he forms an unlikely bond with one of them." },
  5:  { pgRating: "R", clScore: 82, userScore: 79, runtime: "2h 30m", releaseDate: "October 13, 2023", awards: "Winner of Palme d'Or", writer: "Justine Triet, Arthur Harari", description: "A woman is suspected of her husband's murder, and their blind son faces a moral dilemma as the sole witness in the ensuing courtroom drama that examines the nature of truth and the complexities of a marriage." },
  6:  { pgRating: "R", clScore: 98, userScore: 97, runtime: "2h 55m", releaseDate: "March 24, 1972", awards: "Winner of 3 Academy Awards", writer: "Mario Puzo, Francis Ford Coppola", description: "The aging patriarch of an organized crime dynasty in postwar New York City transfers control of his clandestine empire to his reluctant youngest son. A masterpiece that chronicles the Corleone family's rise to power in America." },
  7:  { pgRating: "R", clScore: 94, userScore: 96, runtime: "2h 34m", releaseDate: "October 14, 1994", awards: "Winner of Palme d'Or", writer: "Quentin Tarantino, Roger Avary", description: "The lives of two mob hitmen, a boxer, a gangster's wife, and a pair of diner bandits intertwine in four tales of violence and redemption. This landmark film redefined modern cinema with its nonlinear storytelling and sharp dialogue." },
  8:  { pgRating: "G", clScore: 90, userScore: 82, runtime: "2h 29m", releaseDate: "April 3, 1968", awards: "Winner of 1 Academy Award", writer: "Stanley Kubrick, Arthur C. Clarke", description: "After uncovering a mysterious artifact buried beneath the Lunar surface, a spacecraft is sent to Jupiter to find its origins — a voyage that leads the crew into the unknown reaches of space and an encounter with a powerful artificial intelligence." },
  9:  { pgRating: "R", clScore: 89, userScore: 86, runtime: "1h 57m", releaseDate: "June 25, 1982", awards: "Nominated for 2 Academy Awards", writer: "Hampton Fancher, David Webb Peoples", description: "A blade runner must pursue and terminate four replicants who stole a ship in space and have returned to Earth to find their creator. Set in a dystopian Los Angeles of 2019, this film explores what it means to be human." },
  10: { pgRating: "PG", clScore: 95, userScore: 80, runtime: "1h 59m", releaseDate: "September 5, 1941", awards: "Winner of 1 Academy Award", writer: "Herman J. Mankiewicz, Orson Welles", description: "Following the death of publishing tycoon Charles Foster Kane, reporters scramble to uncover the meaning of his final utterance: 'Rosebud.' An innovative exploration of power, wealth, and the American Dream." },
  11: { pgRating: "PG-13", clScore: 72, userScore: 74, runtime: "2h 13m", releaseDate: "September 29, 2023", awards: "Nominated for Best Visual Effects", writer: "Gareth Edwards, Chris Weitz", description: "Amidst a future war between the human race and the forces of artificial intelligence, Joshua, a hardened ex-special forces agent, is recruited to hunt down and kill the Creator — the architect of advanced AI." },
  12: { pgRating: "PG-13", clScore: 96, userScore: 95, runtime: "2h 32m", releaseDate: "July 18, 2008", awards: "Winner of 2 Academy Awards", writer: "Jonathan Nolan, Christopher Nolan", description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice. A genre-defining superhero film." },
  13: { pgRating: "R", clScore: 88, userScore: 87, runtime: "2h 44m", releaseDate: "October 6, 2017", awards: "Winner of 2 Academy Awards", writer: "Hampton Fancher, Michael Green", description: "Young Blade Runner K's discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard, who's been missing for thirty years. A visually stunning sequel that expands the original's philosophical questions." },
  14: { pgRating: "PG-13", clScore: 91, userScore: 93, runtime: "2h 28m", releaseDate: "July 16, 2010", awards: "Winner of 4 Academy Awards", writer: "Christopher Nolan", description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster." },
  15: { pgRating: "PG-13", clScore: 90, userScore: 92, runtime: "2h 49m", releaseDate: "November 7, 2014", awards: "Winner of 1 Academy Award", writer: "Jonathan Nolan, Christopher Nolan", description: "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot is tasked with piloting a spacecraft along with a team of researchers on a journey through a wormhole in search of a new habitable planet." },
  16: { pgRating: "R", clScore: 96, userScore: 94, runtime: "2h 12m", releaseDate: "November 8, 2019", awards: "Winner of 4 Academy Awards", writer: "Bong Joon Ho, Han Jin-won", description: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan. A masterfully crafted social thriller that shocked the world." },
  17: { pgRating: "R", clScore: 86, userScore: 91, runtime: "2h 19m", releaseDate: "October 15, 1999", awards: "Nominated for 1 Academy Award", writer: "Chuck Palahniuk, Jim Uhls", description: "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more. A provocative film that challenges consumer culture and masculine identity." }
};

// Default cast for all movies (since we use the same actor images)
const defaultCast = [
  { name: "Lead Actor", role: "Protagonist", image: "/images/actor_1.png" },
  { name: "Lead Actress", role: "Co-Lead", image: "/images/actor_1.png" },
  { name: "Supporting Actor", role: "Supporting Role", image: "/images/actor_1.png" },
  { name: "Character Actor", role: "Antagonist", image: "/images/actor_1.png" },
  { name: "Veteran Actor", role: "Mentor", image: "/images/actor_1.png" }
];

const defaultComments = [
  { 
    user: "CinephileX", 
    time: "2 hours ago", 
    text: "This is an amazing take on the source material. The cinematography alone is worth the price of admission. What did everyone think of the final act?",
    likes: 12,
    avatar: "/images/actor_1.png"
  },
  { 
    user: "MovieBuff42", 
    time: "1 hour ago", 
    text: "Totally agree! I was on the edge of my seat. I think it was a bold choice but it paid off.",
    likes: 3,
    avatar: "/images/actor_1.png"
  }
];

const MovieDetails = () => {
  const { id } = useParams();
  const movieId = parseInt(id, 10);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Build the full movie object from MOVIE_CATALOG + MOVIE_DETAILS
  const movie = useMemo(() => {
    const catalogEntry = MOVIE_CATALOG.find(m => m.id === movieId);
    const details = MOVIE_DETAILS[movieId];

    if (!catalogEntry) {
      // Fallback for unknown IDs
      return {
        id: movieId,
        title: "Unknown Movie",
        year: "N/A",
        genre: "N/A",
        image: "/images/poster_1.png",
        director: "Unknown",
        pgRating: "N/A",
        clScore: 0,
        userScore: 0,
        runtime: "N/A",
        releaseDate: "N/A",
        awards: "N/A",
        writer: "Unknown",
        description: "No description available for this title.",
        cast: defaultCast,
        comments: defaultComments,
        related: MOVIE_CATALOG.slice(0, 6).map(m => ({ title: m.title, image: m.image }))
      };
    }

    return {
      ...catalogEntry,
      ...(details || {}),
      cast: defaultCast,
      comments: defaultComments,
      related: MOVIE_CATALOG
        .filter(m => m.id !== movieId)
        .slice(0, 6)
        .map(m => ({ title: m.title, image: m.image }))
    };
  }, [movieId]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden font-sans">
      <Navbar />
      
      <main className="flex-1 w-full max-w-[1200px] mx-auto pb-16 px-4 md:px-8 pt-8">
        <UnlockGate 
          title="Unlock Movie Details & Taste Match" 
          subtitle="Explore full movie details, streaming availability (JioHotstar, Netflix), reviews, cast profiles, and your personalized Taste Match score by logging in."
          features={[
            "Taste Match Score (e.g. 94% Match) based on your viewing history",
            "Streaming provider availability (JioHotstar, Netflix, Amazon Prime)",
            "Community review ratings & spoiler-protected discussions",
            "Direct cast & crew profile exploration"
          ]}
        >
          {/* Main Movie Hero Section */}
          <MovieHero movie={movie} />
          
          {/* Cast section beneath overview */}
          <CastAndCrew cast={movie.cast} />
          
          {/* Community Discussion forums */}
          <Discussion comments={movie.comments} movieId={movieId} />
          
          {/* Related Titles */}
          <RelatedMovies movies={movie.related} />
        </UnlockGate>
      </main>

      <Footer />
    </div>
  );
};

export default MovieDetails;
