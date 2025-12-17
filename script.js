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
    usersuggestion.style.display = "none";
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
