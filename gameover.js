const playagain = document.getElementById("gameover");
const score = document.getElementById("SCORE");
const NAME = document.getElementById("name");
const lostphrase = document.getElementById("lost");

lostphrase.innerHTML = localStorage.getItem("lostphrase");
score.innerHTML = localStorage.getItem("Score");
NAME.innerHTML = localStorage.getItem("Name");

playagain.onclick = () => {
  localStorage.removeItem("Score");
  localStorage.removeItem("Name");
  location.href = "./index.html";
};
