import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api, apiErrorMessage, getToken, setToken } from '../lib/api';
import { mapUser, mapChatMessage, toBackendMovie, toBackendActor } from '../lib/mapUser';
import { connectSocket, disconnectSocket, sendChatMessage } from '../lib/socket';

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
  { id: 1, name: "Timothée Chalamet", image: "/images/chalamet.jpg", facts: { nationality: "American/French", debut: "2008" } },
  { id: 2, name: "Zendaya", image: "/images/poster_4.jpg", facts: { nationality: "American", debut: "2009" } },
  { id: 3, name: "Austin Butler", image: "/images/poster_1.jpg", facts: { nationality: "American", debut: "2005" } },
  { id: 4, name: "Cillian Murphy", image: "/images/oppenheimer.jpg", facts: { nationality: "Irish", debut: "1996" } },
  { id: 5, name: "Emma Stone", image: "/images/lalaland.jpg", facts: { nationality: "American", debut: "2004" } },
  { id: 6, name: "Mark Ruffalo", image: "/images/poster_2.jpg", facts: { nationality: "American", debut: "1989" } },
  { id: 7, name: "Leonardo DiCaprio", image: "/images/inception.jpg", facts: { nationality: "American", debut: "1989" } },
  { id: 8, name: "Christian Bale", image: "/images/poster_3.jpg", facts: { nationality: "British", debut: "1986" } }
];

export const GENRE_CATALOG = [
  "Action", "Sci-Fi", "Drama", "Comedy", "Thriller", "Horror", "Romance", "Adventure", "Crime", "Mystery", "History"
];

