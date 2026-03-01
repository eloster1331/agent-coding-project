const { setupDOM, resetState, getElements } = require('./helpers');

describe('Task Tracker - Task Functions', () => {
  let taskForm, taskInput, taskList, taskCount, clearCompletedBtn, filterBtns, themeSelect;
  let tasks, currentFilter;

  beforeEach(() => {
    setupDOM();
    resetState();
    
    const elements = getElements();
    taskForm = elements.taskForm;
    taskInput = elements.taskInput;
    taskList = elements.taskList;
    taskCount = elements.taskCount;
    clearCompletedBtn = elements.clearCompletedBtn;
    filterBtns = elements.filterBtns;
    themeSelect = elements.themeSelect;

    tasks = [];
    currentFilter = 'all';

    jest.resetModules();
    require('../app.js');
    
    tasks = [];
    global.window.localStorage.clear();
  });

  describe('addTask', () => {
    test('should add a task with correct properties', () => {
      const initialLength = tasks.length;
      taskInput.value = 'Test task';
      taskForm.dispatchEvent(new Event('submit'));
      
      expect(tasks.length).toBe(initialLength + 1);
      expect(tasks[0].text).toBe('Test task');
      expect(tasks[0].completed).toBe(false);
      expect(tasks[0].id).toBe(1234567890000);
    });

    test('should trim whitespace from task text', () => {
      taskInput.value = '  Spaced task  ';
      taskForm.dispatchEvent(new Event('submit'));
      
      expect(tasks[0].text).toBe('Spaced task');
    });

    test('should not add empty task', () => {
      taskInput.value = '   ';
      taskForm.dispatchEvent(new Event('submit'));
      
      expect(tasks.length).toBe(0);
    });

    test('should save tasks to localStorage', () => {
      taskInput.value = 'LocalStorage test';
      taskForm.dispatchEvent(new Event('submit'));
      
      expect(window.localStorage.getItem('tasks')).toBe(JSON.stringify(tasks));
    });
  });

  describe('toggleTask', () => {
    test('should toggle task completion status', () => {
      tasks.push({ id: 1, text: 'Test', completed: false });
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      taskList.appendChild(checkbox);
      
      const event = new Event('change');
      Object.defineProperty(event, 'target', { value: checkbox });
      
      window.toggleTask(1);
      
      expect(tasks[0].completed).toBe(true);
    });

    test('should not error for invalid task id', () => {
      tasks.push({ id: 1, text: 'Test', completed: false });
      
      expect(() => window.toggleTask(999)).not.toThrow();
    });
  });

  describe('deleteTask', () => {
    test('should remove task from array', () => {
      tasks.push({ id: 1, text: 'Task 1', completed: false });
      tasks.push({ id: 2, text: 'Task 2', completed: false });
      
      window.deleteTask(1);
      
      expect(tasks.length).toBe(1);
      expect(tasks[0].id).toBe(2);
    });
  });

  describe('clearCompleted', () => {
    test('should remove only completed tasks', () => {
      tasks = [
        { id: 1, text: 'Active', completed: false },
        { id: 2, text: 'Completed', completed: true },
        { id: 3, text: 'Also Active', completed: false }
      ];
      
      window.clearCompleted();
      
      expect(tasks.length).toBe(2);
      expect(tasks.find(t => t.id === 2)).toBeUndefined();
    });
  });

  describe('updateCount', () => {
    test('should display correct singular form', () => {
      tasks = [{ id: 1, text: 'One task', completed: false }];
      
      window.updateCount();
      
      expect(taskCount.textContent).toBe('1 task');
    });

    test('should display correct plural form', () => {
      tasks = [
        { id: 1, text: 'Task 1', completed: false },
        { id: 2, text: 'Task 2', completed: true }
      ];
      
      window.updateCount();
      
      expect(taskCount.textContent).toBe('1 tasks');
    });
  });
});
