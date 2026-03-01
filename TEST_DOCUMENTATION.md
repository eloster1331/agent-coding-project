# Task Tracker - Test Documentation

## Overview

This document describes the testing setup for the Task Tracker application, what tests are included, and how to run them.

---

## Why Test?

Testing is like having a quality control checklist for your code. Here's why we test:

1. **Catch bugs early** - Tests find problems before users do
2. **Prevent regressions** - When you fix a bug, tests ensure it doesn't come back
3. **Document behavior** - Tests serve as documentation for how code should work
4. **Enable confidence** - Good tests let you make changes without fear

---

## Test Structure

```
tests/
├── setup.js          # Jest configuration and mock setup
├── helpers.js        # Test utilities (DOM setup, state reset)
├── task-functions.test.js   # Tests for task CRUD operations
└── theme.test.js           # Tests for theme switching
```

---

## Test Types Included

### 1. Unit Tests

Unit tests check individual functions in isolation. Think of testing a single switch in your house - does it work on its own?

**Location:** `tests/task-functions.test.js`

| Test | What It Checks |
|------|----------------|
| `addTask - should add a task with correct properties` | Creates task with text, id, completed=false |
| `addTask - should trim whitespace from task text` | "  Hello  " → "Hello" |
| `addTask - should not add empty task` | Empty/whitespace-only rejected |
| `addTask - should save tasks to localStorage` | Data persists after add |
| `toggleTask - should toggle task completion` | false → true → false |
| `toggleTask - should not error for invalid id` | Graceful handling of bad input |
| `deleteTask - should remove task from array` | Correct task removed |
| `clearCompleted - should remove only completed` | Active tasks preserved |
| `updateCount - should display correct singular` | "1 task" (no plural) |
| `updateCount - should display correct plural` | "2 tasks" |

### 2. Integration Tests

Integration tests check that functions work together.

**Location:** `tests/task-functions.test.js`, `tests/theme.test.js`

| Test | What It Checks |
|------|----------------|
| Theme dropdown → localStorage | Selection persists |
| Theme dropdown → data-theme attribute | Visual theme changes |
| User selection → userHasSelectedTheme flag | Manual override works |

### 3. Theme Tests

**Location:** `tests/theme.test.js`

| Test | What It Checks |
|------|----------------|
| `getSystemThemePreference - browser prefers dark` | Returns 'dark' when OS is dark |
| `getSystemThemePreference - browser prefers light` | Returns 'light' when OS is light |
| `getEffectiveTheme - returns saved theme` | localStorage takes priority |
| `getEffectiveTheme - returns system preference` | Falls back to OS setting |
| `applyTheme - sets data-theme attribute` | HTML element updated |
| `applyTheme - updates dropdown value` | UI stays in sync |
| `applyTheme - works with all themes` | Light, Dark, Crimson all work |
| `Theme dropdown - saves to localStorage` | Preference persists |
| `Theme dropdown - applies theme on change` | Immediate visual update |
| `Browser preference - does not override manual` | User choice is respected |

---

## Running the Tests

### Prerequisites

```bash
# Install Node.js (version 14+) from https://nodejs.org

# Verify installation
node --version  # Should show v14+
npm --version   # Should show a version number
```

### Install Dependencies

```bash
npm install
```

This installs:
- **Jest** - Test runner (executes tests)
- **jest-environment-jsdom** - Fake browser environment for testing

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (reruns on file changes)
npm run test:watch
```

### Expected Output

```
 PASS  tests/task-functions.test.js
  ✓ addTask - should add a task with correct properties
  ✓ addTask - should trim whitespace from task text
  ✓ addTask - should not add empty task
  ✓ addTask - should save tasks to localStorage
  ✓ toggleTask - should toggle task completion
  ✓ toggleTask - should not error for invalid id
  ✓ deleteTask - should remove task from array
  ✓ clearCompleted - should remove only completed
  ✓ updateCount - should display correct singular
  ✓ updateCount - should display correct plural

 PASS  tests/theme.test.js
  ✓ getSystemThemePreference - browser prefers dark
  ✓ getSystemThemePreference - browser prefers light
  ✓ getEffectiveTheme - returns saved theme
  ✓ getEffectiveTheme - returns system preference
  ✓ applyTheme - sets data-theme attribute
  ✓ applyTheme - updates dropdown value
  ✓ applyTheme - works with all themes
  ✓ Theme dropdown - saves to localStorage
  ✓ Theme dropdown - applies theme on change
  ✓ Browser preference - does not override manual

Tests:       20 passed
Test Suites: 2 passed
Tests:       20 total
```

---

## Test Technologies Explained

### Jest
- **What:** A JavaScript testing framework
- **Why:** Simple syntax, great error messages, built-in test runner
- **Alternatives:** Mocha, Jasmine, Vitest

### jsdom
- **What:** A pure JavaScript implementation of web APIs
- **Why:** Lets tests run in Node.js without a real browser
- **What it simulates:** DOM, HTML, localStorage, window, document

### localStorage Mock
- **What:** We create a fake version of localStorage
- **Why:** Real localStorage doesn't exist in Node.js
- **How:** Simple JavaScript object that acts like localStorage

---

## Adding New Tests

### Test File Template

```javascript
const { setupDOM, resetState, getElements } = require('./helpers');

describe('Feature Name', () => {
  let element1, element2;

  beforeEach(() => {
    setupDOM();
    resetState();
    const elements = getElements();
    element1 = elements.element1;
    
    jest.resetModules();
    require('../app.js');
  });

  test('should do something specific', () => {
    // Arrange - set up test data
    
    // Act - perform the action
    
    // Assert - check the result
    expect(actual).toBe(expected);
  });
});
```

### Common Matchers

| Matcher | Usage |
|---------|-------|
| `expect(x).toBe(y)` | Strict equality (===) |
| `expect(x).toEqual(y)` | Deep equality |
| `expect(x).toBeTruthy()` | Is it truthy? |
| `expect(x).toBeFalsy()` | Is it falsy? |
| `expect(() => code).toThrow()` | Does code throw? |
| `expect(x).toContain(y)` | Array/string contains? |

---

## Coverage Goals

Current tests cover:
- ✅ Task CRUD operations (add, toggle, delete, clear)
- ✅ localStorage persistence
- ✅ Theme switching (all 3 modes)
- ✅ Browser preference detection
- ✅ User preference override

Not yet covered:
- ❌ Filter button interactions
- ❌ Task rendering (DOM manipulation)
- ❌ Edge cases (very long task text, special characters)

---

## Notes

- Tests use `jest.fn()` to mock functions
- `Date.now()` is mocked to return `1234567890000` for predictable IDs
- Each test starts with clean state (localStorage cleared, DOM reset)
- Tests are independent and can run in any order
