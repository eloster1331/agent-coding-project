const { setupDOM, resetState, getElements } = require('./helpers');

describe('Task Tracker - Theme Functions', () => {
  let themeSelect;

  beforeEach(() => {
    setupDOM();
    resetState();
    
    const elements = getElements();
    themeSelect = elements.themeSelect;

    jest.resetModules();
    require('../app.js');
    
    global.window.localStorage.clear();
  });

  afterEach(() => {
    document.documentElement.removeAttribute('data-theme');
  });

  describe('getSystemThemePreference', () => {
    test('should return dark when browser prefers dark mode', () => {
      window.matchMedia.mockReturnValue({
        matches: true,
        media: '(prefers-color-scheme: dark)',
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      });
      
      const result = window.getSystemThemePreference();
      expect(result).toBe('dark');
    });

    test('should return light when browser prefers light mode', () => {
      window.matchMedia.mockReturnValue({
        matches: false,
        media: '(prefers-color-scheme: dark)',
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      });
      
      const result = window.getSystemThemePreference();
      expect(result).toBe('light');
    });
  });

  describe('getEffectiveTheme', () => {
    test('should return saved theme from localStorage', () => {
      window.localStorage.setItem('theme', 'crimson');
      
      const result = window.getEffectiveTheme();
      expect(result).toBe('crimson');
    });

    test('should return system preference when no saved theme', () => {
      window.matchMedia.mockReturnValue({
        matches: true,
        media: '(prefers-color-scheme: dark)',
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      });
      
      const result = window.getEffectiveTheme();
      expect(result).toBe('dark');
    });
  });

  describe('applyTheme', () => {
    test('should set data-theme attribute on html element', () => {
      window.applyTheme('dark');
      
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    test('should update themeSelect dropdown value', () => {
      window.applyTheme('crimson');
      
      expect(themeSelect.value).toBe('crimson');
    });

    test('should work with all theme values', () => {
      ['light', 'dark', 'crimson'].forEach(theme => {
        window.applyTheme(theme);
        expect(document.documentElement.getAttribute('data-theme')).toBe(theme);
      });
    });
  });

  describe('Theme dropdown interaction', () => {
    test('should save theme to localStorage on change', () => {
      themeSelect.value = 'crimson';
      themeSelect.dispatchEvent(new Event('change'));
      
      expect(window.localStorage.getItem('theme')).toBe('crimson');
    });

    test('should apply theme when dropdown changes', () => {
      themeSelect.value = 'dark';
      themeSelect.dispatchEvent(new Event('change'));
      
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    test('should set userHasSelectedTheme to true after manual selection', () => {
      themeSelect.value = 'dark';
      themeSelect.dispatchEvent(new Event('change'));
      
      expect(window.userHasSelectedTheme).toBe(true);
    });
  });

  describe('Browser preference listener', () => {
    test('should not change theme if user has manually selected', () => {
      window.localStorage.setItem('theme', 'crimson');
      window.userHasSelectedTheme = true;
      
      const event = { matches: true };
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const listener = mediaQuery.addEventListener.mock.calls[0][1];
      listener(event);
      
      expect(document.documentElement.getAttribute('data-theme')).toBe('crimson');
    });
  });
});
