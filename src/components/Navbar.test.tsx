// src/components/Navbar.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import Navbar from './Navbar';
import { ThemeProvider } from '@/components/ThemeProvider'; // Corrected path casing

// Mock MobileMenu component
vi.mock('./MobileMenu', () => ({
  default: vi.fn(({ isOpen }: { isOpen: boolean }) => ( 
    <div data-testid="mock-mobile-menu" data-isopen={isOpen ? 'true' : 'false'}>
      Mock Mobile Menu
    </div>
  )),
}));

// Mock necessary hooks or context providers if Navbar uses them
// Example: Mocking useTranslation if i18n is used
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key, // Simple mock translation function
    i18n: {
      changeLanguage: vi.fn(),
      language: 'en',
    },
  }),
}));

// Mock ThemeProvider context if needed, or provide a mock value
const MockThemeProvider = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    {children}
  </ThemeProvider>
);

describe('Navbar Component', () => {
  const renderNavbar = () => {
    render(
      <BrowserRouter> {/* Wrap with BrowserRouter for Link components */}
        <MockThemeProvider>
          <Navbar />
        </MockThemeProvider>
      </BrowserRouter>
    );
  };

  // Helper function for rendering with a mock callback
  const renderNavbarWithCallback = (callback: (isOpen: boolean) => void) => {
    render(
      <BrowserRouter>
        <MockThemeProvider>
          <Navbar onMobileMenuToggle={callback} />
        </MockThemeProvider>
      </BrowserRouter>
    );
  };

  it('should render the logo', () => {
    renderNavbar();
    // Assuming the logo is an image with alt text or a specific element
    // Adjust the query based on how the logo is implemented
    const logoElement = screen.getByRole('link', { name: /ALAVI/i }); // Updated query for text link
    expect(logoElement).toBeInTheDocument();
  });

  it('should render main navigation links', () => {
    renderNavbar();
    expect(screen.getByRole('link', { name: /work/i })).toBeInTheDocument(); // Updated name
    expect(screen.getByRole('link', { name: /services/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /reach out/i })).toBeInTheDocument(); // Updated name
  });

  it('should render the mobile menu toggle button', () => { // Renamed test
    renderNavbar();
    // Check for the button that opens the mobile menu
    const menuButton = screen.getByRole('button', { name: /open menu/i }); // Updated query for mobile menu button
    expect(menuButton).toBeInTheDocument();
  });

  it('should toggle mobile menu state on button click', () => {
    renderNavbar();
    const menuButton = screen.getByRole('button', { name: /open menu/i });
    const mobileMenu = screen.getByTestId('mock-mobile-menu');

    // Initially closed
    expect(menuButton).toHaveAttribute('aria-label', 'Open menu');
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    expect(mobileMenu).toHaveAttribute('data-isopen', 'false');

    // Click to open
    fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute('aria-label', 'Close menu');
    expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    expect(mobileMenu).toHaveAttribute('data-isopen', 'true');

    // Click to close
    fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute('aria-label', 'Open menu');
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    expect(mobileMenu).toHaveAttribute('data-isopen', 'false');
  });

  it('should call onMobileMenuToggle callback when menu toggles', async () => { // Make test async
    const mockToggleCallback = vi.fn();
    renderNavbarWithCallback(mockToggleCallback);
    const menuButton = screen.getByRole('button', { name: /open menu/i });

    // Check initial call
    await waitFor(() => expect(mockToggleCallback).toHaveBeenCalled());
    expect(mockToggleCallback).toHaveBeenLastCalledWith(false); // Initial state is closed

    // Click to open
    fireEvent.click(menuButton);
    // Wait for the UI to reflect the change and check the callback
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /close menu/i })).toBeInTheDocument();
      expect(mockToggleCallback).toHaveBeenLastCalledWith(true);
    });

    // Click to close
    fireEvent.click(menuButton);
    // Wait for the UI to reflect the change and check the callback
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /open menu/i })).toBeInTheDocument();
      expect(mockToggleCallback).toHaveBeenLastCalledWith(false);
    });
  });

  // Add tests for scroll behavior later
});
