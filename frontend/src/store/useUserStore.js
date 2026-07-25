import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Curated movie & TV show data helper to populate onboarding and explore
export const MOVIE_CATALOG = [
  { id: 1, title: "Dune: Part Two", year: "2024", genre: "Sci-Fi, Adventure", rating: 8.8, image: "/images/poster_1.png", director: "Denis Villeneuve", type: "movie", region: "United States", language: "English", cast: ["Timothée Chalamet", "Zendaya", "Austin Butler", "Florence Pugh"] },
  { id: 2, title: "Oppenheimer", year: "2023", genre: "Drama, History", rating: 8.9, image: "/images/poster_2.png", director: "Christopher Nolan", type: "movie", region: "United States", language: "English", cast: ["Cillian Murphy", "Emily Blunt", "Matt Damon", "Robert Downey Jr."] },
  { id: 3, title: "Poor Things", year: "2023", genre: "Comedy, Romance, Sci-Fi", rating: 8.4, image: "/images/poster_1.png", director: "Yorgos Lanthimos", type: "movie", region: "United Kingdom", language: "English", cast: ["Emma Stone", "Mark Ruffalo", "Willem Dafoe"] },
  { id: 4, title: "The Holdovers", year: "2023", genre: "Comedy, Drama", rating: 8.0, image: "/images/poster_2.png", director: "Alexander Payne", type: "movie", region: "United States", language: "English", cast: ["Paul Giamatti", "Da'Vine Joy Randolph", "Dominic Sessa"] },
  { id: 5, title: "Anatomy of a Fall", year: "2023", genre: "Thriller, Drama, Crime", rating: 7.8, image: "/images/poster_1.png", director: "Justine Triet", type: "movie", region: "France", language: "French", cast: ["Sandra Hüller", "Swann Arlaud", "Milo Machado-Graner"] },
  { id: 6, title: "The Godfather", year: "1972", genre: "Crime, Drama", rating: 9.2, image: "/images/poster_2.png", director: "Francis Ford Coppola", type: "movie", region: "United States", language: "English", cast: ["Marlon Brando", "Al Pacino", "James Caan"] },
  { id: 7, title: "Pulp Fiction", year: "1994", genre: "Crime, Thriller", rating: 8.9, image: "/images/poster_1.png", director: "Quentin Tarantino", type: "movie", region: "United States", language: "English", cast: ["John Travolta", "Samuel L. Jackson", "Uma Thurman", "Bruce Willis"] },
  { id: 8, title: "2001: A Space Odyssey", year: "1968", genre: "Sci-Fi, Adventure", rating: 8.3, image: "/images/poster_2.png", director: "Stanley Kubrick", type: "movie", region: "United Kingdom", language: "English", cast: ["Keir Dullea", "Gary Lockwood"] },
  { id: 9, title: "Blade Runner", year: "1982", genre: "Sci-Fi, Thriller", rating: 8.1, image: "/images/poster_1.png", director: "Ridley Scott", type: "movie", region: "United States", language: "English", cast: ["Harrison Ford", "Rutger Hauer", "Sean Young"] },
  { id: 10, title: "Citizen Kane", year: "1941", genre: "Drama, Mystery", rating: 8.3, image: "/images/poster_2.png", director: "Orson Welles", type: "movie", region: "United States", language: "English", cast: ["Orson Welles", "Joseph Cotten", "Dorothy Comingore"] },
  { id: 11, title: "The Creator", year: "2023", genre: "Sci-Fi, Action", rating: 7.1, image: "/images/poster_2.png", director: "Gareth Edwards", type: "movie", region: "United States", language: "English", cast: ["John David Washington", "Gemma Chan"] },
  { id: 12, title: "The Dark Knight", year: "2008", genre: "Action, Crime, Thriller", rating: 9.0, image: "/images/poster_2.png", director: "Christopher Nolan", type: "movie", region: "United States", language: "English", cast: ["Christian Bale", "Heath Ledger", "Gary Oldman"] },
  { id: 13, title: "Blade Runner 2049", year: "2017", genre: "Sci-Fi, Thriller", rating: 8.0, image: "/images/poster_1.png", director: "Denis Villeneuve", type: "movie", region: "United States", language: "English", cast: ["Ryan Gosling", "Harrison Ford", "Ana de Armas"] },
  { id: 14, title: "Inception", year: "2010", genre: "Action, Sci-Fi, Adventure", rating: 8.8, image: "/images/poster_1.png", director: "Christopher Nolan", type: "movie", region: "United States", language: "English", cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"] },
  { id: 15, title: "Interstellar", year: "2014", genre: "Sci-Fi, Drama", rating: 8.7, image: "/images/poster_2.png", director: "Christopher Nolan", type: "movie", region: "United States", language: "English", cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"] },
  { id: 16, title: "Parasite", year: "2019", genre: "Thriller, Drama, Comedy", rating: 8.6, image: "/images/poster_2.png", director: "Bong Joon Ho", type: "movie", region: "South Korea", language: "Korean", cast: ["Song Kang-ho", "Lee Sun-kyun", "Cho Yeo-jeong"] },
  { id: 17, title: "Fight Club", year: "1999", genre: "Drama, Thriller", rating: 8.8, image: "/images/poster_2.png", director: "David Fincher", type: "movie", region: "United States", language: "English", cast: ["Brad Pitt", "Edward Norton", "Helena Bonham Carter"] },
  
  // TV Shows
  { id: 18, title: "Breaking Bad", year: "2008", genre: "Crime, Drama, Thriller", rating: 9.5, image: "/images/poster_1.png", director: "Vince Gilligan", type: "tv", region: "United States", language: "English", cast: ["Bryan Cranston", "Aaron Paul", "Bob Odenkirk"] },
  { id: 19, title: "Game of Thrones", year: "2011", genre: "Action, Adventure, Drama", rating: 9.2, image: "/images/poster_2.png", director: "David Benioff", type: "tv", region: "United Kingdom", language: "English", cast: ["Emilia Clarke", "Kit Harington", "Peter Dinklage"] },
  { id: 20, title: "Succession", year: "2018", genre: "Drama", rating: 8.8, image: "/images/poster_1.png", director: "Jesse Armstrong", type: "tv", region: "United States", language: "English", cast: ["Brian Cox", "Jeremy Strong", "Sarah Snook"] },
  { id: 21, title: "Severance", year: "2022", genre: "Sci-Fi, Thriller", rating: 8.7, image: "/images/poster_2.png", director: "Dan Erickson", type: "tv", region: "United States", language: "English", cast: ["Adam Scott", "Patricia Arquette", "John Turturro"] },
  { id: 22, title: "Chernobyl", year: "2019", genre: "Drama, History", rating: 9.4, image: "/images/poster_1.png", director: "Craig Mazin", type: "tv", region: "United Kingdom", language: "English", cast: ["Jared Harris", "Stellan Skarsgård", "Emily Watson"] },
  { id: 23, title: "Squid Game", year: "2021", genre: "Thriller, Drama, Action", rating: 8.0, image: "/images/poster_2.png", director: "Hwang Dong-hyuk", type: "tv", region: "South Korea", language: "Korean", cast: ["Lee Jung-jae", "Park Hae-soo", "Jung Ho-yeon"] }
];

export const ACTOR_CATALOG = [
  { id: 1, name: "Timothée Chalamet", image: "/images/actor_1.png", facts: { nationality: "American/French", debut: "2008" } },
  { id: 2, name: "Zendaya", image: "/images/actor_1.png", facts: { nationality: "American", debut: "2009" } },
  { id: 3, name: "Austin Butler", image: "/images/actor_1.png", facts: { nationality: "American", debut: "2005" } },
  { id: 4, name: "Cillian Murphy", image: "/images/actor_1.png", facts: { nationality: "Irish", debut: "1996" } },
  { id: 5, name: "Emma Stone", image: "/images/actor_1.png", facts: { nationality: "American", debut: "2004" } },
  { id: 6, name: "Mark Ruffalo", image: "/images/actor_1.png", facts: { nationality: "American", debut: "1989" } },
  { id: 7, name: "Leonardo DiCaprio", image: "/images/actor_1.png", facts: { nationality: "American", debut: "1989" } },
  { id: 8, name: "Christian Bale", image: "/images/actor_1.png", facts: { nationality: "British", debut: "1986" } }
];

export const GENRE_CATALOG = [
  "Action", "Sci-Fi", "Drama", "Comedy", "Thriller", "Horror", "Romance", "Adventure", "Crime", "Mystery", "History"
];

const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      chats: {
        "Liam": [
          { sender: "Liam", text: "Hey there! Did you catch Oppenheimer yet? Nolan's cinematography is out of this world.", timestamp: new Date(Date.now() - 3600000 * 2).toISOString() },
          { sender: "You", text: "Yes! The Trinity test scene was absolutely breathtaking.", timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString() },
          { sender: "Liam", text: "Agreed. The sound design in that sequence was pure genius. What did you think of the score?", timestamp: new Date(Date.now() - 3600000).toISOString() }
        ],
        "Sophia": [
          { sender: "Sophia", text: "Have you seen Dune: Part Two? Villeneuve is a master of scale.", timestamp: new Date(Date.now() - 3600000 * 5).toISOString() },
          { sender: "You", text: "Not yet, is it as good as the first one?", timestamp: new Date(Date.now() - 3600000 * 4.5).toISOString() },
          { sender: "Sophia", text: "It's even better. The arena scene in black and white is a masterpiece. You have to watch it ASAP!", timestamp: new Date(Date.now() - 3600000 * 4).toISOString() }
        ]
      },
      following: [],
      followRequests: [],

      signup: (name, email, password, username, bio) => {
        const finalUsername = username ? (username.startsWith('@') ? username : `@${username}`) : `@${name.toLowerCase().replace(/\s+/g, '_')}`;
        const finalBio = bio || "Cinephile exploring the world of cinema.";
        const newUser = {
          name,
          username: finalUsername,
          email,
          bio: finalBio,
          avatar: "/images/actor_1.png",
          favoriteMovies: [],
          watchlist: [],
          watchedMovies: [],
          favoriteActors: [],
          favoriteGenres: [],
          ratings: [],
          reviews: [],
          customLists: [],
          cinephileScore: 100, // base signup score
          streak: 1
        };

        set({
          user: newUser,
          isAuthenticated: true
        });
      },

      login: (email, password) => {
        const name = "Alex Mercer";
        const username = "@alex_cinephile";
        const mockUser = {
          name,
          username,
          email,
          bio: "Exploring the world one frame at a time. Lover of classic noir and sci-fi epics.",
          avatar: "/images/actor_1.png",
          favoriteMovies: MOVIE_CATALOG.slice(0, 3),
          watchlist: MOVIE_CATALOG.slice(3, 8),
          watchedMovies: MOVIE_CATALOG.slice(0, 5),
          favoriteActors: ACTOR_CATALOG.slice(0, 3).map(a => a.name),
          favoriteGenres: ["Sci-Fi", "Drama", "Thriller"],
          ratings: [
            { id: 1, title: "Dune: Part Two", rating: 9 },
            { id: 2, title: "Oppenheimer", rating: 10 }
          ],
          reviews: [
            { id: 1, movieId: 2, text: "Oppenheimer is a landmark achievement in modern cinema. Nolan orchestrates sound and light like a maestro.", date: new Date(Date.now() - 86400000).toISOString() }
          ],
          customLists: [
            { id: 101, name: "Nolan Collection", movies: [MOVIE_CATALOG[1], MOVIE_CATALOG[11], MOVIE_CATALOG[14]] },
            { id: 102, name: "Sci-Fi Favorites", movies: [MOVIE_CATALOG[0], MOVIE_CATALOG[8]] }
          ],
          cinephileScore: 8950,
          streak: 14
        };

        set({
          user: mockUser,
          isAuthenticated: true
        });
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false
        });
      },

      updateProfile: (name, bio, avatar) => {
        const currentUser = get().user;
        if (!currentUser) return;
        set({
          user: {
            ...currentUser,
            name: name || currentUser.name,
            bio: bio || currentUser.bio,
            avatar: avatar || currentUser.avatar
          }
        });
      },

      createCustomList: (name) => {
        const currentUser = get().user;
        if (!currentUser) return;
        const currentLists = currentUser.customLists || [];
        const newList = {
          id: Date.now(),
          name,
          movies: []
        };
        set({
          user: {
            ...currentUser,
            customLists: [...currentLists, newList]
          }
        });
      },

      deleteCustomList: (id) => {
        const currentUser = get().user;
        if (!currentUser) return;
        const currentLists = currentUser.customLists || [];
        set({
          user: {
            ...currentUser,
            customLists: currentLists.filter(l => l.id !== id)
          }
        });
      },

      addMovieToCustomList: (listId, movie) => {
        const currentUser = get().user;
        if (!currentUser) return;
        const currentLists = currentUser.customLists || [];
        const updatedLists = currentLists.map(list => {
          if (list.id === listId) {
            const exists = list.movies.some(m => m.id === movie.id);
            if (exists) return list;
            return {
              ...list,
              movies: [...list.movies, movie]
            };
          }
          return list;
        });
        set({
          user: {
            ...currentUser,
            customLists: updatedLists
          }
        });
      },

      removeMovieFromCustomList: (listId, movieId) => {
        const currentUser = get().user;
        if (!currentUser) return;
        const currentLists = currentUser.customLists || [];
        const updatedLists = currentLists.map(list => {
          if (list.id === listId) {
            return {
              ...list,
              movies: list.movies.filter(m => m.id !== movieId)
            };
          }
          return list;
        });
        set({
          user: {
            ...currentUser,
            customLists: updatedLists
          }
        });
      },

      saveOnboarding: (favoriteMovies, watchlist, watchedMovies, favoriteActors, favoriteGenres) => {
        const currentUser = get().user;
        if (!currentUser) return;

        // Calculate a personalized Cinephile Score based on selections
        const score = 100 + (watchedMovies.length * 50) + (watchlist.length * 20);

        const updatedUser = {
          ...currentUser,
          favoriteMovies,
          watchlist,
          watchedMovies,
          favoriteActors,
          favoriteGenres,
          cinephileScore: score
        };

        set({ user: updatedUser });
      },

      toggleMovieWatchlist: (movie) => {
        const currentUser = get().user;
        if (!currentUser) return;

        const exists = currentUser.watchlist.some(m => m.id === movie.id);
        const updatedWatchlist = exists
          ? currentUser.watchlist.filter(m => m.id !== movie.id)
          : [...currentUser.watchlist, movie];

        // Recalculate score slightly on watchlist action
        const scoreDiff = exists ? -20 : 20;

        set({
          user: {
            ...currentUser,
            watchlist: updatedWatchlist,
            cinephileScore: currentUser.cinephileScore + scoreDiff
          }
        });
      },

      toggleMovieLiked: (movie) => {
        const currentUser = get().user;
        if (!currentUser) return;

        const exists = currentUser.favoriteMovies.some(m => m.id === movie.id);
        const updatedLikes = exists
          ? currentUser.favoriteMovies.filter(m => m.id !== movie.id)
          : [...currentUser.favoriteMovies, movie];

        set({
          user: {
            ...currentUser,
            favoriteMovies: updatedLikes
          }
        });
      },

      toggleMovieWatched: (movie) => {
        const currentUser = get().user;
        if (!currentUser) return;

        const exists = currentUser.watchedMovies.some(m => m.id === movie.id);
        const updatedWatched = exists
          ? currentUser.watchedMovies.filter(m => m.id !== movie.id)
          : [...currentUser.watchedMovies, movie];

        const scoreDiff = exists ? -50 : 50;

        set({
          user: {
            ...currentUser,
            watchedMovies: updatedWatched,
            cinephileScore: currentUser.cinephileScore + scoreDiff
          }
        });
      },

      addMovieRating: (movie, ratingValue) => {
        const currentUser = get().user;
        if (!currentUser) return;

        const alreadyRated = currentUser.ratings.some(r => r.id === movie.id);
        const otherRatings = currentUser.ratings.filter(r => r.id !== movie.id);
        const updatedRatings = [...otherRatings, { id: movie.id, title: movie.title, rating: ratingValue }];

        // Award +15 points only on first rating of this movie
        const scoreDiff = alreadyRated ? 0 : 15;

        set({
          user: {
            ...currentUser,
            ratings: updatedRatings,
            cinephileScore: currentUser.cinephileScore + scoreDiff
          }
        });
      },

      addReviewPoints: (movieId, commentText) => {
        const currentUser = get().user;
        if (!currentUser) return;

        const reviews = currentUser.reviews || [];
        const updatedReviews = [...reviews, { id: Date.now(), movieId, text: commentText, date: new Date().toISOString() }];

        set({
          user: {
            ...currentUser,
            reviews: updatedReviews,
            cinephileScore: currentUser.cinephileScore + 30
          }
        });
      },

      sendMessage: (contactName, text) => {
        const chats = get().chats || {};
        const conversation = chats[contactName] || [];
        const updatedConversation = [
          ...conversation,
          { sender: "You", text, timestamp: new Date().toISOString() }
        ];
        
        set({
          chats: {
            ...chats,
            [contactName]: updatedConversation
          }
        });

        // Trigger simulated response
        setTimeout(() => {
          const currentChats = get().chats || {};
          const currentConversation = currentChats[contactName] || [];
          
          const liamReplies = [
            "I totally get that. Christopher Nolan really knows how to build suspense.",
            "Have you seen his other film, Inception? It's one of my absolute favorites.",
            "I love how he uses practical effects instead of relying solely on CGI.",
            "What's your favorite sci-fi movie of all time?"
          ];
          const sophiaReplies = [
            "Definitely! Hans Zimmer's soundtrack also adds so much depth to the experience.",
            "I can't wait for Denis Villeneuve's next project.",
            "Poor Things was another visually stunning movie from Yorgos Lanthimos. Did you watch it?",
            "Honestly, that performance was Oscar-worthy."
          ];
          const defaultReplies = [
            "Hey! That's really interesting. What other movies are you planning to watch this weekend?",
            "Thanks for sharing! We should discuss more about this on the community page.",
            "Oh, I completely agree with your take!",
            "Fascinating perspective! What did you think about the cinematography?"
          ];

          let replies = defaultReplies;
          if (contactName.toLowerCase().includes("liam")) replies = liamReplies;
          else if (contactName.toLowerCase().includes("sophia")) replies = sophiaReplies;

          const randomReply = replies[Math.floor(Math.random() * replies.length)];
          const replyMsg = { sender: contactName, text: randomReply, timestamp: new Date().toISOString() };

          set({
            chats: {
              ...currentChats,
              [contactName]: [...currentConversation, replyMsg]
            }
          });
        }, 1500);
      },

      toggleFollowUser: (username) => {
        const following = get().following || [];
        const followRequests = get().followRequests || [];
        
        // Simulating private accounts
        const privateHandles = ["@sophia_b", "@ava_g", "@caleb_r", "@grace_y"];
        const isPrivate = privateHandles.includes(username);
        
        if (following.includes(username)) {
          // Unfollow
          set({
            following: following.filter(u => u !== username)
          });
        } else if (followRequests.includes(username)) {
          // Cancel follow request
          set({
            followRequests: followRequests.filter(u => u !== username)
          });
        } else {
          if (isPrivate) {
            // Send request
            set({
              followRequests: [...followRequests, username]
            });
          } else {
            // Follow immediately
            set({
              following: [...following, username]
            });
          }
        }
      },

      awardPoints: (amount) => {
        const currentUser = get().user;
        if (!currentUser) return;
        set({
          user: {
            ...currentUser,
            cinephileScore: currentUser.cinephileScore + amount
          }
        });
      }
    }),
    {
      name: 'cinelith-user-storage'
    }
  )
);

export default useUserStore;
