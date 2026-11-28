import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api, getToken, setToken } from '../lib/api';
import { mapUser, mapMovie, mapChatMessage, toBackendMovie, toBackendActor } from '../lib/mapUser';
import { connectSocket, disconnectSocket, getSocket, sendChatMessage } from '../lib/socket';

// Curated movie & TV show data helper to populate onboarding and explore
export const MOVIE_CATALOG = [
  { id: 1, title: "Dune: Part Two", year: "2024", genre: "Sci-Fi, Adventure", rating: 8.8, image: "/images/poster_4.jpg", director: "Denis Villeneuve", type: "movie", region: "United States", language: "English", cast: ["Timothée Chalamet", "Zendaya", "Austin Butler", "Florence Pugh"] },
  { id: 2, title: "Oppenheimer", year: "2023", genre: "Drama, History", rating: 8.9, image: "/images/poster_5.jpg", director: "Christopher Nolan", type: "movie", region: "United States", language: "English", cast: ["Cillian Murphy", "Emily Blunt", "Matt Damon", "Robert Downey Jr."] },
  { id: 3, title: "La La Land", year: "2016", genre: "Comedy, Drama, Music", rating: 8.0, image: "/images/poster_7.jpg", director: "Damien Chazelle", type: "movie", region: "United States", language: "English", cast: ["Emma Stone", "Ryan Gosling", "John Legend"] },
  { id: 4, title: "The Shawshank Redemption", year: "1994", genre: "Drama", rating: 9.3, image: "/images/poster_12.jpg", director: "Frank Darabont", type: "movie", region: "United States", language: "English", cast: ["Tim Robbins", "Morgan Freeman", "Bob Gunton"] },
  { id: 5, title: "The Matrix", year: "1999", genre: "Action, Sci-Fi", rating: 8.7, image: "/images/poster_10.jpg", director: "Lana Wachowski", type: "movie", region: "United States", language: "English", cast: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"] },
  { id: 6, title: "The Godfather", year: "1972", genre: "Crime, Drama", rating: 9.2, image: "/images/poster_13.jpg", director: "Francis Ford Coppola", type: "movie", region: "United States", language: "English", cast: ["Marlon Brando", "Al Pacino", "James Caan"] },
  { id: 7, title: "Pulp Fiction", year: "1994", genre: "Crime, Thriller", rating: 8.9, image: "/images/poster_8.jpg", director: "Quentin Tarantino", type: "movie", region: "United States", language: "English", cast: ["John Travolta", "Samuel L. Jackson", "Uma Thurman", "Bruce Willis"] },
  { id: 8, title: "Gladiator", year: "2000", genre: "Action, Adventure, Drama", rating: 8.5, image: "/images/poster_18.jpg", director: "Ridley Scott", type: "movie", region: "United States", language: "English", cast: ["Russell Crowe", "Joaquin Phoenix", "Connie Nielsen"] },
  { id: 9, title: "Django Unchained", year: "2012", genre: "Drama, Western", rating: 8.5, image: "/images/poster_19.jpg", director: "Quentin Tarantino", type: "movie", region: "United States", language: "English", cast: ["Jamie Foxx", "Christoph Waltz", "Leonardo DiCaprio"] },
  { id: 10, title: "Whiplash", year: "2014", genre: "Drama, Music", rating: 8.5, image: "/images/poster_15.jpg", director: "Damien Chazelle", type: "movie", region: "United States", language: "English", cast: ["Miles Teller", "J.K. Simmons", "Paul Reiser"] },
  { id: 11, title: "Spirited Away", year: "2001", genre: "Animation, Adventure, Family", rating: 8.6, image: "/images/poster_16.jpg", director: "Hayao Miyazaki", type: "movie", region: "Japan", language: "Japanese", cast: ["Rumi Hiiragi", "Miyu Irino", "Mari Natsuki"] },
  { id: 12, title: "The Dark Knight", year: "2008", genre: "Action, Crime, Thriller", rating: 9.0, image: "/images/poster_3.jpg", director: "Christopher Nolan", type: "movie", region: "United States", language: "English", cast: ["Christian Bale", "Heath Ledger", "Gary Oldman"] },
  { id: 13, title: "Blade Runner 2049", year: "2017", genre: "Sci-Fi, Thriller", rating: 8.0, image: "/images/poster_14.jpg", director: "Denis Villeneuve", type: "movie", region: "United States", language: "English", cast: ["Ryan Gosling", "Harrison Ford", "Ana de Armas"] },
  { id: 14, title: "Inception", year: "2010", genre: "Action, Sci-Fi, Adventure", rating: 8.8, image: "/images/poster_2.jpg", director: "Christopher Nolan", type: "movie", region: "United States", language: "English", cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"] },
  { id: 15, title: "Interstellar", year: "2014", genre: "Sci-Fi, Drama", rating: 8.7, image: "/images/poster_1.jpg", director: "Christopher Nolan", type: "movie", region: "United States", language: "English", cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"] },
  { id: 16, title: "Parasite", year: "2019", genre: "Thriller, Drama, Comedy", rating: 8.6, image: "/images/poster_11.jpg", director: "Bong Joon Ho", type: "movie", region: "South Korea", language: "Korean", cast: ["Song Kang-ho", "Lee Sun-kyun", "Cho Yeo-jeong"] },
  { id: 17, title: "Fight Club", year: "1999", genre: "Drama, Thriller", rating: 8.8, image: "/images/poster_9.jpg", director: "David Fincher", type: "movie", region: "United States", language: "English", cast: ["Brad Pitt", "Edward Norton", "Helena Bonham Carter"] },
  { id: 18, title: "Barbie", year: "2023", genre: "Comedy, Fantasy, Adventure", rating: 7.8, image: "/images/poster_6.jpg", director: "Greta Gerwig", type: "movie", region: "United States", language: "English", cast: ["Margot Robbie", "Ryan Gosling", "America Ferrera"] },
  { id: 19, title: "Spider-Man: Into the Spider-Verse", year: "2018", genre: "Animation, Action, Sci-Fi", rating: 8.4, image: "/images/poster_17.jpg", director: "Peter Ramsey", type: "movie", region: "United States", language: "English", cast: ["Shameik Moore", "Jake Johnson", "Hailee Steinfeld"] },
  { id: 20, title: "Your Name.", year: "2016", genre: "Animation, Drama, Fantasy", rating: 8.4, image: "/images/poster_20.jpg", director: "Makoto Shinkai", type: "movie", region: "Japan", language: "Japanese", cast: ["Ryunosuke Kamiki", "Mone Kamishiraishi"] },
  { id: 21, title: "Inglourious Basterds", year: "2009", genre: "War, Drama, Adventure", rating: 8.3, image: "/images/poster_21.jpg", director: "Quentin Tarantino", type: "movie", region: "United States", language: "English", cast: ["Brad Pitt", "Christoph Waltz", "Michael Fassbender"] },
  { id: 22, title: "Avatar", year: "2009", genre: "Action, Adventure, Sci-Fi", rating: 7.9, image: "/images/poster_22.jpg", director: "James Cameron", type: "movie", region: "United States", language: "English", cast: ["Sam Worthington", "Zoe Saldana", "Sigourney Weaver"] },
  { id: 23, title: "Star Wars: A New Hope", year: "1977", genre: "Action, Adventure, Sci-Fi", rating: 8.6, image: "/images/poster_23.jpg", director: "George Lucas", type: "movie", region: "United States", language: "English", cast: ["Mark Hamill", "Harrison Ford", "Carrie Fisher"] },
  { id: 24, title: "The Lord of the Rings: The Fellowship of the Ring", year: "2001", genre: "Action, Adventure, Drama", rating: 8.8, image: "/images/poster_24.jpg", director: "Peter Jackson", type: "movie", region: "United States", language: "English", cast: ["Elijah Wood", "Ian McKellen", "Viggo Mortensen"] },
  { id: 25, title: "Forrest Gump", year: "1994", genre: "Drama, Romance", rating: 8.8, image: "/images/poster_25.jpg", director: "Robert Zemeckis", type: "movie", region: "United States", language: "English", cast: ["Tom Hanks", "Robin Wright", "Gary Sinise"] }
];

export const ACTOR_CATALOG = [
  { id: 1, name: "Timothée Chalamet", image: "/images/chalamet.jpg", facts: { nationality: "American/French", debut: "2008" } },
  { id: 2, name: "Zendaya", image: "/images/poster_4.jpg", facts: { nationality: "American", debut: "2009" } },
  { id: 3, name: "Austin Butler", image: "/images/poster_4.jpg", facts: { nationality: "American", debut: "2005" } },
  { id: 4, name: "Cillian Murphy", image: "/images/oppenheimer.jpg", facts: { nationality: "Irish", debut: "1996" } },
  { id: 5, name: "Emma Stone", image: "/images/lalaland.jpg", facts: { nationality: "American", debut: "2004" } },
  { id: 6, name: "Mark Ruffalo", image: "/images/actor_1.png", facts: { nationality: "American", debut: "1989" } },
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
          connectSocket((msg) => get().receiveMessage(msg));
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

      searchRecommendMovies: async (query = "") => {
        const { data } = await api.get("/catalog/movies", { params: { q: query, limit: 24 } });
        return data.movies || [];
      },

      fetchCatalog: async (params = {}) => {
        try {
          const { data } = await api.get("/catalog/movies", { params });
          if (data && Array.isArray(data.movies)) return data;
        } catch { /* Use the local catalog when the API is unavailable. */ }
        let list = params.type === "series" ? [] : [...MOVIE_CATALOG];
        if (params.q) {
          const q = params.q.toLowerCase();
          list = list.filter(m => m.title.toLowerCase().includes(q) || m.genre?.toLowerCase().includes(q));
        }
        if (params.genre) {
          list = list.filter(m => m.genre?.toLowerCase().includes(params.genre.toLowerCase()));
        }
        if (params.year) {
          list = list.filter(m => String(m.year) === String(params.year));
        }
        if (params.sort === "alpha") list.sort((a, b) => a.title.localeCompare(b.title));
        if (params.sort === "year") list.sort((a, b) => Number(b.year) - Number(a.year));
        if (params.sort === "rating") list.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
        return { movies: list, total: list.length };
      },

      fetchCatalogFilters: async () => {
        try {
          const { data } = await api.get("/catalog/filters");
          if (data?.genres?.length) return data;
        } catch { /* Use curated filters when the API is unavailable. */ }
        const genres = Array.from(new Set(MOVIE_CATALOG.flatMap(m => m.genre?.split(",").map(s => s.trim()) || []))).filter(Boolean);
        const years = Array.from(new Set(MOVIE_CATALOG.map(m => m.year))).filter(Boolean).sort().reverse();
        return { genres, years };
      },

      searchCatalogPeople: async (query) => {
        const { data } = await api.get("/catalog/people", { params: { q: query } });
        return data.people || [];
      },

      fetchHomeCatalog: async () => {
        try {
          const { data } = await api.get("/catalog/home");
          if (data && (data.trending?.length || data.classics?.length)) return data;
        } catch { /* Fall through to the recommendation fallback. */ }
        return {
          trending: MOVIE_CATALOG.slice(0, 10),
          classics: MOVIE_CATALOG.slice(10, 20)
        };
      },

      fetchCatalogMovie: async (id) => {
        const { data } = await api.get(`/catalog/movies/${id}`);
        return data;
      },

      fetchCatalogSeries: async (id) => {
        const { data } = await api.get(`/catalog/series/${id}`);
        return data;
      },

      fetchMovieComments: async (id) => {
        const { data } = await api.get(`/catalog/movies/${id}/comments`);
        return data.comments || [];
      },

      postMovieComment: async (id, text, parentId = null) => {
        const { data } = await api.post(`/catalog/movies/${id}/comments`, { text, parentId });
        return data;
      },

      likeMovieComment: async (id, commentId) => {
        const { data } = await api.post(`/catalog/movies/${id}/comments/${commentId}/like`);
        return data;
      },

      fetchNotifications: async () => {
        const { data } = await api.get("/notifications");
        return data.notifications || [];
      },

      recommendMovie: async (movie) => {
        const { data } = await api.post("/recommend", {
          movieId: movie.movieId,
          title: movie.title,
          limit: 10
        });
        return data;
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

      sendMessage: async (friendId, text, share = null) => {
        const user = get().user;
        if (!user) return;
        const message = {
          senderId: user._id,
          senderName: user.name,
          receiverId: String(friendId),
          text,
          share
        };
        let savedMessage = null;
        if (getSocket()?.connected) {
          try {
            sendChatMessage(message);
          } catch {
            const { data } = await api.post(`/chats/${friendId}`, { text, share });
            savedMessage = mapChatMessage(data, user._id);
          }
        } else {
          const { data } = await api.post(`/chats/${friendId}`, { text, share });
          savedMessage = mapChatMessage(data, user._id);
        }
        const current = get().chats[String(friendId)] || [];
        set({
          chats: {
            ...get().chats,
            [String(friendId)]: [
              ...current,
              savedMessage || {
                sender: "You",
                senderId: user._id,
                senderName: user.name,
                text,
                share: share || null,
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

      deleteCustomList: async (id) => {
        await api.delete(`/users/collections/${id}`);
        await get().fetchMe();
      },

      addMovieToCustomList: async (listId, movie) => {
        const list = (get().user?.customLists || []).find((item) => String(item.id) === String(listId));
        if (!list || list.movies.some((item) => String(item.id) === String(movie.id))) return;
        await api.patch(`/users/collections/${listId}`, {
          movies: [...list.movies, toBackendMovie(movie)]
        });
        await get().fetchMe();
      },

      removeMovieFromCustomList: async (listId, movieId) => {
        const list = (get().user?.customLists || []).find((item) => String(item.id) === String(listId));
        if (!list) return;
        await api.patch(`/users/collections/${listId}`, {
          movies: list.movies.filter((movie) => String(movie.id) !== String(movieId)).map(toBackendMovie)
        });
        await get().fetchMe();
      },

      toggleMovieWatchlist: async (movie) => {
        get().patchLibrary("watchlist", movie);
        await api.post("/users/watchlist", { ...toBackendMovie(movie), toggle: true });
        await get().fetchMe();
      },

      toggleMovieLiked: async (movie) => {
        get().patchLibrary("favoriteMovies", movie);
        await api.post("/users/like", { ...toBackendMovie(movie), toggle: true });
        await get().fetchMe();
      },

      toggleMovieWatched: async (movie) => {
        get().patchLibrary("watchedMovies", movie);
        await api.post("/users/recently-viewed", { ...toBackendMovie(movie), toggle: true });
        await get().fetchMe();
      },

      patchLibrary: (field, movie) => {
        const currentUser = get().user;
        if (!currentUser) return;
        const key = String(movie?.id ?? movie?.tvdbId ?? movie?.movieId);
        const list = currentUser[field] || [];
        const exists = list.some((item) => String(item?.id ?? item?.tvdbId) === key);
        set({
          user: {
            ...currentUser,
            [field]: exists
              ? list.filter((item) => String(item?.id ?? item?.tvdbId) !== key)
              : [...list, mapMovie(movie)]
          }
        });
      },

      addMovieRating: async (movie, ratingValue) => {
        await api.post("/users/rate", { ...toBackendMovie(movie), rating: ratingValue });
        await get().fetchMe();
      },

      addReviewPoints: async (movieId, commentText, title) => {
        if (!get().user) return;
        await api.post("/users/review", {
          tvdbId: Number(movieId) || 0,
          title: title || String(movieId),
          type: "movie",
          content: commentText
        }).catch(() => null);
        await get().fetchMe();
      },

      recordActivity: async (kind, won = false) => {
        const { data } = await api.post("/users/activity", { kind, won });
        return applyUser(data);
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
