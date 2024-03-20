const NAME = document.getElementById("name");
const start = document.getElementById("START");
const instructionDialog = document.getElementById("instructionDialog");
const instruction = document.getElementById("instruction");
const closeDialog = document.getElementById("closeDialog");

instruction.addEventListener("click", () => {
  instructionDialog.showModal();
});

closeDialog.addEventListener("click", () => {
  instructionDialog.close();
});

start.onclick = () => {
  localStorage.setItem("Name", NAME.value);
  location.href = "./game.html";
};
