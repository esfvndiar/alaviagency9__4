// src/components/Navbar.test.tsx
import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./Navbar";

// Mock react-router-dom
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    Link: ({
      children,
      to,
      ...props
    }: {
      children: React.ReactNode;
      to: string;
      [key: string]: unknown;
    }) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
    useLocation: () => ({ pathname: "/" }),
  };
});

// Mock use-theme hook
vi.mock("../hooks/use-theme", () => ({
  useTheme: () => ({
    theme: "light",
    toggleTheme: vi.fn(),
  }),
}));

describe("Navbar", () => {
  it("renders navigation links", () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>,
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Services")).toBeInTheDocument();
    expect(screen.getByText("Work")).toBeInTheDocument();
    expect(screen.getByText("Blog")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
  });

  it("toggles mobile menu when hamburger button is clicked", async () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>,
    );

    const hamburgerButton = screen.getByRole("button", { name: /menu/i });
    fireEvent.click(hamburgerButton);

    await waitFor(() => {
      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });
  });
});
