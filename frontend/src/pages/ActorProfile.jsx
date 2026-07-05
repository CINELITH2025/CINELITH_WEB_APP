import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ActorBanner from '../components/actor/ActorBanner';
import ActorBio from '../components/actor/ActorBio';
import Filmography from '../components/actor/Filmography';
import AwardsSection from '../components/actor/AwardsSection';

const actorData = {
  name: "Actor Name",
  image: "/images/actor_hero_bg.png",
  stats: {
    movies: 86,
    awards: 24
  },
  bio: [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nulla varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris."
  ],
  facts: [
    { label: "Born", value: "January 1, 1980" },
    { label: "Age", value: "44" },
    { label: "Nationality", value: "American" },
    { label: "Debut", value: "1998" },
    { label: "Active Years", value: "1998 - Present" }
  ],
  filmography: [
    { title: "Dune", year: "2021", views: "3M views", image: "/images/poster_1.png" },
    { title: "The Creator", year: "2023", views: "2.4M views", image: "/images/poster_2.png" },
    { title: "Oppenheimer", year: "2023", views: "1.9M views", image: "/images/poster_1.png" },
    { title: "The Dark Knight", year: "2008", views: "900K views", image: "/images/poster_2.png" },
    { title: "Blade Runner 2049", year: "2017", views: "800K views", image: "/images/poster_1.png" }
  ],
  awards: [
    { title: "Best Actor - Academy Awards", details: "For the film \"The Third One\"", year: "2021" },
    { title: "Best Actor - Golden Globe Awards", details: "For the film \"Noir Detective\"", year: "2019" },
    { title: "Nominee: Best Supporting Actor - BAFTA", details: "For the film \"Sci-Fi Saga\"", year: "2017" }
  ]
};

const ActorProfile = () => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden font-sans">
      <Navbar />
      
      <main className="flex-1 w-full max-w-[1200px] mx-auto pb-16 px-4 md:px-8 pt-8">
        <ActorBanner 
          name={actorData.name} 
          image={actorData.image} 
          stats={actorData.stats} 
        />
        
        <ActorBio 
          bio={actorData.bio} 
          facts={actorData.facts} 
        />
        
        <Filmography movies={actorData.filmography} />
        
        <AwardsSection awards={actorData.awards} />
      </main>

      <Footer />
    </div>
  );
};

export default ActorProfile;