const useUserStore = create(
  persist(
    (set, get) => {
      const applyUser = (raw) => {
        const user = mapUser(raw);
        set({
          user,
          isAuthenticated: Boolean(user),
          error: null
        });
        if (user?._id) {
          connectSocket(user._id, (msg) => get().receiveMessage(msg));
        }
        return user;
      };

      return {
      user: null,
      isAuthenticated: false,
      isReady: false,
      error: null,
      chats: {},
      following: [],
      followRequests: [],

      bootstrap: async () => {
        const token = getToken();
        if (!token) {
          set({ isReady: true, isAuthenticated: false, user: null });
          return;
        }
        try {
          const { data } = await api.get("/users/me");
          applyUser(data);
        } catch {
          setToken(null);
          disconnectSocket();
          set({ user: null, isAuthenticated: false });
        } finally {
          set({ isReady: true });
        }
      },

      signup: async (name, email, password, username, bio) => {
        const { data } = await api.post("/auth/register", {
          name,
          email,
          password,
          username: username ? username.replace(/^@/, "") : undefined,
          bio
        });
        setToken(data.token);
        return applyUser(data.user);
      },

      login: async (email, password) => {
        const { data } = await api.post("/auth/login", { email, password });
        setToken(data.token);
        if (data.user) return applyUser(data.user);
        const me = await api.get("/users/me");
        return applyUser(me.data);
      },

      logout: () => {
        setToken(null);
        disconnectSocket();
        set({
          user: null,
          isAuthenticated: false,
          chats: {},
          following: [],
          followRequests: [],
          error: null
        });
      },

      fetchMe: async () => {
        const { data } = await api.get("/users/me");
        return applyUser(data);
      },

      updateProfile: async (name, bio, avatar) => {
        const { data } = await api.patch("/users/me", { name, bio, avatar });
        return applyUser(data);
      },

      saveOnboarding: async (favoriteMovies, watchlist, watchedMovies, favoriteActors, favoriteGenres) => {
        const { data } = await api.put("/users/onboarding", {
          topMovies: favoriteMovies.map(toBackendMovie),
          topActors: favoriteActors.map(toBackendActor),
          topGenres: favoriteGenres,
          onboardingCompleted: true
        });

        await Promise.all(
          (watchlist || []).map((movie) =>
            api.post("/users/watchlist", toBackendMovie(movie)).catch(() => null)
          )
        );

        await Promise.all(
          (watchedMovies || []).map((movie) =>
            api.post("/users/recently-viewed", toBackendMovie(movie)).catch(() => null)
          )
        );

        await Promise.all(
          (favoriteMovies || []).map((movie) =>
            api.post("/users/like", toBackendMovie(movie)).catch(() => null)
          )
        );

        const me = await api.get("/users/me");
        return applyUser(me.data || data);
      },

      searchPeople: async (query = "") => {
        const { data } = await api.get("/search", { params: { q: query } });
        return data.people || [];
      },

      connectUser: async (userId) => {
        await api.post(`/users/connect/${userId}`);
        await get().fetchMe();
      },

      followUser: async (userId) => {
        await api.post(`/users/follow/${userId}`);
        await get().fetchMe();
      },

      toggleFollowUser: async (person) => {
        const id = person._id || person;
        if (!id) return;
        await get().followUser(id);
      },

      loadChat: async (friendId) => {
        const { data } = await api.get(`/chats/${friendId}`);
        const myId = get().user?._id;
        const messages = (data.messages || []).map((msg) => mapChatMessage(msg, myId));
        set({
          chats: {
            ...get().chats,
            [String(friendId)]: messages
          }
        });
        return messages;
      },

      sendMessage: (friendId, text) => {
        const user = get().user;
        if (!user) return;
        sendChatMessage({
          senderId: user._id,
          senderName: user.name,
          receiverId: String(friendId),
          text
        });
        const current = get().chats[String(friendId)] || [];
        set({
          chats: {
            ...get().chats,
            [String(friendId)]: [
              ...current,
              {
                sender: "You",
                senderId: user._id,
                senderName: user.name,
                text,
                timestamp: new Date().toISOString()
              }
            ]
          }
        });
      },

      receiveMessage: (msg) => {
        const user = get().user;
        if (!user) return;
        const myId = String(user._id);
        const friendId = String(msg.senderId) === myId ? String(msg.receiverId) : String(msg.senderId);
        const mapped = mapChatMessage(msg, myId);
        const current = get().chats[friendId] || [];
        const duplicate = current.some(
          (item) => item.text === mapped.text && item.timestamp === mapped.timestamp && item.senderId === mapped.senderId
        );
        if (duplicate) return;
        set({
          chats: {
            ...get().chats,
            [friendId]: [...current, mapped]
          }
        });
      },

      createCustomList: async (name) => {
        await api.post("/users/collections", { name, movies: [] });
        await get().fetchMe();
      },

      deleteCustomList: (id) => {
        const currentUser = get().user;
        if (!currentUser) return;
        set({
          user: {
            ...currentUser,
            customLists: (currentUser.customLists || []).filter((list) => list.id !== id)
          }
        });
      },

      addMovieToCustomList: (listId, movie) => {
        const currentUser = get().user;
        if (!currentUser) return;
        const currentLists = currentUser.customLists || [];
        set({
          user: {
            ...currentUser,
            customLists: currentLists.map((list) => {
              if (list.id !== listId) return list;
              if (list.movies.some((item) => item.id === movie.id)) return list;
              return { ...list, movies: [...list.movies, movie] };
            })
          }
        });
      },

      removeMovieFromCustomList: (listId, movieId) => {
        const currentUser = get().user;
        if (!currentUser) return;
        set({
          user: {
            ...currentUser,
            customLists: (currentUser.customLists || []).map((list) =>
              list.id === listId
                ? { ...list, movies: list.movies.filter((movie) => movie.id !== movieId) }
                : list
            )
          }
        });
      },

      toggleMovieWatchlist: async (movie) => {
        await api.post("/users/watchlist", toBackendMovie(movie));
        await get().fetchMe();
      },

      toggleMovieLiked: async (movie) => {
        await api.post("/users/like", toBackendMovie(movie));
        await get().fetchMe();
      },

      toggleMovieWatched: async (movie) => {
        await api.post("/users/recently-viewed", toBackendMovie(movie));
        await get().fetchMe();
      },

      addMovieRating: async (movie, ratingValue) => {
        await api.post("/users/rate", { ...toBackendMovie(movie), rating: ratingValue });
        await get().fetchMe();
      },

      addReviewPoints: async (movieId, commentText) => {
        const currentUser = get().user;
        if (!currentUser) return;
        await api.post("/users/review", {
          tvdbId: Number(movieId) || 0,
          title: String(movieId),
          type: "movie",
          content: commentText
        }).catch(() => null);
        set({
          user: {
            ...currentUser,
            reviews: [...(currentUser.reviews || []), { id: Date.now(), movieId, text: commentText, date: new Date().toISOString() }],
            cinephileScore: currentUser.cinephileScore + 30
          }
        });
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
    };
    },
    {
      name: "cinelith-user-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

export default useUserStore;
