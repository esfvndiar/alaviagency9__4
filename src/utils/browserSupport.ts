/**
 * Browser support detection utilities
 */

export const getBrowserInfo = () => {
  let cookiesSupported = true;
  let localStorageSupported = true;

  // Check cookies support
  try {
    // Use a more robust check
    document.cookie = "cookietest=1; SameSite=Lax";
    cookiesSupported = document.cookie.indexOf("cookietest=") !== -1;
    // Clean up cookie
    document.cookie =
      "cookietest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT; SameSite=Lax; path=/";
  } catch (e) {
    cookiesSupported = false;
  }

  // Check localStorage support
  try {
    const testKey = "ls_test";
    localStorage.setItem(testKey, "test");
    localStorage.removeItem(testKey);
    localStorageSupported = true;
  } catch (e) {
    localStorageSupported = false;
  }

  return { cookiesSupported, localStorageSupported };
};
