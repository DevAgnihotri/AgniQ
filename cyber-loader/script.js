// Create matrix rain effect
const matrix = document.getElementById("matrix");
const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";

for (let i = 0; i < 50; i++) {
  const column = document.createElement("div");
  column.className = "matrix-column";
  column.style.left = `${i * 20}px`;
  column.style.animationDuration = `${Math.random() * 2 + 1}s`;

  let content = "";
  for (let j = 0; j < 50; j++) {
    content +=
      characters[Math.floor(Math.random() * characters.length)] + "<br>";
  }
  column.innerHTML = content;
  matrix.appendChild(column);
}

// Dynamically update status texts
function updateStatus() {
  const dots = ["", ".", "..", "..."];
  let dotIndex = 0;

  setInterval(() => {
    const progressText = document.querySelector(".progress-text");
    progressText.textContent = `QUANTUM CORE INITIALIZATION${dots[dotIndex]}`;
    dotIndex = (dotIndex + 1) % dots.length;
  }, 500);
}

updateStatus();