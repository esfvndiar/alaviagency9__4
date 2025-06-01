import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import AboutSection from "./AboutSection";
import { ThemeProvider } from "@/components/ThemeProvider";

// Minimal IntersectionObserver mock to prevent AnimatedText error
const mockIntersectionObserver = class {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  // Add dummy properties if needed by any underlying checks
  readonly root: Element | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];
  constructor(
    _callback: IntersectionObserverCallback,
    _options?: IntersectionObserverInit,
  ) {}
};

// Mock matchMedia as well, as ThemeProvider might use it
const mockMatchMedia = (query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
});

beforeAll(() => {
  vi.stubGlobal("IntersectionObserver", mockIntersectionObserver);
  vi.stubGlobal("matchMedia", mockMatchMedia); // Keep matchMedia mock too
});

// Mock the ScrollReveal component
vi.mock("@/components/ScrollReveal", () => ({
  // Default export for functional component
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>, // Render children directly
}));

// Helper function to render the component within necessary providers
const renderAbout = () => {
  return render(
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AboutSection />
    </ThemeProvider>,
  );
};

describe("AboutSection Component", () => {
  it('should render the main "About ALAVI" heading', async () => {
    renderAbout();
    // Directly find the heading
    expect(
      screen.getByRole("heading", { level: 2, name: /About ALAVI/i }),
    ).toBeInTheDocument();
  });

  it('should render the "Who We Are" subheading', async () => {
    renderAbout();
    // Directly find the subheading
    expect(
      screen.getByRole("heading", { level: 3, name: /Who We Are/i }),
    ).toBeInTheDocument();
  });

  it('should render the "Our Story" tag', async () => {
    renderAbout();
    // Directly find the tag
    expect(
      screen.getByText(/Our Story/i, { selector: "span" }),
    ).toBeInTheDocument();
  });

  it("should render the key features list", async () => {
    renderAbout();
    const features = [
      /Innovative Solutions/i,
      /Client-Focused Approach/i,
      /Technical Excellence/i,
      /Creative Design/i,
    ];
    for (const feature of features) {
      // Directly find the feature text
      expect(
        screen.getByText(feature, { selector: "span" }),
      ).toBeInTheDocument();
    }
  });

  it("should render descriptive text", async () => {
    renderAbout();
    const texts = [
      /passionate digital experts committed/i,
      /impactful digital experiences tailored/i,
    ];
    for (const text of texts) {
      // Directly find the paragraph text
      expect(screen.getByText(text)).toBeInTheDocument();
    }
  });

  it("should render the AnimatedText content", async () => {
    renderAbout();
    // Find the H2 container rendered by AnimatedText using its data-testid
    const animatedTextContainer = await screen.findByTestId("animated-heading");

    // Now search within this container for the specific words
    expect(
      await within(animatedTextContainer).findByText(/^full-service$/i),
    ).toBeInTheDocument();
    expect(
      await within(animatedTextContainer).findByText(/^IT$/i),
    ).toBeInTheDocument(); // Use exact match regex
    expect(
      await within(animatedTextContainer).findByText(/^agency$/i),
    ).toBeInTheDocument();
  });

  it("should render the stats section", async () => {
    renderAbout();
    const statsTexts = [
      /Clients/i,
      /150\+/i,
      /Projects/i,
      /200\+/i,
      /Years Experience/i,
      /10\+/i,
    ];
    for (const text of statsTexts) {
      // Directly find the stat text
      expect(screen.getByText(text)).toBeInTheDocument();
    }
  });
});
