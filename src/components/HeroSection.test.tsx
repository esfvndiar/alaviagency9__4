// src/components/HeroSection.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HeroSection from './HeroSection';
import { ThemeProvider } from '@/components/ThemeProvider'; // Assuming path

// Mock ThemeProvider
const MockThemeProvider = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    {children}
  </ThemeProvider>
);

// Mock IntersectionObserver
const IntersectionObserverMock = vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));
vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

// Mock window.matchMedia for theme detection
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated but still used by some libraries
    removeListener: vi.fn(), // Deprecated but still used by some libraries
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('HeroSection Component', () => {
  const renderHero = () => {
    return render(
      <BrowserRouter>
        <MockThemeProvider>
          <HeroSection />
        </MockThemeProvider>
      </BrowserRouter>
    );
  };

  it('should render the main heading structure', () => {
    renderHero();
    // Check for the H1 element
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    
    // Check for the heading container structure
    const headingContainers = heading.querySelectorAll('div');
    expect(headingContainers.length).toBeGreaterThanOrEqual(2); // At least two containers for static and dynamic text
  });

  it('should render the subheading', () => {
    renderHero();
    // Check for the subheading text
    expect(screen.getByText(/We transform your vision into exceptional digital experiences/i)).toBeInTheDocument();
  });

  it('should render the call-to-action buttons', () => {
    renderHero();
    // Check for the CTA buttons
    const exploreButton = screen.getByRole('link', { name: /Explore Solutions/i });
    const contactButton = screen.getByRole('link', { name: /Contact Us/i });
    
    expect(exploreButton).toBeInTheDocument();
    expect(contactButton).toBeInTheDocument();
    
    // Check href attributes
    expect(exploreButton).toHaveAttribute('href', '#services');
    expect(contactButton).toHaveAttribute('href', '#contact');
  });

  it('should render the scroll indicator', () => {
    renderHero();
    // Check for the scroll indicator text and elements
    expect(screen.getByText(/Scroll to explore/i)).toBeInTheDocument();
    
    // Find the scroll indicator container
    const scrollIndicator = screen.getByText(/Scroll to explore/i).parentElement;
    expect(scrollIndicator).toBeInTheDocument();
    
    // Check for the animated dot inside the scroll indicator
    const scrollContainer = scrollIndicator?.querySelector('.w-6.h-10');
    expect(scrollContainer).toBeInTheDocument();
    
    // Check the inner div for the animate-bounce class
    const animatedDot = scrollContainer?.querySelector('div');
    expect(animatedDot).toBeInTheDocument();
    expect(animatedDot).toHaveClass('animate-bounce');
  });

  it('should render background gradient elements', () => {
    const { container } = renderHero();
    
    // Check for background gradient elements
    const gradientElements = container.querySelectorAll('.blur-3xl');
    expect(gradientElements.length).toBe(3); // There should be 3 gradient elements
    
    // Check for specific gradient classes
    const gradientClasses = Array.from(gradientElements).map(el => el.className);
    expect(gradientClasses.some(className => className.includes('from-blue-500'))).toBeTruthy();
    expect(gradientClasses.some(className => className.includes('from-purple-500'))).toBeTruthy();
    expect(gradientClasses.some(className => className.includes('from-cyan-500'))).toBeTruthy();
  });

  it('should have animation elements for typing effect', () => {
    const { container } = renderHero();
    
    // Check for the typing cursor elements (blinking cursors)
    const blinkingCursors = container.querySelectorAll('.animate-blink');
    expect(blinkingCursors.length).toBeGreaterThanOrEqual(1);
    
    // Check for the text containers
    const heading = screen.getByRole('heading', { level: 1 });
    const staticTextContainer = heading.querySelector('div:first-child span:first-child');
    const dynamicTextContainer = heading.querySelector('.text-gradient');
    
    expect(staticTextContainer).toBeInTheDocument();
    expect(dynamicTextContainer).toBeInTheDocument();
  });

  it('should have proper structure for dynamic text animation', () => {
    renderHero();
    
    // Check for the dynamic text container with gradient class
    const dynamicTextContainer = document.querySelector('.text-gradient');
    expect(dynamicTextContainer).toBeInTheDocument();
    
    // Check that the container is within the heading
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading.contains(dynamicTextContainer)).toBeTruthy();
  });
});
