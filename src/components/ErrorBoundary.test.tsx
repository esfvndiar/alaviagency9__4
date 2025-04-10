import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ErrorBoundary from './ErrorBoundary';

// A component that throws an error
const ProblemChild = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error from ProblemChild');
  }
  return <div>Everything is fine</div>;
};

// A simple custom fallback component
const CustomFallback = () => <div data-testid="custom-fallback">Custom Fallback UI</div>;

describe('ErrorBoundary', () => {
  // Suppress console.error logs during tests, as ErrorBoundary logs caught errors
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks(); // Restore console.error
  });

  it('should render children when there is no error', () => {
    render(
      <ErrorBoundary>
        <ProblemChild shouldThrow={false} />
      </ErrorBoundary>
    );
    expect(screen.getByText('Everything is fine')).toBeInTheDocument();
  });

  it('should catch an error and render the default fallback UI', () => {
    render(
      <ErrorBoundary>
        <ProblemChild shouldThrow={true} />
      </ErrorBoundary>
    );

    // Check for fallback UI elements
    expect(screen.getByRole('heading', { name: /Something went wrong/i })).toBeInTheDocument();
    expect(screen.getByText(/There was an error rendering this component./i)).toBeInTheDocument();
    expect(screen.getByText(/Test error from ProblemChild/i)).toBeInTheDocument(); // Check error message is displayed
    expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument();

    // Check that the original child is not rendered
    expect(screen.queryByText('Everything is fine')).not.toBeInTheDocument();
  });

   it('should render the default fallback UI with componentName prop', () => {
    render(
      <ErrorBoundary componentName="MyComponent">
        <ProblemChild shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByRole('heading', { name: /Something went wrong/i })).toBeInTheDocument();
    expect(screen.getByText(/There was an error loading the MyComponent component./i)).toBeInTheDocument();
  });

  it('should render a custom fallback UI if provided', () => {
    render(
      <ErrorBoundary fallback={<CustomFallback />}>
        <ProblemChild shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /Something went wrong/i })).not.toBeInTheDocument();
  });

  it('should reset the error state and call onReset when "Try Again" is clicked', () => {
    const handleReset = vi.fn();
    let shouldThrow = true;
    let key = 1; // Initial key

    const { rerender } = render(
      <ErrorBoundary key={key} onReset={handleReset}>
        <ProblemChild shouldThrow={shouldThrow} />
      </ErrorBoundary>
    );

    // Ensure error state is active
    const tryAgainButton = screen.getByRole('button', { name: /Try Again/i });
    expect(tryAgainButton).toBeInTheDocument();
    expect(screen.queryByText('Everything is fine')).not.toBeInTheDocument();

    // Click the Try Again button
    fireEvent.click(tryAgainButton);

    // Verify onReset was called
    expect(handleReset).toHaveBeenCalledTimes(1);

    // Simulate recovery by changing the key and fixing the child prop
    shouldThrow = false;
    key = 2; // Change the key to force remount

    rerender(
      <ErrorBoundary key={key} onReset={handleReset}>
        <ProblemChild shouldThrow={shouldThrow} />
      </ErrorBoundary>
    );

    // AFTER re-rendering with the new key and non-throwing child,
    // a *new* ErrorBoundary instance should render the child.
    expect(screen.getByText('Everything is fine')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /Something went wrong/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Try Again/i })).not.toBeInTheDocument();
  });
}); 