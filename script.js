let notes = JSON.parse(localStorage.getItem("notes")) || [];

let editingId = null;
let deletingId = null;

/* DATE */
function getDateTime() {
  return new Date().toLocaleString();
}

/* SAVE */
function save() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

/* THEME */
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
  const text = input.value;

  if (!text.trim()) return;

  notes.push({
    id: Date.now(),
    text,
    createdAt: getDateTime(),
    updatedAt: null,
    edited: false,
    pinned: false,
    pinTime: 0
  });

  save();
  render();

  input.value = "";
}

/* RENDER */
function render() {
  const container = document.getElementById("notes");
  container.innerHTML = "";

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
        <button onclick="editNote(${note.id})">Редактировать</button>
        <button onclick="deleteNote(${note.id})">Удалить</button>
        <button onclick="pinNote(${note.id})">
          ${note.pinned ? "Открепить" : "Закрепить"}
        </button>
      </div>

      ${note.pinned ? '<div class="pinned">📌 Закреплено</div>' : ""}

      <div class="text">${note.text}</div>

      <div class="date">
        <small>Создано: ${note.createdAt}</small>
        ${note.edited ? `<br><small>Изменено: ${note.updatedAt}</small>` : ""}
      </div>
    `;

    const menu = card.querySelector(".menu");
    const dropdown = card.querySelector(".dropdown");

    menu.addEventListener("click", (e) => {
  e.stopPropagation();

  const isOpen = dropdown.classList.contains("show");

  // закрываем ВСЕ меню
  document.querySelectorAll(".dropdown").forEach(d => {
    d.classList.remove("show");
  });

  document.querySelectorAll(".card").forEach(c => {
    c.classList.remove("active");
  });

  // если оно БЫЛО открыто — просто закрываем и выходим
  if (isOpen) return;

  // иначе открываем
  card.classList.add("active");
  dropdown.classList.add("show");
});

    container.appendChild(card);
  });
}

/* DELETE */
function deleteNote(id) {
  deletingId = id;
  document.getElementById("deleteModal").classList.add("show");
}

function closeDeleteModal() {
  document.getElementById("deleteModal").classList.remove("show");
  deletingId = null;
}

function confirmDelete() {
  notes = notes.filter(n => n.id !== deletingId);

  save();
  render();
  closeDeleteModal();
}

/* EDIT */
function editNote(id) {
  const note = notes.find(n => n.id === id);

  editingId = id;
  document.getElementById("editInput").value = note.text;

  document.getElementById("editModal").classList.add("show");
}

/* CLOSE MODAL */
function closeModal() {
  document.getElementById("editModal").classList.remove("show");
}

/* SAVE EDIT */
function saveEdit() {
  const note = notes.find(n => n.id === editingId);

  const newText = document.getElementById("editInput").value;

  if (!note) return;

  if (note.text === newText) {
    closeModal();
    return;
  }

  note.text = newText;
  note.updatedAt = getDateTime();
  note.edited = true;

  save();
  render();
  closeModal();
}

/* PIN */
function pinNote(id) {
  const note = notes.find(n => n.id === id);

  if (!note) return;

  note.pinned = !note.pinned;
  note.pinTime = note.pinned ? Date.now() : 0;

  save();
  render();
}

/* CLOSE MENUS */
document.addEventListener("click", () => {
  document.querySelectorAll(".dropdown").forEach(d => {
    d.classList.remove("show");
  });
});