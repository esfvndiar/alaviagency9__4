// src/components/Footer.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "./Footer";
import { ThemeProvider } from "@/components/ThemeProvider"; // Assuming path
import { BrowserRouter } from "react-router-dom"; // If any links are used

// Mock ThemeProvider
const MockThemeProvider = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    {children}
  </ThemeProvider>
);

describe("Footer Component", () => {
  const renderFooter = () => {
    render(
      <BrowserRouter>
        {" "}
        {/* Wrap if needed */}
        <MockThemeProvider>
          <Footer />
        </MockThemeProvider>
      </BrowserRouter>,
    );
  };

  it("should render social media links", () => {
    renderFooter();
    // Use specific queries (e.g., aria-label or contained SVG title/path if possible)
    expect(screen.getByLabelText(/X/i)).toBeInTheDocument(); // Corrected label
    expect(screen.getByLabelText(/Instagram/i)).toBeInTheDocument(); // Corrected label
    expect(screen.getByLabelText(/Linkedin/i)).toBeInTheDocument(); // Corrected label
    // Add more checks if other links exist
  });

  it("should render the copyright notice", () => {
    renderFooter();
    expect(
      screen.getByText(
        `© ${new Date().getFullYear()} ALAVI. All rights reserved.`,
      ),
    ).toBeInTheDocument();
  });

  // Add tests for other footer links if applicable
});
