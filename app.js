/* ============================================
   PERSONAL DASHBOARD - app.js
   ============================================ */

/* ==========================================
   SECTION 1: THEME (Light / Dark Mode)
   Challenge: Light / Dark mode
   ========================================== */

const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const themeLabel = document.getElementById('themeLabel');

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  if (theme === 'dark') {
    themeIcon.textContent = '☀️';
    themeLabel.textContent = 'Light Mode';
  } else {
    themeIcon.textContent = '🌙';
    themeLabel.textContent = 'Dark Mode';
  }
}

function initTheme() {
  const saved = localStorage.getItem('theme') || 'light';
  applyTheme(saved);
}

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

/* ==========================================
   SECTION 2: GREETING (Time, Date, Name)
   Challenge: Custom name in greeting
   ========================================== */

const timeEl = document.getElementById('currentTime');
const dateEl = document.getElementById('currentDate');
const greetingText = document.getElementById('greetingText');
const nameDisplay = document.getElementById('nameDisplay');
const nameShown = document.getElementById('nameShown');
const nameInputGroup = document.getElementById('nameInputGroup');
const nameInput = document.getElementById('nameInput');
const saveNameBtn = document.getElementById('saveNameBtn');

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function getGreeting(hour) {
  if (hour >= 5 && hour < 12)  return 'Good Morning';
  if (hour >= 12 && hour < 17) return 'Good Afternoon';
  if (hour >= 17 && hour < 21) return 'Good Evening';
  return 'Good Night';
}

function getUserName() {
  return localStorage.getItem('userName') || '';
}

function saveUserName(name) {
  localStorage.setItem('userName', name.trim());
}

function updateClock() {
  const now = new Date();
  const h = now.getHours();
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;

  timeEl.textContent = `${String(h12).padStart(2, '0')}:${m}:${s} ${ampm}`;

  const day = DAYS[now.getDay()];
  const month = MONTHS[now.getMonth()];
  const date = now.getDate();
  const year = now.getFullYear();
  dateEl.textContent = `${day}, ${month} ${date}, ${year}`;

  const name = getUserName();
  const greeting = getGreeting(h);
  greetingText.textContent = name ? `${greeting}, ${name}! 👋` : `${greeting}! 👋`;
  nameShown.textContent = name ? name : 'Set your name';
}

nameDisplay.addEventListener('click', () => {
  nameInputGroup.classList.add('active');
  nameDisplay.style.display = 'none';
  nameInput.value = getUserName();
  nameInput.focus();
});

function saveAndCloseName() {
  const val = nameInput.value.trim();
  saveUserName(val);
  nameInputGroup.classList.remove('active');
  nameDisplay.style.display = '';
  updateClock();
  showToast(val ? `Name saved as "${val}"!` : 'Name cleared.', 'success');
}

saveNameBtn.addEventListener('click', saveAndCloseName);

nameInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') saveAndCloseName();
  if (e.key === 'Escape') {
    nameInputGroup.classList.remove('active');
    nameDisplay.style.display = '';
  }
});

/* ==========================================
   SECTION 3: FOCUS TIMER
   Challenge: Change Pomodoro time
   ========================================== */

const timerDisplay = document.getElementById('timerDisplay');
const timerCircle = document.getElementById('timerCircle');
const timerLabelEl = document.getElementById('timerLabel');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');
const durationInput = document.getElementById('durationInput');
const applyDurationBtn = document.getElementById('applyDurationBtn');

let timerInterval = null;
let timerRunning = false;
let totalSeconds = 25 * 60;
let remainingSeconds = 25 * 60;

function formatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function updateTimerDisplay() {
  timerDisplay.textContent = formatTime(remainingSeconds);
  const totalMins = Math.floor(totalSeconds / 60);
  timerLabelEl.textContent = `${totalMins} min focus`;
}

function startTimer() {
  if (timerRunning) return;
  timerRunning = true;
  timerCircle.classList.add('running');
  startBtn.disabled = true;
  stopBtn.disabled = false;

  timerInterval = setInterval(() => {
    remainingSeconds--;
    updateTimerDisplay();

    if (remainingSeconds <= 0) {
      clearInterval(timerInterval);
      timerRunning = false;
      timerCircle.classList.remove('running');
      startBtn.disabled = false;
      stopBtn.disabled = true;
      remainingSeconds = 0;
      showToast('⏰ Focus session complete! Great work!', 'success');
      // Try to notify via browser Notification API
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Focus session complete!', {
          body: 'Time to take a break.',
          icon: 'https://cdn.jsdelivr.net/npm/twemoji@latest/assets/72x72/23f0.png'
        });
      }
    }
  }, 1000);
}

