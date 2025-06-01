import { render, screen, fireEvent, act, within } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import CookieConsent from "./CookieConsent";
import Cookies from "js-cookie";
import * as browserSupport from "../utils/browserSupport"; // Import the utility module

// Mock js-cookie
vi.mock("js-cookie", () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
  },
}));

// Mock the browser support utility
vi.mock("../utils/browserSupport", () => ({
  getBrowserInfo: vi.fn(),
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    key: (index: number) => Object.keys(store)[index] || null,
    get length() {
      return Object.keys(store).length;
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("CookieConsent", () => {
  const onAccept = vi.fn();
  const onDecline = vi.fn();

  beforeEach(() => {
    // Reset mocks and localStorage before each test
    vi.clearAllMocks();
    localStorageMock.clear();

    // Mock browser support to return true by default for tests
    vi.spyOn(browserSupport, "getBrowserInfo").mockReturnValue({
      cookiesSupported: true,
      localStorageSupported: true,
    });

    // Ensure consent is not found by default
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn(Cookies, "get").mockReturnValue(undefined as any);
    vi.spyOn(localStorageMock, "getItem"); // Spy on getItem
    vi.spyOn(localStorageMock, "setItem"); // Spy on setItem
  });

  afterEach(() => {
    // Restore original implementations if necessary, though clearAllMocks should handle most
    vi.restoreAllMocks();
  });

  it("should render the banner if no consent cookie or localStorage item exists", async () => {
    render(<CookieConsent onAccept={onAccept} onDecline={onDecline} />);

    // Wait for the component to potentially update state after checking consent
    // Use the heading text which seems more stable
    await screen.findByRole("heading", {
      name: /Wir respektieren Ihre Privatsphäre/i,
    });

    expect(
      screen.getByRole("heading", {
        name: /Wir respektieren Ihre Privatsphäre/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Diese Website verwendet Cookies, um Ihr Erlebnis zu verbessern/i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Alle akzeptieren/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Nur notwendige/i }),
    ).toBeInTheDocument(); // Updated text
    expect(
      screen.getByRole("button", { name: /Einstellungen/i }),
    ).toBeInTheDocument();
  });

  it("should not render if consent cookie exists", () => {
    const mockedGet = vi.mocked(Cookies.get);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockedGet.mockReturnValue("all" as any);
    render(<CookieConsent onAccept={onAccept} onDecline={onDecline} />);
    expect(
      screen.queryByText(/Diese Website verwendet Cookies/i),
    ).not.toBeInTheDocument();
  });

  it("should not render if consent localStorage item exists", () => {
    vi.spyOn(localStorageMock, "getItem").mockImplementation((key) =>
      key === "alavi-cookie-consent" ? "all" : null,
    );
    render(<CookieConsent onAccept={onAccept} onDecline={onDecline} />);
    expect(
      screen.queryByText(/Diese Website verwendet Cookies/i),
    ).not.toBeInTheDocument();
  });

  it('should call onAccept and set cookies/localStorage when "Accept All" is clicked', async () => {
    render(<CookieConsent onAccept={onAccept} onDecline={onDecline} />);

    // Wait for the button to appear
    const acceptButton = await screen.findByRole("button", {
      name: /Alle akzeptieren/i,
    });

    fireEvent.click(acceptButton);

    // Check cookies were set
    expect(Cookies.set).toHaveBeenCalledWith(
      "cookie-consent",
      "all",
      expect.any(Object),
    );
    expect(Cookies.set).toHaveBeenCalledWith(
      "cookie-settings",
      JSON.stringify({
        necessary: true,
        analytics: true,
        marketing: true,
        preferences: true,
      }),
      expect.any(Object),
    );

    // Check localStorage was set
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "alavi-cookie-consent",
      "all",
    );
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "cookie-settings",
      JSON.stringify({
        necessary: true,
        analytics: true,
        marketing: true,
        preferences: true,
      }),
    );

    // Check callback
    expect(onAccept).toHaveBeenCalledTimes(1);
    expect(onAccept).toHaveBeenCalledWith({
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    });
    expect(onDecline).not.toHaveBeenCalled();

    // Check banner is hidden
    // Use queryByRole for non-existence check
    expect(
      screen.queryByRole("heading", {
        name: /Wir respektieren Ihre Privatsphäre/i,
      }),
    ).not.toBeInTheDocument();
  });

  it('should call onDecline and set cookies/localStorage when "Decline" is clicked', async () => {
    render(<CookieConsent onAccept={onAccept} onDecline={onDecline} />);

    // Wait for the button to appear
    const declineButton = await screen.findByRole("button", {
      name: /Nur notwendige/i,
    }); // Updated text

    fireEvent.click(declineButton);

    // Check cookies were set (necessary only)
    expect(Cookies.set).toHaveBeenCalledWith(
      "cookie-consent",
      "necessary",
      expect.any(Object),
    );
    expect(Cookies.set).toHaveBeenCalledWith(
      "cookie-settings",
      JSON.stringify({
        necessary: true,
        analytics: false,
        marketing: false,
        preferences: false,
      }),
      expect.any(Object),
    );

    // Check localStorage was set (necessary only)
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "alavi-cookie-consent",
      "necessary",
    );
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "cookie-settings",
      JSON.stringify({
        necessary: true,
        analytics: false,
        marketing: false,
        preferences: false,
      }),
    );

    // Check callback
    expect(onDecline).toHaveBeenCalledTimes(1);
    expect(onAccept).not.toHaveBeenCalled();

    // Check banner is hidden
    expect(
      screen.queryByRole("heading", {
        name: /Wir respektieren Ihre Privatsphäre/i,
      }),
    ).not.toBeInTheDocument();
  });

  it('should open the settings view when "Einstellungen" is clicked', async () => {
    render(<CookieConsent onAccept={onAccept} onDecline={onDecline} />);

    // Wait for the button to appear
    const settingsButton = await screen.findByRole("button", {
      name: /Einstellungen/i,
    });

    fireEvent.click(settingsButton);

    // Check initial banner is hidden
    expect(
      screen.queryByRole("heading", {
        name: /Wir respektieren Ihre Privatsphäre/i,
      }),
    ).not.toBeInTheDocument();

    // Check settings view is visible by waiting for a unique element in that view
    const settingsDialog = await screen.findByRole("heading", {
      name: /Cookie-Einstellungen/i,
    });
    expect(settingsDialog).toBeInTheDocument();

    // Find the Analyse heading
    const analyseHeading = screen.getByRole("heading", { name: /Analyse/i });
    // Find the parent container of the heading
    const analyseContainer = analyseHeading.closest(
      "div.flex.items-center.justify-between",
    )?.parentElement;
    // Find the switch within that container
    const analyseSwitch = analyseContainer
      ? within(analyseContainer).getByRole("checkbox")
      : null;

    expect(analyseSwitch).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Auswahl speichern/i }),
    ).toBeInTheDocument();
  });

  it("should allow toggling settings and saving custom configuration", async () => {
    render(<CookieConsent onAccept={onAccept} onDecline={onDecline} />);

    // Open settings
    const settingsButton = await screen.findByRole("button", {
      name: /Einstellungen/i,
    });
    fireEvent.click(settingsButton);
    await screen.findByRole("heading", { name: /Cookie-Einstellungen/i });

    // Helper function to find switch by heading name
    const findSwitch = (name: RegExp) => {
      const heading = screen.getByRole("heading", { name });
      const container = heading.closest(
        "div.flex.items-center.justify-between",
      )?.parentElement;
      return container ? within(container).getByRole("checkbox") : null;
    };

    // Find switches
    const analyseSwitch = findSwitch(/Analyse/i);
    const marketingSwitch = findSwitch(/Marketing/i);
    const preferencesSwitch = findSwitch(/Präferenzen/i);

    expect(analyseSwitch).toBeInTheDocument();
    expect(marketingSwitch).toBeInTheDocument();
    expect(preferencesSwitch).toBeInTheDocument();

    // Ensure they are initially off
    expect(analyseSwitch).not.toBeChecked();
    expect(marketingSwitch).not.toBeChecked();
    expect(preferencesSwitch).not.toBeChecked();

    // Toggle switches on
    if (analyseSwitch) fireEvent.click(analyseSwitch);
    if (marketingSwitch) fireEvent.click(marketingSwitch);
    if (preferencesSwitch) fireEvent.click(preferencesSwitch);

    // Verify they are checked in the UI
    expect(analyseSwitch).toBeChecked();
    expect(marketingSwitch).toBeChecked();
    expect(preferencesSwitch).toBeChecked();

    // Save settings
    const saveButton = screen.getByRole("button", {
      name: /Auswahl speichern/i,
    });
    fireEvent.click(saveButton);

    // Verify cookies and localStorage are set with custom settings
    const expectedSettings = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    expect(Cookies.set).toHaveBeenCalledWith(
      "cookie-consent",
      "custom",
      expect.any(Object),
    );
    expect(Cookies.set).toHaveBeenCalledWith(
      "cookie-settings",
      JSON.stringify(expectedSettings),
      expect.any(Object),
    );
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "alavi-cookie-consent",
      "custom",
    );
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "cookie-settings",
      JSON.stringify(expectedSettings),
    );

    // Verify onAccept callback
    expect(onAccept).toHaveBeenCalledTimes(1);
    expect(onAccept).toHaveBeenCalledWith(expectedSettings);
    expect(onDecline).not.toHaveBeenCalled();

    // Verify banner/settings are hidden
    expect(
      screen.queryByRole("heading", { name: /Cookie-Einstellungen/i }),
    ).not.toBeInTheDocument();
  });

  it("should expose openCookieSettings function globally and open settings when called", async () => {
    // Define the custom window type for the test scope
    interface CustomWindow extends Window {
      openCookieSettings?: () => void;
    }
    const customWindow = window as CustomWindow;

    render(<CookieConsent onAccept={onAccept} onDecline={onDecline} />);

    // Check if the function is exposed globally
    expect(customWindow.openCookieSettings).toBeDefined();
    expect(typeof customWindow.openCookieSettings).toBe("function");

    // Call the global function - wrap state update in act
    act(() => {
      customWindow.openCookieSettings?.();
    });

    // Verify the settings panel is opened
    const settingsDialog = await screen.findByRole("heading", {
      name: /Cookie-Einstellungen/i,
    });
    expect(settingsDialog).toBeInTheDocument();

    // Clean up the global function after test if necessary (though unmounting might handle it)
    // delete customWindow.openCookieSettings;
  });

  it("should not render if cookie consent has already been provided", () => {
    // Mock js-cookie get to return a consent value
    vi.spyOn(Cookies, "get").mockReturnValue({ "cookie-consent": "all" });
    render(<CookieConsent onAccept={onAccept} onDecline={onDecline} />);
    // Component should not render
    expect(screen.queryByText("Cookie Consent")).not.toBeInTheDocument();
  });

  it("should render when no cookie consent is stored", () => {
    // Mock js-cookie get to return undefined
    const mockedGet = vi.mocked(Cookies.get);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockedGet.mockReturnValue(undefined as any);
    render(<CookieConsent onAccept={onAccept} onDecline={onDecline} />);
    // Check banner renders
    expect(
      screen.getByRole("heading", { name: /Cookie Consent/i }),
    ).toBeInTheDocument();
  });

  it('should call onAccept with all cookies when "Accept All" is clicked', () => {
    // Mock js-cookie get to return no consent value
    const mockedGet = vi.mocked(Cookies.get);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockedGet.mockReturnValue(undefined as any);

    render(<CookieConsent onAccept={onAccept} onDecline={onDecline} />);
    fireEvent.click(screen.getByRole("button", { name: /Accept All/i }));

    expect(onAccept).toHaveBeenCalledWith({
      analytics: true,
      marketing: true,
      necessary: true,
      preferences: true,
    });
  });
});
