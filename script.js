let notes = JSON.parse(localStorage.getItem("notes")) || [];

function save() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

/* 🌙 THEME */
function toggleTheme() {
  document.body.classList.toggle("dark");

  const toggle = document.getElementById("themeToggle");
  localStorage.setItem("theme", toggle.checked ? "dark" : "light");
}

/* LOAD */
window.onload = () => {
  const saved = localStorage.getItem("theme");
  const toggle = document.getElementById("themeToggle");

  if (saved === "dark") {
    document.body.classList.add("dark");
    if (toggle) toggle.checked = true;
  }

  render();
};

/* ADD NOTE */
function addNote() {
  const input = document.getElementById("input");
  const text = input.value.trim();

  if (!text) return;

  notes.push({
    id: Date.now(),
    text,
    date: new Date().toLocaleString(),
    edited: false,
    pinned: false
  });

  input.value = "";

  save();
  render();
}

/* RENDER */
function render() {
  const container = document.getElementById("notes");
  container.innerHTML = "";

    notes.sort((a, b) => Number(b.pinned) - Number(a.pinned));

    notes.sort((a, b) => {
    if (a.pinned && b.pinned) {
    return b.pinTime - a.pinTime;
  }

    if (a.pinned) return -1;
    if (b.pinned) return 1;

    return b.id - a.id;
});

  notes.forEach(note => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="menu">⋮</div>

      <div class="dropdown">
       <button onclick="editNote(${note.id})">
        <i class="fas fa-pen"></i> Редактировать
       </button>

       <button onclick="deleteNote(${note.id})">
        <i class="fas fa-trash"></i> Удалить
       </button>

      <button onclick="pinNote(${note.id})">
       <i class="fas fa-thumbtack"></i>
       ${note.pinned ? "Открепить" : "Закрепить"}
      </button>

      </div>

      ${note.pinned ? '<div class="pinned">📌 Закреплено</div>' : ""}

      <div class="text">${note.text}</div>

      <div class="date">
        ${note.date}
        ${note.edited ? " • Изменено" : ""}
      </div>
    `;

    const menu = card.querySelector(".menu");
    const dropdown = card.querySelector(".dropdown");

    menu.addEventListener("click", (e) => {
      e.stopPropagation();

      document.querySelectorAll(".dropdown").forEach(d => {
        if (d !== dropdown) {
          d.classList.remove("show");
        }
      });

      document.querySelectorAll(".card").forEach(c => {
        if (c !== card) {
          c.classList.remove("active");
        }
      });

      dropdown.classList.toggle("show");
      card.classList.toggle("active");
    });

    dropdown.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    container.appendChild(card);
  });
}

/* DELETE */
function deleteNote(id) {
  if (!confirm("Удалить заметку?")) return;

  notes = notes.filter(note => note.id !== id);

  save();
  render();
}

/* EDIT */
function editNote(id) {
  const note = notes.find(n => n.id === id);

  if (!note) return;

  const newText = prompt("Редактировать заметку:", note.text);

  if (newText === null) return;

  note.text = newText.trim();
  note.edited = true;
  note.date = new Date().toLocaleString();

  save();
  render();
}

/* PIN */
function pinNote(id) {
  const note = notes.find(n => n.id === id);

  if (!note) return;

  if (!note.pinned) {
    note.pinned = true;
    note.pinTime = Date.now();
  } else {
    note.pinned = false;
    note.pinTime = 0;
  }

  save();
  render();
}

/* CLOSE MENUS */
document.addEventListener("click", () => {
  document.querySelectorAll(".dropdown").forEach(d => {
    d.classList.remove("show");
  });

  document.querySelectorAll(".card").forEach(c => {
    c.classList.remove("active");
  });
});