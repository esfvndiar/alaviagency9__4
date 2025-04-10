// src/setupTests.ts
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock window.matchMedia for jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false, // Default to false
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated but may be needed
    removeListener: vi.fn(), // Deprecated but may be needed
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver
// Sometimes needed by UI libraries for layout calculations
const ResizeObserverMock = vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));
vi.stubGlobal('ResizeObserver', ResizeObserverMock);
