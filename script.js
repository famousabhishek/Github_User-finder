// for searching user
const userInput = document.getElementById("username");
const searchBtn = document.getElementById("searchBtn");

// for github user profile
const profile = document.getElementById("profile");
const avatar = document.getElementById("avatar");
const userName = document.getElementById("name");
const userBio = document.getElementById("bio");

// for the show repos, followers and followings
const reposCount = document.getElementById("repos");
const followers = document.getElementById("followers");
const following = document.getElementById("following");

// for suggestion other github user
const userSuggestion = document.getElementById("suggestions");
const suggestionList = document.getElementById("suggestionList");

// Showing message when user does not found
const error = document.getElementById("error");
const loading = document.getElementById("loading");

// API
const API = "https://api.github.com/users/";

// async function for featching user information like profile
async function fetchUser(username) {
  // this will for some time API calls get fail like username can't find
  // so we write the risky code inside try block
  try {
    // for not disply first or not show any error
    profile.style.display = "none";
    error.style.display = "none";
    userSuggestion.style.display = "none";
    //only show this message loading
    loading.style.display = "block";

    const res = await fetch(API + username);
    if (!res.ok) throw new Error();

    const user = await res.json();
    showProfile(user);
    fetchSimilarUsers(username);
  } catch {
    error.style.display = "block";
  } finally {
    loading.style.display = "none";
  }
}

// for showing user profile on user interface
function showProfile(user) {
  profile.style.display = "block";
  avatar.src = user.avatar_url;
  userName.textContent = user.name || user.login;
  userbio.textContent = user.bio || "No bio available";
  reposCount.textContent = user.public_repos;
  followers.textContent = user.followers;
  following.textContent = user.following;
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
        userInput.value = user.login;
        fetchUser(user.login);
      });

      suggestionList.appendChild(div);
    });

    if (data.items.length) {
      suggestions.style.display = "block";
    }
  } catch {}
}

searchBtn.addEventListener("click", search);
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") search();
});

function search() {
  const username = userInput.value.trim();
  if (username) fetchUser(username);
}
