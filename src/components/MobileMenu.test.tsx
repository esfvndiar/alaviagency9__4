// src/components/MobileMenu.test.tsx
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MobileMenu from './MobileMenu';

// Mock links data
const mockLinks = [
  { title: 'Work', href: '/work' },
  { title: 'Services', href: '/services' },
  { title: 'About', href: '/about' },
  { title: 'Reach Out', href: '/contact' }
];

// Mock react-dom for createPortal
vi.mock('react-dom', async () => {
    const actual = await vi.importActual<typeof import('react-dom')>('react-dom');
    return {
        ...actual,
        createPortal: (element: React.ReactNode) => element,
    };
});

describe('MobileMenu Component', () => {
  let portalContainer: HTMLDivElement;

  beforeEach(() => {
    // Create a container element for the portal before each test
    portalContainer = document.createElement('div');
    portalContainer.setAttribute('id', 'portal-root'); // Optional ID for clarity
    document.body.appendChild(portalContainer);
  });

  afterEach(() => {
    // Clean up the container after each test
    if (document.body.contains(portalContainer)) {
        document.body.removeChild(portalContainer);
    }
    vi.restoreAllMocks(); // Use restoreAllMocks to clean up spies
  });

  it('should not render when isOpen is false initially', () => {
    render(
        <MobileMenu isOpen={false} onClose={vi.fn()} links={mockLinks} />
    );
    // The menu content is technically rendered by React but shouldn't be visible/mounted due to shouldRender state
    // Check if the close button (a key element) is absent
    expect(screen.queryByRole('button', { name: /close menu/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /work/i })).not.toBeInTheDocument();
  });

  it('should render correctly when isOpen is true', () => {
    render(
        <MobileMenu isOpen={true} onClose={vi.fn()} links={mockLinks} />
    );
    // Check for elements within the portal
    expect(screen.getByRole('button', { name: /close menu/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /work/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /services/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /reach out/i })).toBeInTheDocument();
    // Use regex to be more flexible with whitespace potentially breaking up the text
    expect(screen.getByText(/©\s*\d+\s*ALAVI/i)).toBeInTheDocument();
  });

  it('should call onClose when the close button is clicked', () => {
    const handleClose = vi.fn();
    render(
        <MobileMenu isOpen={true} onClose={handleClose} links={mockLinks} />
    );

    const closeButton = screen.getByRole('button', { name: /close menu/i });
    fireEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

   it('should call onClose when a navigation link is clicked', () => {
    const handleClose = vi.fn();
    render(
        <MobileMenu isOpen={true} onClose={handleClose} links={mockLinks} />
    );

    const workLink = screen.getByRole('link', { name: /work/i });
    fireEvent.click(workLink);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  // Note: Testing the animation timing might be brittle and depend on exact timer mocks.
  // The core functionality (rendering based on isOpen, calling onClose) is more critical.
});
