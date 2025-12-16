const searchBtn = document.getElementById("searchBtn");
const usernameInput = document.getElementById("username");

const profileDiv = document.getElementById("profile");
const errorDiv = document.getElementById("error");
const loadingDiv = document.getElementById("loading");

const avatar = document.getElementById("avatar");
const nameEl = document.getElementById("name");
const bioEl = document.getElementById("bio");
const reposEl = document.getElementById("repos");
const followersEl = document.getElementById("followers");
const followingEl = document.getElementById("following");

const suggestionsDiv = document.getElementById("suggestions");
const suggestionList = document.getElementById("suggestionList");

const API_URL = "https://api.github.com/users/";

async function fetchUser(username) {
  try {
    profileDiv.style.display = "none";
    errorDiv.style.display = "none";
    suggestionsDiv.style.display = "none";
    loadingDiv.style.display = "block";

    const res = await fetch(API_URL + username);
    if (!res.ok) throw new Error();

    const user = await res.json();
    showProfile(user);
    fetchSimilarUsers(username);
  } catch {
    errorDiv.style.display = "block";
  } finally {
    loadingDiv.style.display = "none";
  }
}

function showProfile(user) {
  profileDiv.style.display = "block";
  avatar.src = user.avatar_url;
  nameEl.textContent = user.name || user.login;
  bioEl.textContent = user.bio || "No bio available";
  reposEl.textContent = user.public_repos;
  followersEl.textContent = user.followers;
  followingEl.textContent = user.following;
}

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
        usernameInput.value = user.login;
        fetchUser(user.login);
      });

      suggestionList.appendChild(div);
    });

    if (data.items.length) {
      suggestionsDiv.style.display = "block";
    }
  } catch {}
}

searchBtn.addEventListener("click", search);
usernameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") search();
});

function search() {
  const username = usernameInput.value.trim();
  if (username) fetchUser(username);
}