function stopTimer() {
  if (!timerRunning) return;
  clearInterval(timerInterval);
  timerRunning = false;
  timerCircle.classList.remove('running');
  startBtn.disabled = false;
  stopBtn.disabled = true;
}

function resetTimer() {
  stopTimer();
  remainingSeconds = totalSeconds;
  updateTimerDisplay();
}

function applyDuration() {
  const mins = parseInt(durationInput.value, 10);
  if (isNaN(mins) || mins < 1 || mins > 180) {
    showToast('Please enter a duration between 1 and 180 minutes.', 'error');
    return;
  }
  stopTimer();
  totalSeconds = mins * 60;
  remainingSeconds = totalSeconds;
  updateTimerDisplay();
  showToast(`Timer set to ${mins} minute${mins !== 1 ? 's' : ''}.`, 'info');
}

startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);
applyDurationBtn.addEventListener('click', applyDuration);

durationInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') applyDuration();
});

// Request notification permission on load
if ('Notification' in window && Notification.permission === 'default') {
  Notification.requestPermission();
}

/* ==========================================
   SECTION 4: TO-DO LIST
   Challenge: Prevent duplicate tasks
   Challenge: Sort tasks
   ========================================== */

const todoInput = document.getElementById('todoInput');
const addTodoBtn = document.getElementById('addTodoBtn');
const todoListEl = document.getElementById('todoList');
const todoCount = document.getElementById('todoCount');
const sortSelect = document.getElementById('sortSelect');

let todos = [];

function loadTodos() {
  try {
    todos = JSON.parse(localStorage.getItem('todos')) || [];
  } catch {
    todos = [];
  }
}

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function getSortedTodos() {
  const sort = sortSelect.value;
  const copy = [...todos];
  if (sort === 'az') {
    copy.sort((a, b) => a.text.localeCompare(b.text));
  } else if (sort === 'za') {
    copy.sort((a, b) => b.text.localeCompare(a.text));
  } else if (sort === 'done') {
    copy.sort((a, b) => Number(b.done) - Number(a.done));
  } else if (sort === 'pending') {
    copy.sort((a, b) => Number(a.done) - Number(b.done));
  }
  // 'default' keeps insertion order
  return copy;
}

function renderTodos() {
  const sorted = getSortedTodos();
  todoListEl.innerHTML = '';

  if (sorted.length === 0) {
    todoListEl.innerHTML = `
      <li class="todo-empty">
        <span class="empty-icon">📋</span>
        No tasks yet. Add one above!
      </li>`;
    todoCount.textContent = '0 tasks';
    return;
  }

  const doneCount = todos.filter(t => t.done).length;
  todoCount.textContent = `${doneCount}/${todos.length} done`;

  sorted.forEach((todo) => {
    const li = document.createElement('li');
    li.className = `todo-item${todo.done ? ' done' : ''}`;
    li.dataset.id = todo.id;

    li.innerHTML = `
      <input type="checkbox" class="todo-checkbox" ${todo.done ? 'checked' : ''} title="Mark as done">
      <span class="todo-text">${escapeHTML(todo.text)}</span>
      <div class="todo-actions">
        <button class="btn btn-ghost btn-sm edit-btn" title="Edit task">✏️</button>
        <button class="btn btn-danger btn-sm delete-btn" title="Delete task">🗑️</button>
      </div>`;

    // Checkbox toggle
    li.querySelector('.todo-checkbox').addEventListener('change', () => toggleTodo(todo.id));

    // Edit
    li.querySelector('.edit-btn').addEventListener('click', () => editTodo(todo.id, li));

    // Delete
    li.querySelector('.delete-btn').addEventListener('click', () => deleteTodo(todo.id));

    todoListEl.appendChild(li);
  });
}

function addTodo() {
  const text = todoInput.value.trim();
  if (!text) {
    showToast('Please enter a task.', 'warning');
    todoInput.focus();
    return;
  }

  // Challenge: Prevent duplicate tasks (case-insensitive)
  const duplicate = todos.some(t => t.text.toLowerCase() === text.toLowerCase());
  if (duplicate) {
    showToast(`"${text}" already exists in your list!`, 'error');
    todoInput.select();
    return;
  }

  todos.push({
    id: Date.now(),
    text: text,
    done: false,
    createdAt: Date.now()
  });

  saveTodos();
  renderTodos();
  todoInput.value = '';
  todoInput.focus();
  showToast('Task added!', 'success');
}

function toggleTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) {
    todo.done = !todo.done;
    saveTodos();
    renderTodos();
  }
}

