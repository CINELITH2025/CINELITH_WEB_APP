import axios from "axios";
import readlineSync from "readline-sync";
import readline from "readline";
import { io } from "socket.io-client";
import http from "http";

const API = "http://localhost:5050";
axios.defaults.httpAgent = new http.Agent({ keepAlive: false });

let token = null;
let myProfile = null;
let socket = null;
let inChat = false;

const authHeader = () => ({
  headers: { Authorization: `Bearer ${token}` }
});

const requireAuth = () => {
  if (!token) {
    console.log("❌ Please sign up or log in first (options 1 or 2)");
    return false;
  }
  return true;
};

async function establishSession(email, password) {
  const res = await axios.post(`${API}/api/auth/login`, { email, password });
  token = res.data.token;

  const me = await axios.get(`${API}/api/users/me`, authHeader());
  myProfile = me.data;

  if (socket) {
    socket.disconnect();
  }

  socket = io(API);
  socket.emit("join", String(myProfile._id));

  socket.on("receive_message", (msg) => {
    console.log(`📩 ${msg.senderName}: ${msg.text}`);
  });

  return myProfile;
}

/* ================= AUTH ================= */

const parseCommaList = (prompt) =>
  readlineSync
    .question(prompt)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

async function collectOnboardingPreferences() {
  console.log("\n--- Onboarding ---");

  const bio = readlineSync.question("Bio (optional): ");
  const location = readlineSync.question("Location (optional): ");
  const topGenres = parseCommaList("Favorite genres (comma-separated, e.g. Action, Drama): ");
  const preferredLanguages = parseCommaList("Preferred languages (comma-separated, e.g. English, Hindi): ");
  const preferredPlatforms = parseCommaList("Preferred platforms (comma-separated, e.g. Netflix, Prime): ");

  const topMovies = [];
  const movieCount = readlineSync.questionInt("How many favorite movies/series? (0-5): ", {
    limit: [0, 5]
  });

  for (let i = 0; i < movieCount; i++) {
    console.log(`\nFavorite ${i + 1}:`);
    const title = readlineSync.question("  Title: ");
    const type = readlineSync.question("  Type (movie/series): ");
    const tvdbId = readlineSync.questionInt("  TVDB ID: ");
    topMovies.push({ title, type, tvdbId });
  }

  const topActors = [];
  const actorCount = readlineSync.questionInt("How many favorite actors? (0-5): ", {
    limit: [0, 5]
  });

  for (let i = 0; i < actorCount; i++) {
    console.log(`\nActor ${i + 1}:`);
    const actorName = readlineSync.question("  Name: ");
    const tvdbIdInput = readlineSync.question("  TVDB ID (optional, press Enter to skip): ");
    const actor = { name: actorName };
    if (tvdbIdInput.trim()) {
      actor.tvdbId = Number(tvdbIdInput);
    }
    topActors.push(actor);
  }

  return {
    bio,
    location,
    topGenres,
    topMovies,
    topActors,
    preferredLanguages,
    preferredPlatforms
  };
}

async function signup() {
  console.log("\n--- Account Details ---");
  const name = readlineSync.question("Name: ");
  const email = readlineSync.question("Email: ");
  const password = readlineSync.question("Password: ", { hideEchoBack: true });

  const onboarding = await collectOnboardingPreferences();

  await axios.post(`${API}/api/auth/register`, {
    name,
    email,
    password,
    ...onboarding
  });

  const profile = await establishSession(email, password);
  console.log(`✅ Signup complete — logged in as ${profile.name}`);
}

async function login() {
  const email = readlineSync.question("Email: ");
  const password = readlineSync.question("Password: ", { hideEchoBack: true });

  const profile = await establishSession(email, password);
  console.log(`✅ Logged in as ${profile.name}`);
}

/* ================= PROFILE ================= */

const formatList = (items, formatter, emptyLabel = "  (none)") => {
  if (!items?.length) {
    console.log(emptyLabel);
    return;
  }
  items.forEach((item, i) => console.log(`  ${i + 1}. ${formatter(item)}`));
};

const formatValue = (value, fallback = "(not set)") =>
  value === null || value === undefined || value === "" ? fallback : value;

