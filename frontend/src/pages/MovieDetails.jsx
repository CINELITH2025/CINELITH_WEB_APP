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
  3:  { pgRating: "PG-13", clScore: 91, userScore: 89, runtime: "2h 8m", releaseDate: "December 9, 2016", awards: "Winner of 6 Academy Awards", writer: "Damien Chazelle", description: "While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future in this breathtaking modern musical." },
  4:  { pgRating: "R", clScore: 98, userScore: 98, runtime: "2h 22m", releaseDate: "October 14, 1994", awards: "Nominated for 7 Academy Awards", writer: "Frank Darabont, Stephen King", description: "Over the course of several years, two convicts form a friendship, seeking consolation and, eventually, redemption through basic compassion behind the walls of Shawshank State Penitentiary." },
  5:  { pgRating: "R", clScore: 94, userScore: 92, runtime: "2h 16m", releaseDate: "March 31, 1999", awards: "Winner of 4 Academy Awards", writer: "Lilly Wachowski, Lana Wachowski", description: "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth — the life he knows is the elaborate deception of an evil cyber-intelligence." },
  6:  { pgRating: "R", clScore: 98, userScore: 97, runtime: "2h 55m", releaseDate: "March 24, 1972", awards: "Winner of 3 Academy Awards", writer: "Mario Puzo, Francis Ford Coppola", description: "The aging patriarch of an organized crime dynasty in postwar New York City transfers control of his clandestine empire to his reluctant youngest son. A masterpiece that chronicles the Corleone family's rise to power in America." },
  7:  { pgRating: "R", clScore: 94, userScore: 96, runtime: "2h 34m", releaseDate: "October 14, 1994", awards: "Winner of Palme d'Or", writer: "Quentin Tarantino, Roger Avary", description: "The lives of two mob hitmen, a boxer, a gangster's wife, and a pair of diner bandits intertwine in four tales of violence and redemption. This landmark film redefined modern cinema with its nonlinear storytelling and sharp dialogue." },
  8:  { pgRating: "R", clScore: 91, userScore: 90, runtime: "2h 35m", releaseDate: "May 5, 2000", awards: "Winner of 5 Academy Awards", writer: "David Franzoni, John Logan", description: "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery in the Colosseum." },
  9:  { pgRating: "R", clScore: 89, userScore: 91, runtime: "2h 45m", releaseDate: "December 25, 2012", awards: "Winner of 2 Academy Awards", writer: "Quentin Tarantino", description: "With the help of a German bounty-hunter, a freed slave sets out to rescue his wife from a brutal plantation owner in Mississippi." },
  10: { pgRating: "R", clScore: 94, userScore: 94, runtime: "1h 47m", releaseDate: "October 10, 2014", awards: "Winner of 3 Academy Awards", writer: "Damien Chazelle", description: "A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing to realize a student's potential." },
  11: { pgRating: "PG", clScore: 97, userScore: 95, runtime: "2h 5m", releaseDate: "July 20, 2001", awards: "Winner of 1 Academy Award", writer: "Hayao Miyazaki", description: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, a world where humans are changed into beasts." },
  12: { pgRating: "PG-13", clScore: 96, userScore: 95, runtime: "2h 32m", releaseDate: "July 18, 2008", awards: "Winner of 2 Academy Awards", writer: "Jonathan Nolan, Christopher Nolan", description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice. A genre-defining superhero film." },
  13: { pgRating: "R", clScore: 88, userScore: 87, runtime: "2h 44m", releaseDate: "October 6, 2017", awards: "Winner of 2 Academy Awards", writer: "Hampton Fancher, Michael Green", description: "Young Blade Runner K's discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard, who's been missing for thirty years. A visually stunning sequel that expands the original's philosophical questions." },
  14: { pgRating: "PG-13", clScore: 91, userScore: 93, runtime: "2h 28m", releaseDate: "July 16, 2010", awards: "Winner of 4 Academy Awards", writer: "Christopher Nolan", description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster." },
  15: { pgRating: "PG-13", clScore: 90, userScore: 92, runtime: "2h 49m", releaseDate: "November 7, 2014", awards: "Winner of 1 Academy Award", writer: "Jonathan Nolan, Christopher Nolan", description: "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot is tasked with piloting a spacecraft along with a team of researchers on a journey through a wormhole in search of a new habitable planet." },
  16: { pgRating: "R", clScore: 96, userScore: 94, runtime: "2h 12m", releaseDate: "November 8, 2019", awards: "Winner of 4 Academy Awards", writer: "Bong Joon Ho, Han Jin-won", description: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan. A masterfully crafted social thriller that shocked the world." },
  17: { pgRating: "R", clScore: 86, userScore: 91, runtime: "2h 19m", releaseDate: "October 15, 1999", awards: "Nominated for 1 Academy Award", writer: "Chuck Palahniuk, Jim Uhls", description: "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more. A provocative film that challenges consumer culture and masculine identity." },
  18: { pgRating: "PG-13", clScore: 88, userScore: 82, runtime: "1h 54m", releaseDate: "July 21, 2023", awards: "Winner of 1 Academy Award", writer: "Greta Gerwig, Noah Baumbach", description: "Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land. However, when they get a chance to go to the real world, they soon discover the joys and perils of living among humans." },
  19: { pgRating: "PG", clScore: 96, userScore: 94, runtime: "1h 57m", releaseDate: "December 14, 2018", awards: "Winner of 1 Academy Award", writer: "Phil Lord, Rodney Rothman", description: "Teen Miles Morales becomes the new Spider-Man and must join with five spider-powered individuals from other dimensions to stop a threat for all realities." },
  20: { pgRating: "PG", clScore: 95, userScore: 93, runtime: "1h 46m", releaseDate: "August 26, 2016", awards: "Winner of LA Film Critics Award", writer: "Makoto Shinkai", description: "Two teenagers share a profound, magical connection upon discovering they are swapping bodies. Things manage to become even more complicated when the boy and girl decide to meet in person." },
  21: { pgRating: "R", clScore: 92, userScore: 91, runtime: "2h 33m", releaseDate: "August 21, 2009", awards: "Winner of 1 Academy Award", writer: "Quentin Tarantino", description: "In Nazi-occupied France during World War II, a plan to assassinate Nazi leaders by a group of Jewish U.S. soldiers coincides with a theatre owner's vengeful plans for the same." },
  22: { pgRating: "PG-13", clScore: 89, userScore: 85, runtime: "2h 42m", releaseDate: "December 18, 2009", awards: "Winner of 3 Academy Awards", writer: "James Cameron", description: "A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home." },
  23: { pgRating: "PG", clScore: 97, userScore: 94, runtime: "2h 1m", releaseDate: "May 25, 1977", awards: "Winner of 6 Academy Awards", writer: "George Lucas", description: "Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee and two droids to save the galaxy from the Empire's world-destroying battle station, while also attempting to rescue Princess Leia from Darth Vader." },
  24: { pgRating: "PG-13", clScore: 97, userScore: 96, runtime: "2h 58m", releaseDate: "December 19, 2001", awards: "Winner of 4 Academy Awards", writer: "J.R.R. Tolkien, Fran Walsh, Peter Jackson", description: "A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron." },
  25: { pgRating: "PG-13", clScore: 95, userScore: 95, runtime: "2h 22m", releaseDate: "July 6, 1994", awards: "Winner of 6 Academy Awards", writer: "Winston Groom, Eric Roth", description: "The history of the United States from the 1950s to the '70s unfolds from the perspective of an Alabama man with an IQ of 75, who yearns to be reunited with his childhood sweetheart." }
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
        image: "/images/poster_1.jpg",
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