function editTodo(id, li) {
  const todo = todos.find(t => t.id === id);
  if (!todo) return;

  const textEl = li.querySelector('.todo-text');
  const editBtn = li.querySelector('.edit-btn');
  const actionsEl = li.querySelector('.todo-actions');

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'todo-text-input';
  input.value = todo.text;

  textEl.replaceWith(input);
  editBtn.textContent = '💾';
  input.focus();
  input.select();

  function saveEdit() {
    const newText = input.value.trim();
    if (!newText) {
      showToast('Task cannot be empty.', 'warning');
      input.focus();
      return;
    }
    // Prevent duplicate on edit (exclude self)
    const duplicate = todos.some(t => t.id !== id && t.text.toLowerCase() === newText.toLowerCase());
    if (duplicate) {
      showToast(`"${newText}" already exists!`, 'error');
      input.select();
      return;
    }
    todo.text = newText;
    saveTodos();
    renderTodos();
    showToast('Task updated!', 'success');
  }

  editBtn.onclick = saveEdit;
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') saveEdit();
    if (e.key === 'Escape') renderTodos();
  });
  input.addEventListener('blur', () => {
    setTimeout(() => {
      if (document.activeElement !== editBtn) renderTodos();
    }, 150);
  });
}

function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  saveTodos();
  renderTodos();
  showToast('Task deleted.', 'info');
}

addTodoBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTodo();
});

sortSelect.addEventListener('change', renderTodos);

/* ==========================================
   SECTION 5: QUICK LINKS
   ========================================== */

const linkName = document.getElementById('linkName');
const linkUrl = document.getElementById('linkUrl');
const addLinkBtn = document.getElementById('addLinkBtn');
const linksGridEl = document.getElementById('linksGrid');

let links = [];

function loadLinks() {
  try {
    links = JSON.parse(localStorage.getItem('quickLinks')) || [];
  } catch {
    links = [];
  }
}

function saveLinks() {
  localStorage.setItem('quickLinks', JSON.stringify(links));
}

function getFavicon(url) {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch {
    return '';
  }
}

function normalizeUrl(url) {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return 'https://' + url;
  }
  return url;
}

function renderLinks() {
  linksGridEl.innerHTML = '';

  if (links.length === 0) {
    linksGridEl.innerHTML = `<div class="links-empty">No links yet. Add your favorites above!</div>`;
    return;
  }

  links.forEach((link) => {
    const item = document.createElement('div');
    item.className = 'link-item';

    const faviconSrc = getFavicon(link.url);
    item.innerHTML = `
      <img class="link-favicon" src="${faviconSrc}" alt="" onerror="this.style.display='none'">
      <span class="link-label">${escapeHTML(link.name)}</span>
      <button class="link-delete" data-id="${link.id}" title="Remove link">✕</button>`;

    // Open link on click (but not on delete button)
    item.addEventListener('click', (e) => {
      if (e.target.classList.contains('link-delete')) return;
      window.open(link.url, '_blank', 'noopener,noreferrer');
    });

    item.querySelector('.link-delete').addEventListener('click', (e) => {
      e.stopPropagation();
      deleteLink(link.id);
    });

    linksGridEl.appendChild(item);
  });
}

function addLink() {
  const name = linkName.value.trim();
  const rawUrl = linkUrl.value.trim();

  if (!name || !rawUrl) {
    showToast('Please enter both a name and a URL.', 'warning');
    return;
  }

  const url = normalizeUrl(rawUrl);

  try {
    new URL(url); // validate URL
  } catch {
    showToast('Please enter a valid URL.', 'error');
    return;
  }

  links.push({ id: Date.now(), name, url });
  saveLinks();
  renderLinks();
  linkName.value = '';
  linkUrl.value = '';
  linkName.focus();
  showToast(`"${name}" added!`, 'success');
}

function deleteLink(id) {
  links = links.filter(l => l.id !== id);
  saveLinks();
  renderLinks();
  showToast('Link removed.', 'info');
}

addLinkBtn.addEventListener('click', addLink);
linkUrl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addLink();
});
linkName.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') linkUrl.focus();
});

/* ==========================================
   SECTION 6: TOAST NOTIFICATIONS
   ========================================== */

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    toast.style.transition = 'opacity 0.3s, transform 0.3s';
    setTimeout(() => toast.remove(), 350);
  }, 3000);
}

/* ==========================================
   SECTION 7: UTILITY
   ========================================== */

function escapeHTML(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

/* ==========================================
   INIT — Run everything on load
   ========================================== */

function init() {
  initTheme();
  loadTodos();
  renderTodos();
  loadLinks();
  renderLinks();
  updateTimerDisplay();
  updateClock();
  setInterval(updateClock, 1000);
  stopBtn.disabled = true;
}

document.addEventListener('DOMContentLoaded', init);
