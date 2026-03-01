const setupDOM = () => {
  document.body.innerHTML = `
    <div class="container">
      <h1>Task Tracker</h1>
      <select id="theme-select" class="theme-dropdown">
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="crimson">Crimson</option>
      </select>
      <form id="task-form">
        <input type="text" id="task-input" placeholder="Add a new task..." required>
        <button type="submit">Add</button>
      </form>
      <div class="filters">
        <button class="filter-btn active" data-filter="all">All</button>
        <button class="filter-btn" data-filter="active">Active</button>
        <button class="filter-btn" data-filter="completed">Completed</button>
      </div>
      <ul id="task-list"></ul>
      <div class="stats">
        <span id="task-count">0 tasks</span>
        <button id="clear-completed">Clear Completed</button>
      </div>
    </div>
  `;
};

const resetState = () => {
  global.Date.now = jest.fn(() => 1234567890000);
  window.localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
};

const getElements = () => ({
  taskForm: document.getElementById('task-form'),
  taskInput: document.getElementById('task-input'),
  taskList: document.getElementById('task-list'),
  taskCount: document.getElementById('task-count'),
  clearCompletedBtn: document.getElementById('clear-completed'),
  filterBtns: document.querySelectorAll('.filter-btn'),
  themeSelect: document.getElementById('theme-select'),
});

module.exports = { setupDOM, resetState, getElements };
