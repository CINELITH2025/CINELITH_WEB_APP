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

/* ================= AUTH ================= */

async function signup() {
  const name = readlineSync.question("Name: ");
  const email = readlineSync.question("Email: ");
  const password = readlineSync.question("Password: ", { hideEchoBack: true });

  await axios.post(`${API}/api/auth/register`, { name, email, password });
  console.log("✅ Signup successful");
}

async function login() {
  const email = readlineSync.question("Email: ");
  const password = readlineSync.question("Password: ", { hideEchoBack: true });

  const res = await axios.post(`${API}/api/auth/login`, { email, password });
  token = res.data.token;

  const me = await axios.get(`${API}/api/users/me`, authHeader());
  myProfile = me.data;

  console.log(`✅ Logged in as ${myProfile.name}`);

  socket = io(API);
  socket.emit("join", String(myProfile._id));

  socket.on("receive_message", (msg) => {
    console.log(`📩 ${msg.senderName}: ${msg.text}`);
  });
}

/* ================= PROFILE ================= */

async function viewProfile() {
  const res = await axios.get(`${API}/api/users/me`, authHeader());
  myProfile = res.data;

  console.log(`\n👤 Profile: ${myProfile.name}`);

  console.log("\n❤️ Liked:");
  (myProfile.favoriteMovies || []).forEach(m =>
    console.log(`- ${m.title} (${m.type})`)
  );

  console.log("\n📺 Watchlist:");
  (myProfile.watchlist || []).forEach(m =>
    console.log(`- ${m.title} (${m.type})`)
  );

  console.log("\n⭐ Ratings:");
  (myProfile.ratings || []).forEach(r =>
    console.log(`- ${r.title} (${r.type}) → ${r.rating}/10`)
  );
}

/* ================= SEARCH ================= */

async function searchMovies() {
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
