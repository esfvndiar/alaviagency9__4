// src/components/ContactSection.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ContactSection from './ContactSection';
import { ThemeProvider } from '@/components/ThemeProvider'; // Assuming path

// Mock ThemeProvider
const MockThemeProvider = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    {children}
  </ThemeProvider>
);

// Mock IntersectionObserver if used
const IntersectionObserverMock = vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));
vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

// Mock react-hook-form if necessary - basic render test might not need it
// vi.mock('react-hook-form', async (importOriginal) => {
//   const original = await importOriginal();
//   return {
//     ...original,
//     useForm: () => ({
//       register: vi.fn(),
//       handleSubmit: (fn) => fn,
//       formState: { errors: {}, isSubmitting: false },
//       reset: vi.fn(),
//     }),
//   };
// });

describe('ContactSection Component', () => {
  const renderContact = () => {
    render(
        <MockThemeProvider>
            <ContactSection />
        </MockThemeProvider>
    );
  };

  // Note: findBy* queries are needed because ScrollReveal might initially hide elements
  it('should render the contact form heading', async () => {
    renderContact();
    // Use findByRole with { hidden: true } to find element even if aria-hidden
    expect(await screen.findByRole('heading', { level: 2, name: /get in touch/i, hidden: true })).toBeInTheDocument();
  });

  it('should render name, email, subject, and message fields', () => {
    renderContact();
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Message/i)).toBeInTheDocument();
  });

  it('should render the submit button', async () => {
    renderContact();
    // Use findByRole with { hidden: true } to find element even if aria-hidden
    expect(await screen.findByRole('button', { name: /Send/i, hidden: true })).toBeInTheDocument();
  });

  // Add tests later for form submission, validation errors etc.
});