async function viewProfile() {
  if (!requireAuth()) return;

  const res = await axios.get(`${API}/api/users/me`, authHeader());
  myProfile = res.data;

  console.log("\n" + "=".repeat(40));
  console.log("           USER PROFILE");
  console.log("=".repeat(40));

  console.log("\n📋 Basic Information");
  console.log(`  ID:       ${myProfile._id}`);
  console.log(`  Name:     ${myProfile.name}`);
  console.log(`  Email:    ${myProfile.email}`);
  console.log(`  Avatar:   ${formatValue(myProfile.avatar)}`);
  console.log(`  Bio:      ${formatValue(myProfile.bio)}`);
  console.log(`  Location: ${formatValue(myProfile.location)}`);
  console.log(`  Joined:   ${myProfile.createdAt || "(unknown)"}`);

  console.log("\n🎯 Onboarding Preferences");
  console.log(`  Completed: ${myProfile.onboardingCompleted ? "Yes" : "No"}`);
  console.log("  Top Genres:");
  formatList(myProfile.topGenres, (g) => g);
  console.log("  Top Movies:");
  formatList(myProfile.topMovies, (m) => `${m.title} (${m.type}) [TVDB: ${m.tvdbId}]`);
  console.log("  Top Actors:");
  formatList(myProfile.topActors, (a) => `${a.name}${a.tvdbId ? ` [TVDB: ${a.tvdbId}]` : ""}`);
  console.log("  Preferred Languages:");
  formatList(myProfile.preferredLanguages, (l) => l);
  console.log("  Preferred Platforms:");
  formatList(myProfile.preferredPlatforms, (p) => p);

  console.log("\n🤝 Social");
  console.log(`  Friends:          ${myProfile.friends?.length || 0}`);
  formatList(myProfile.friends, (id) => id, "    (none)");
  console.log(`  Followers:        ${myProfile.followers?.length || 0}`);
  formatList(myProfile.followers, (id) => id, "    (none)");
  console.log(`  Following:        ${myProfile.following?.length || 0}`);
  formatList(myProfile.following, (id) => id, "    (none)");
  console.log(`  Pending Requests: ${myProfile.pendingRequests?.length || 0}`);
  formatList(myProfile.pendingRequests, (id) => id, "    (none)");

  console.log("\n🎬 Activity");
  console.log("  ❤️  Liked:");
  formatList(myProfile.favoriteMovies, (m) => `${m.title} (${m.type}) [TVDB: ${m.tvdbId}]`);
  console.log("  📺 Watchlist:");
  formatList(myProfile.watchlist, (m) => `${m.title} (${m.type}) [TVDB: ${m.tvdbId}]`);
  console.log("  ⭐ Ratings:");
  formatList(
    myProfile.ratings,
    (r) => `${r.title} (${r.type}) → ${r.rating}/10 [TVDB: ${r.tvdbId}]`
  );
  console.log("  📝 Reviews:");
  formatList(
    myProfile.reviews,
    (r) => `${r.title} (${r.type}) — "${r.content?.slice(0, 60)}${r.content?.length > 60 ? "..." : ""}"`
  );
  console.log("  👁️  Recently Viewed:");
  formatList(
    myProfile.recentlyViewed,
    (m) => `${m.title} (${m.type})${m.viewedAt ? ` @ ${m.viewedAt}` : ""}`
  );
  console.log("  📁 Collections:");
  if (!myProfile.collections?.length) {
    console.log("    (none)");
  } else {
    myProfile.collections.forEach((c, i) => {
      console.log(`  ${i + 1}. ${c.name}${c.description ? ` — ${c.description}` : ""}`);
      console.log(`     Movies: ${c.movies?.length || 0}`);
    });
  }

  console.log("\n📊 Analytics");
  console.log(`  Cinephile Score:  ${myProfile.cinephileScore ?? 0}`);
  console.log(`  Streak:           ${myProfile.streak ?? 0} days`);
  console.log(`  Quizzes Played:   ${myProfile.quizzesPlayed ?? 0}`);
  console.log(`  Quizzes Won:      ${myProfile.quizzesWon ?? 0}`);
  console.log(`  Movies Watched:   ${myProfile.moviesWatched ?? 0}`);
  console.log(`  Hours Watched:    ${myProfile.hoursWatched ?? 0}`);

  console.log("\n🧠 Recommendation");
  console.log(`  Version:          ${myProfile.recommendationVersion ?? 0}`);
  console.log(
    `  Last Updated:     ${formatValue(myProfile.lastRecommendationUpdate, "(never)")}`
  );
  console.log(
    `  Taste Vector:     ${
      myProfile.tasteVector?.length
        ? `[${myProfile.tasteVector.slice(0, 5).join(", ")}${myProfile.tasteVector.length > 5 ? ", ..." : ""}]`
        : "(empty)"
    }`
  );

  console.log("\n🔔 Notifications");
  console.log(`  Unread Count:     ${myProfile.unreadCount ?? 0}`);
  const prefs = myProfile.notificationPreferences || {};
  console.log("  Preferences:");
  console.log(`    Friend Requests:  ${prefs.friendRequests !== false ? "On" : "Off"}`);
  console.log(`    Messages:         ${prefs.messages !== false ? "On" : "Off"}`);
  console.log(`    Recommendations:  ${prefs.recommendations !== false ? "On" : "Off"}`);
  console.log(`    Streak Reminders: ${prefs.streakReminders !== false ? "On" : "Off"}`);

  console.log("\n" + "=".repeat(40));
}

/* ================= SEARCH ================= */

