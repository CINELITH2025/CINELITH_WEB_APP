import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ActorBanner from '../components/actor/ActorBanner';
import ActorBio from '../components/actor/ActorBio';
import FanBanner from '../components/actor/FanBanner';
import Filmography from '../components/actor/Filmography';
import AwardsSection from '../components/actor/AwardsSection';
import PersonalInsights from '../components/actor/PersonalInsights';

const actorData = {
  name: "Sophia Turner",
  image: "/images/actor_hero_bg.png",
  stats: {
    movies: 120,
    series: 85,
    rating: 4.8
  },
  bio: [
    "Sophia Turner, born in Los Angeles, California, is an acclaimed actress known for her versatile roles in both blockbuster films and critically acclaimed indie projects. With a career spanning over a decade, she has garnered numerous awards and nominations, solidifying her status as one of the most talented performers of her generation.",
    "Sophia Turner, born indie projects. With a career spanning over a decade, she has garnered numerous awards and nominations, solidifying her status as one of the most talented performers of her generation.",
    "Sophia Turner, born in Los Angeles, California, is an acclaimed actress known for her versatile has garnered numerous awards and nominations, solidifying her status as one of the most talented performers of her generation. Sophia Turner, born in Los Angeles, California, is an acclaimed actress known for her versatile roles in both blockbuster films and critically acclaimed indie projects."
  ],
  facts: [
    { label: "Born", value: "July 15, 1993" },
    { label: "Age", value: "58" }, // Based on the mock image data
    { label: "Nationality", value: "Indian" },
    { label: "Debut", value: "1992" },
    { label: "Active Years", value: "2004 - Present" }
  ],
  fanPercentage: 87,
  filmography: [
    { title: "The Starlight Sonata", year: "2022", views: "3M views", image: "/images/poster_2.png" },
    { title: "Echoes of the Past", year: "2020", views: "2.4M views", image: "/images/poster_1.png" },
    { title: "City of Dreams", year: "2018", views: "1.9M views", image: "/images/poster_1.png" }, // Reusing posters
    { title: "Silent Whispers", year: "2016", views: "900K views", image: "/images/poster_2.png" }
  ],
  awards: [
    { title: "Best Actress - The Starlight Sonata", year: "2023" },
    { title: "Critics' Choice Award - Echoes of the Past", year: "2021" },
    { title: "Golden Globe Nomination - City of Dreams", year: "2019" },
    { title: "Screen Actors Guild Award - Silent Whispers", year: "2017" }
  ],
  insights: {
    relationships: "Currently single, previously linked to actor Ethan Blake.",
    quotes: "The only way to do great work is to love what you do.",
    trivia: "Enjoys painting and playing the piano in her free time."
  }
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
        
        <FanBanner 
          percentage={actorData.fanPercentage} 
          name={actorData.name} 
        />
        
        <Filmography movies={actorData.filmography} />
        
        <AwardsSection awards={actorData.awards} />
        
        <PersonalInsights insights={actorData.insights} />
      </main>

      <Footer />
    </div>
  );
};

export default ActorProfile;
