import React, { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ActorBanner from '../components/actor/ActorBanner';
import ActorBio from '../components/actor/ActorBio';
import Filmography from '../components/actor/Filmography';
import AwardsSection from '../components/actor/AwardsSection';
import UnlockGate from '../components/auth/UnlockGate';
import { ACTOR_CATALOG, MOVIE_CATALOG } from '../store/useUserStore';

// Rich actor details mapped by catalog actor ID
const ACTOR_DETAILS = {
  1: {
    stats: { movies: 28, awards: 14 },
    bio: [
      "Timothée Hal Chalamet is an American and French actor. He has received various accolades, including nominations for an Academy Award, two Golden Globe Awards, and three BAFTA Film Awards. Chalamet began his acting career in short films and commercials before appearing in the drama television series Homeland in 2012.",
      "His breakthrough role came as Elio Perlman in Luca Guadagnino's coming-of-age romantic drama Call Me by Your Name (2017), for which he received an Academy Award nomination for Best Actor. He has since starred in Denis Villeneuve's epic Dune films and portrayed Willy Wonka in the fantasy musical Wonka."
    ],
    facts: [
      { label: "Born", value: "December 27, 1995" },
      { label: "Age", value: "30" },
      { label: "Nationality", value: "American / French" },
      { label: "Debut", value: "2008" },
      { label: "Active Years", value: "2008 - Present" }
    ],
    filmIds: [1, 13, 14, 15], // Dune Part Two, BR2049, Inception, Interstellar
    awards: [
      { title: "Best Actor - Golden Globe Nominee", details: "For 'Call Me by Your Name'", year: "2018" },
      { title: "Best Actor - Academy Award Nominee", details: "For 'Call Me by Your Name'", year: "2018" },
      { title: "Rising Star Award - Palm Springs", details: "Recognizing outstanding young talent", year: "2018" }
    ]
  },
  2: {
    stats: { movies: 22, awards: 18 },
    bio: [
      "Zendaya Maree Stoermer Coleman is an American actress and singer. She has received various accolades, including two Primetime Emmy Awards and a Golden Globe Award. Time magazine named her one of the 100 most influential people in the world in its annual list in 2022.",
      "Zendaya began her career as a child model and backup dancer. She made her breakthrough as Rocky Blue on the Disney Channel sitcom Shake It Up (2010–2013). She made her film debut in the superhero film Spider-Man: Homecoming (2017) and subsequently starred in its sequels, Euphoria, and the Dune franchise."
    ],
    facts: [
      { label: "Born", value: "September 1, 1996" },
      { label: "Age", value: "29" },
      { label: "Nationality", value: "American" },
      { label: "Debut", value: "2009" },
      { label: "Active Years", value: "2009 - Present" }
    ],
    filmIds: [1, 13, 14, 15],
    awards: [
      { title: "Outstanding Lead Actress - Emmy Awards", details: "For her portrayal in 'Euphoria'", year: "2020, 2022" },
      { title: "Best Actress - Golden Globe Awards", details: "For Drama Series 'Euphoria'", year: "2023" }
    ]
  },
  3: {
    stats: { movies: 19, awards: 9 },
    bio: [
      "Austin Robert Butler is an American actor. He is best known for portraying Elvis Presley in the musical biopic Elvis (2022), for which he won a Golden Globe Award, a BAFTA Award, and was nominated for an Academy Award for Best Actor.",
      "Butler began his career on television, first in roles on the Disney Channel and Nickelodeon. He made his Broadway debut in the 2018 revival of The Iceman Cometh and played Tex Watson in Quentin Tarantino's Once Upon a Time in Hollywood (2019) before starring in Dune: Part Two."
    ],
    facts: [
      { label: "Born", value: "August 17, 1991" },
      { label: "Age", value: "34" },
      { label: "Nationality", value: "American" },
      { label: "Debut", value: "2005" },
      { label: "Active Years", value: "2005 - Present" }
    ],
    filmIds: [1, 12],
    awards: [
      { title: "Best Actor - Golden Globe Awards", details: "For portraying Elvis Presley in 'Elvis'", year: "2023" },
      { title: "Best Actor - BAFTA Awards", details: "For portraying Elvis Presley in 'Elvis'", year: "2023" }
    ]
  },
  4: {
    stats: { movies: 54, awards: 32 },
    bio: [
      "Cillian Murphy is an Irish actor. He made his professional debut in Enda Walsh's 1996 play Disco Pigs, and in the subsequent 2001 film adaptation. His early notable film credits include the horror film 28 Days Later (2002), the dark comedy Intermission (2003), and the thriller Red Eye (2005).",
      "Murphy is known for his collaborations with director Christopher Nolan, playing the Scarecrow in The Dark Knight Trilogy (2005–2012) and appearing in Inception (2010) and Dunkirk (2017). His portrayal of J. Robert Oppenheimer in Oppenheimer (2023) earned him an Academy Award, a Golden Globe, and a BAFTA for Best Actor."
    ],
    facts: [
      { label: "Born", value: "May 25, 1976" },
      { label: "Age", value: "50" },
      { label: "Nationality", value: "Irish" },
      { label: "Debut", value: "1996" },
      { label: "Active Years", value: "1996 - Present" }
    ],
    filmIds: [2, 12, 14, 15],
    awards: [
      { title: "Best Actor - Academy Awards", details: "For 'Oppenheimer'", year: "2024" },
      { title: "Best Actor - Golden Globe Awards", details: "For 'Oppenheimer'", year: "2024" },
      { title: "Best Actor - BAFTA Awards", details: "For 'Oppenheimer'", year: "2024" }
    ]
  },
  5: {
    stats: { movies: 41, awards: 28 },
    bio: [
      "Emily Jean 'Emma' Stone is an American actress. The recipient of various accolades, including two Academy Awards, two Golden Globe Awards, and three British Academy Film Awards, she was the world's highest-paid actress in 2017. Stone appeared in Time magazine's list of the 100 most influential people in the world in 2017.",
      "Stone made her breakthrough in the teen comedy Superbad (2007) and went on to receive critical acclaim for her roles in Easy A (2010), Birdman (2014), and La La Land (2016), for which she won her first Oscar. Her role as Bella Baxter in Poor Things (2023) won her a second Academy Award."
    ],
    facts: [
      { label: "Born", value: "November 6, 1988" },
      { label: "Age", value: "37" },
      { label: "Nationality", value: "American" },
      { label: "Debut", value: "2004" },
      { label: "Active Years", value: "2004 - Present" }
    ],
    filmIds: [3, 14, 16],
    awards: [
      { title: "Best Actress - Academy Awards", details: "Winner for 'La La Land' & 'Poor Things'", year: "2017, 2024" },
      { title: "Best Actress - BAFTA Awards", details: "Winner for 'La La Land' & 'Poor Things'", year: "2017, 2024" }
    ]
  },
  6: {
    stats: { movies: 68, awards: 12 },
    bio: [
      "Mark Alan Ruffalo is an American actor and producer. He began acting in the early 1990s and first gained recognition for his work in Kenneth Lonergan's play This Is Our Youth (1998) and drama film You Can Count on Me (2000).",
      "He went on to star in the romantic comedies 13 Going on 30 (2004) and Just Like Heaven (2005) and the thrillers Zodiac (2007) and Shutter Island (2010). He gained international recognition for playing Bruce Banner / the Hulk in the Marvel Cinematic Universe superhero films. He was nominated for an Oscar for his roles in The Kids Are All Right, Foxcatcher, Spotlight, and Poor Things."
    ],
    facts: [
      { label: "Born", value: "November 22, 1967" },
      { label: "Age", value: "58" },
      { label: "Nationality", value: "American" },
      { label: "Debut", value: "1989" },
      { label: "Active Years", value: "1989 - Present" }
    ],
    filmIds: [3, 14, 17],
    awards: [
      { title: "Best Supporting Actor Nominee - Academy Awards", details: "For 'Spotlight' & 'Poor Things'", year: "2016, 2024" },
      { title: "Outstanding Lead Actor - Primetime Emmy Awards", details: "For 'I Know This Much Is True'", year: "2020" }
    ]
  },
  7: {
    stats: { movies: 52, awards: 45 },
    bio: [
      "Leonardo Wilhelm DiCaprio is an American actor and film producer. Known for his work in biopics and period films, he is the recipient of numerous accolades, including an Academy Award, a British Academy Film Award, and three Golden Globe Awards.",
      "His films have grossed over $7.2 billion worldwide, and he has placed eight times in annual rankings of the world's highest-paid actors. He rose to international stardom with the epic romances Romeo + Juliet (1996) and Titanic (1997) and established a long-running partnership with director Martin Scorsese."
    ],
    facts: [
      { label: "Born", value: "November 11, 1974" },
      { label: "Age", value: "51" },
      { label: "Nationality", value: "American" },
      { label: "Debut", value: "1989" },
      { label: "Active Years", value: "1989 - Present" }
    ],
    filmIds: [14, 15, 17],
    awards: [
      { title: "Best Actor - Academy Awards", details: "Winner for his performance in 'The Revenant'", year: "2016" },
      { title: "Best Actor - Golden Globe Awards", details: "Winner for 'The Aviator', 'The Wolf of Wall Street', 'The Revenant'", year: "2005, 2014, 2016" }
    ]
  },
  8: {
    stats: { movies: 48, awards: 36 },
    bio: [
      "Christian Charles Philip Bale is an English actor. Known for his versatility and physical transformations for his roles, he has been a leading man in films of several genres. He has received various accolades, including an Academy Award and two Golden Globe Awards.",
      "Bale made his breakthrough at age 13 in Steven Spielberg's war film Empire of the Sun (1987). He gained wider profile for his portrayal of serial killer Patrick Bateman in American Psycho (2000) and went on to achieve global recognition as Batman in Christopher Nolan's Dark Knight Trilogy."
    ],
    facts: [
      { label: "Born", value: "January 30, 1974" },
      { label: "Age", value: "52" },
      { label: "Nationality", value: "British" },
      { label: "Debut", value: "1986" },
      { label: "Active Years", value: "1986 - Present" }
    ],
    filmIds: [12, 14],
    awards: [
      { title: "Best Supporting Actor - Academy Awards", details: "Winner for his role in 'The Fighter'", year: "2011" },
      { title: "Best Actor - Golden Globe Awards", details: "Winner for 'Vice' as Dick Cheney", year: "2019" }
    ]
  }
};

const ActorProfile = () => {
  const { id } = useParams();
  const actorId = parseInt(id, 10);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Retrieve actor catalog entry and details
  const actor = useMemo(() => {
    const catalogEntry = ACTOR_CATALOG.find(a => a.id === actorId);
    const details = ACTOR_DETAILS[actorId];

    if (!catalogEntry) {
      // Fallback
      return {
        name: "Unknown Actor",
        image: "/images/actor_hero_bg.png",
        stats: { movies: 0, awards: 0 },
        bio: ["No biography details available for this actor."],
        facts: [{ label: "N/A", value: "N/A" }],
        filmography: [],
        awards: []
      };
    }

    // Map matched films from catalog
    const filmography = (details?.filmIds || []).map(fId => {
      const movie = MOVIE_CATALOG.find(m => m.id === fId);
      return movie ? {
        id: movie.id,
        title: movie.title,
        year: movie.year,
        views: `${(Math.random() * (4.5 - 1.0) + 1.0).toFixed(1)}M views`, // premium touch
        image: movie.image
      } : null;
    }).filter(Boolean);

    return {
      ...catalogEntry,
      stats: details?.stats || { movies: 12, awards: 2 },
      bio: details?.bio || ["No biography details available."],
      facts: details?.facts || [],
      filmography,
      awards: details?.awards || []
    };
  }, [actorId]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden font-sans">
      <Navbar />
      
      <main className="flex-1 w-full max-w-[1200px] mx-auto pb-16 px-4 md:px-8 pt-8">
        <ActorBanner 
          name={actor.name} 
          image={actor.image} 
          stats={actor.stats} 
        />
        
        <ActorBio 
          bio={actor.bio} 
          facts={actor.facts} 
        />
        
        <Filmography movies={actor.filmography} />
        
        <AwardsSection awards={actor.awards} />
      </main>

      <Footer />
    </div>
  );
};

export default ActorProfile;