async function searchMovies() {
  if (!requireAuth()) return;

  const q = readlineSync.question("Search movie / series: ");
  const res = await axios.get(`${API}/api/search?q=${q}`, authHeader());

  console.log("\n🎬 Movies / Series:");
  res.data.movies_series.forEach((m, i) => {
    console.log(
      `${i + 1}. ${m.name || m.title} (${m.type}) | ID: ${m.tvdb_id || m.id}`
    );
  });
}

async function searchPeopleAndConnect() {
  if (!requireAuth()) return;

  const q = readlineSync.question("Search people: ");
  const res = await axios.get(`${API}/api/search?q=${q}`, authHeader());

  const people = res.data.people || [];

  if (!people.length) {
    console.log("No users found");
    return;
  }

  console.log("\n👤 People:");
  people.forEach((p, i) => {
    console.log(`${i + 1}. ${p.name} | ID: ${p._id}`);
  });

  const choice = readlineSync.questionInt(
    "\nEnter number to CONNECT (0 to cancel): "
  );

  if (choice === 0) return;

  const selected = people[choice - 1];

  await axios.post(
    `${API}/api/users/connect/${selected._id}`,
    {},
    authHeader()
  );

  console.log(`🤝 Connected with ${selected.name}`);
}

/* ================= CHAT ================= */

function startChat(friendId) {
  return new Promise((resolve) => {
    inChat = true;
    console.log("🟢 Chat started (type 'exit' to leave)");

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.on("line", (text) => {
      if (text === "exit") {
        rl.close();
        inChat = false;
        resolve();
        return;
      }

      socket.emit("send_message", {
        senderId: String(myProfile._id),
        senderName: myProfile.name,
        receiverId: String(friendId),
        text
      });
    });
  });
}

async function chatWithConnections() {
  if (!requireAuth()) return;

  const res = await axios.get(`${API}/api/users/me`, authHeader());
  myProfile = res.data;

  if (!myProfile.friends || myProfile.friends.length === 0) {
    console.log("❌ You have no connections");
    return;
  }

  console.log("\n💬 Your Connections:");
  myProfile.friends.forEach((f, i) => {
    console.log(`${i + 1}. ${f}`);
  });

  const choice = readlineSync.questionInt(
    "\nChoose connection number (0 to cancel): "
  );

  if (choice === 0) return;

  await startChat(myProfile.friends[choice - 1]);
}

/* ================= LIKE / WATCHLIST / RATE ================= */

async function likeMovie() {
  if (!requireAuth()) return;

  const tvdbId = readlineSync.questionInt("Enter TVDB ID: ");
  const type = readlineSync.question("Type (movie/series): ");
  const title = readlineSync.question("Enter title (from search): ");

  await axios.post(
    `${API}/api/users/like`,
    { tvdbId, title, type },
    authHeader()
  );

  console.log(`❤️ Liked: ${title}`);
}

async function addToWatchlist() {
  if (!requireAuth()) return;

  const tvdbId = readlineSync.questionInt("Enter TVDB ID: ");
  const type = readlineSync.question("Type (movie/series): ");
  const title = readlineSync.question("Enter title: ");

  await axios.post(
    `${API}/api/users/watchlist`,
    { tvdbId, title, type },
    authHeader()
  );

  console.log(`📺 Added to watchlist: ${title}`);
}

async function rateMovie() {
  if (!requireAuth()) return;

  const tvdbId = readlineSync.questionInt("Enter TVDB ID: ");
  const type = readlineSync.question("Type (movie/series): ");
  const title = readlineSync.question("Enter title: ");
  const rating = readlineSync.questionInt("Rating (0–10): ");

  await axios.post(
    `${API}/api/users/rate`,
    { tvdbId, title, type, rating },
    authHeader()
  );

  console.log(`⭐ Rated ${title}: ${rating}/10`);
}

/* ================= MAIN MENU ================= */

async function mainMenu() {
  while (true) {
    if (inChat) continue;

    console.log(`
============================
 CINELITH TERMINAL CLIENT
============================
1. Sign up
2. Login
3. View profile
4. Search movies / series
5. Search people & connect
6. Chat with connections
7. Like movie / series
8. Add to watchlist
9. Rate movie
0. Exit
`);

    const choice = readlineSync.question("Choose option: ");

    try {
      if (choice === "1") await signup();
      else if (choice === "2") await login();
      else if (choice === "3") await viewProfile();
      else if (choice === "4") await searchMovies();
      else if (choice === "5") await searchPeopleAndConnect();
      else if (choice === "6") await chatWithConnections();
      else if (choice === "7") await likeMovie();
      else if (choice === "8") await addToWatchlist();
      else if (choice === "9") await rateMovie();
      else if (choice === "0") process.exit(0);
      else console.log("Invalid option");
    } catch (err) {
      console.log("❌ Error:", err.response?.data || err.message);
    }
  }
}

mainMenu();
