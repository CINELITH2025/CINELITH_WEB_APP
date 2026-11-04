import React, { useState } from 'react';
import { Clapperboard } from 'lucide-react';

// Fast local poster fallbacks for top curated titles
const LOCAL_POSTERS = {
  1: "/images/poster_4.jpg",
  2: "/images/poster_5.jpg",
  3: "/images/poster_7.jpg",
  4: "/images/poster_12.jpg",
  5: "/images/poster_10.jpg",
  6: "/images/poster_13.jpg",
  7: "/images/poster_8.jpg",
  8: "/images/poster_18.jpg",
  9: "/images/poster_19.jpg",
  10: "/images/poster_15.jpg",
  11: "/images/poster_16.jpg",
  12: "/images/poster_3.jpg",
  13: "/images/poster_14.jpg",
  14: "/images/poster_2.jpg",
  15: "/images/poster_1.jpg",
  16: "/images/poster_11.jpg",
  17: "/images/poster_9.jpg",
  18: "/images/poster_6.jpg",
  19: "/images/poster_17.jpg",
  20: "/images/poster_20.jpg",
  21: "/images/poster_21.jpg",
  22: "/images/poster_22.jpg",
  23: "/images/poster_23.jpg",
  24: "/images/poster_24.jpg",
  25: "/images/poster_25.jpg"
};

/**
 * Optimizes TMDb image URLs to requested resolution (w185 for thumbnails, w342 for medium cards, w500 for heroes).
 * Reduces payload by 60-75% for dramatic speedups.
 */
export const getOptimizedImageUrl = (src, size = "w185") => {
  if (!src) return "/images/poster_1.jpg";
  if (typeof src === "string" && src.includes("image.tmdb.org/t/p/")) {
    return src.replace(/\/t\/p\/[^\/]+/, `/t/p/${size}`);
  }
  return src;
};

const MoviePoster = ({
  src,
  alt = "Movie Poster",
  className = "w-full h-full object-cover",
  size = "w185",
  id = null,
  priority = false
}) => {
  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // If local high-res asset exists for this ID, use it for 0ms load
  const candidateUrl = (id && LOCAL_POSTERS[id]) || getOptimizedImageUrl(src, size);
  const [currentSrc, setCurrentSrc] = useState(candidateUrl);

  const handleError = () => {
    // If external TMDB image failed or is slow/blocked, fall back to safe local poster
    if (currentSrc !== "/images/poster_1.jpg") {
      setCurrentSrc("/images/poster_1.jpg");
    } else {
      setHasError(true);
    }
  };

  return (
    <div className="relative w-full h-full bg-[#121018] overflow-hidden select-none">
      {/* Lightweight pulse skeleton while image streams */}
      {!loaded && !hasError && (
        <div className="absolute inset-0 bg-white/5 animate-pulse flex items-center justify-center">
          <Clapperboard className="w-6 h-6 text-white/10" />
        </div>
      )}

      {hasError ? (
        <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-white/5 text-gray-500">
          <Clapperboard className="w-7 h-7 mb-1 text-white/20" strokeWidth={1.5} />
          <span className="text-[10px] text-gray-500 font-medium line-clamp-1">{alt}</span>
        </div>
      ) : (
        <img
          src={currentSrc}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={handleError}
          className={`${className} transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </div>
  );
};

export default MoviePoster;
