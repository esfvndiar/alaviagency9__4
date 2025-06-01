/**
 * Type-safe local storage utility
 * Provides a consistent API for working with browser storage
 */

// Define storage keys to prevent typos and ensure type safety
export const STORAGE_KEYS = {
  THEME: "alavi-theme",
  USER_PREFERENCES: "alavi-user-preferences",
  AUTH_TOKEN: "alavi-auth-token",
  FORM_DRAFT: "alavi-form-draft",
  VIEWED_ANNOUNCEMENTS: "alavi-viewed-announcements",
  SERVICE_WORKER_UPDATED: "alavi-sw-updated",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

/**
 * Get an item from local storage with type safety
 */
export function getStorageItem<T>(key: StorageKey, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error getting item from localStorage: ${key}`, error);
    return defaultValue;
  }
}

/**
 * Set an item in local storage with type safety
 */
export function setStorageItem<T>(key: StorageKey, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting item in localStorage: ${key}`, error);
  }
}

/**
 * Remove an item from local storage
 */
export function removeStorageItem(key: StorageKey): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing item from localStorage: ${key}`, error);
  }
}

/**
 * Clear all items from local storage
 */
export function clearStorage(): void {
  try {
    localStorage.clear();
  } catch (error) {
    console.error("Error clearing localStorage", error);
  }
}

/**
 * Create a typed storage object for a specific key
 * This provides a more convenient API for working with complex objects
 */
export function createTypedStorage<T>(key: StorageKey, defaultValue: T) {
  return {
    get: () => getStorageItem<T>(key, defaultValue),
    set: (value: T) => setStorageItem<T>(key, value),
    update: (updater: (prev: T) => T) => {
      const currentValue = getStorageItem<T>(key, defaultValue);
      const newValue = updater(currentValue);
      setStorageItem<T>(key, newValue);
      return newValue;
    },
    remove: () => removeStorageItem(key),
  };
}

// Pre-configured storage objects for common use cases
export const themeStorage = createTypedStorage<"light" | "dark" | "system">(
  STORAGE_KEYS.THEME,
  "system",
);

export const userPreferencesStorage = createTypedStorage<{
  notifications: boolean;
  animations: boolean;
  fontSize: "small" | "medium" | "large";
}>(STORAGE_KEYS.USER_PREFERENCES, {
  notifications: true,
  animations: true,
  fontSize: "medium",
});

export const formDraftStorage = createTypedStorage<Record<string, unknown>>(
  STORAGE_KEYS.FORM_DRAFT,
  {},
);

export default {
  getStorageItem,
  setStorageItem,
  removeStorageItem,
  clearStorage,
  createTypedStorage,
  STORAGE_KEYS,
  themeStorage,
  userPreferencesStorage,
  formDraftStorage,
};
