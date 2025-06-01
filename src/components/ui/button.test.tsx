// src/components/ui/button.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "./button"; // Adjust the import path if necessary

describe("Button Component", () => {
  it("should render the button with children", () => {
    // Arrange
    const buttonText = "Click Me";
    render(<Button>{buttonText}</Button>);

    // Act
    const buttonElement = screen.getByRole("button", { name: buttonText });

    // Assert
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveTextContent(buttonText);
  });

  it("should apply default variant classes", () => {
    // Arrange
    render(<Button>Default</Button>);
    const buttonElement = screen.getByRole("button", { name: "Default" });

    // Assert
    // Check for a class specific to the default variant (adjust if needed based on buttonVariants)
    expect(buttonElement).toHaveClass("bg-primary");
    expect(buttonElement).toHaveClass("text-primary-foreground");
  });

  // Add more tests here for other variants, sizes, disabled state, asChild prop, etc.
});
