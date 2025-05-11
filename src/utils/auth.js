// src/utils/auth.js

const AUTH_STORAGE_KEY = 'glovo_hr_auth';

/**
 * Save authentication details (e.g., token) to localStorage
 * @param {{ token: string }} authData
 */
export function saveAuth(authData) {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
  } catch (err) {
    console.error('Error saving auth data', err);
  }
}

/**
 * Retrieve authentication details from localStorage
 * @returns {{ token: string } | null}
 */
export function getAuth() {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (err) {
    console.error('Error parsing auth data', err);
    return null;
  }
}

/**
 * Clear authentication details from localStorage
 */
export function clearAuth() {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (err) {
    console.error('Error clearing auth data', err);
  }
}
