import { useState } from 'react';
import { Clapperboard } from 'lucide-react';
import { getOptimizedImageUrl } from '../../lib/image';

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

const MoviePoster = ({
  src,
  alt = "Movie Poster",
  className = "w-full h-full object-cover",
  size = "w185",
  id = null,
  priority = false
}) => {
  const fallbackSrc = (id && LOCAL_POSTERS[id]) || "/images/poster_1.jpg";
  const candidateUrl = src ? getOptimizedImageUrl(src, size) : ((id && LOCAL_POSTERS[id]) || "/images/poster_1.jpg");
  const [failedUrls, setFailedUrls] = useState([]);
  const [loadedSrc, setLoadedSrc] = useState(null);
  const currentSrc = failedUrls.includes(candidateUrl) ? fallbackSrc : candidateUrl;
  const hasError = failedUrls.includes(currentSrc);
  const loaded = loadedSrc === currentSrc;

  const handleError = () => {
    setFailedUrls((failed) => failed.includes(currentSrc) ? failed : [...failed, currentSrc]);
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
          referrerPolicy="no-referrer"
          onLoad={() => setLoadedSrc(currentSrc)}
          onError={handleError}
          className={`${className} transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </div>
  );
};

export default MoviePoster;
