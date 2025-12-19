// ===== DOM ELEMENTS =====

// Search
const userInput = document.getElementById("username");
const searchBtn = document.getElementById("searchBtn");

// Profile
const profile = document.getElementById("profile");
const avatar = document.getElementById("avatar");
const userName = document.getElementById("name");
const userBio = document.getElementById("bio");

// Stats
const reposCount = document.getElementById("repos");
const followers = document.getElementById("followers");
const following = document.getElementById("following");

// Suggestions
const userSuggestion = document.getElementById("suggestions");
const suggestionList = document.getElementById("suggestionList");

// UI states
const error = document.getElementById("error");
const loading = document.getElementById("loading");

// API
const API = "https://api.github.com/users/";

// ===== FETCH USER =====
async function fetchUser(username) {
  try {
    profile.style.display = "none";
    error.style.display = "none";
    userSuggestion.style.display = "none";
    loading.style.display = "block";

    const res = await fetch(API + username);
    if (!res.ok) throw new Error("User not found");

    const user = await res.json();
    showProfile(user);
    fetchSimilarUsers(username);
  } catch {
    error.style.display = "block";
  } finally {
    loading.style.display = "none";
  }
}

// ===== SHOW PROFILE =====
function showProfile(user) {
  profile.style.display = "block";
  avatar.src = user.avatar_url;
  userName.textContent = user.name || user.login;
  userBio.textContent = user.bio || "No bio available";
  reposCount.textContent = user.public_repos;
  followers.textContent = user.followers;
  following.textContent = user.following;
}

// ===== FETCH SIMILAR USERS =====
async function fetchSimilarUsers(username) {
  try {
    const res = await fetch(
      `https://api.github.com/search/users?q=${username}&per_page=6`
    );
    const data = await res.json();

    suggestionList.innerHTML = "";

    data.items.forEach((user) => {
      const div = document.createElement("div");
      div.className = "suggest-user";

      div.innerHTML = `
        <img src="${user.avatar_url}" />
        <p>${user.login}</p>
      `;

      div.addEventListener("click", () => {
        userInput.value = user.login;
        fetchUser(user.login);
      });

      suggestionList.appendChild(div);
    });

    if (data.items.length) {
      userSuggestion.style.display = "block";
    }
  } catch {}
}

// ===== EVENTS =====
searchBtn.addEventListener("click", search);

userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") search();
});

function search() {
  const username = userInput.value.trim();
  if (username) fetchUser(username);
}
