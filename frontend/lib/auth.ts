import { useSyncExternalStore } from 'react';

export type UserRole = 'ADMIN' | 'CUSTOMER' | 'CAJERO';

export interface AuthCustomer {
  _id: string;
  Name: string;
  Surname: string;
  Email: string;
  PhoneNumber: string;
}

export interface AuthUser {
  _id: string;
  Username: string;
  Email: string;
  Role: UserRole;
  CustomerID: string | null;
  Customer: AuthCustomer | null;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}

const AUTH_STORAGE_KEY = 'cinemabook_auth_session';
const AUTH_CHANGE_EVENT = 'cinemabook-auth-changed';
let cachedRawSession: string | null | undefined;
let cachedParsedSession: AuthSession | null = null;

function canUseBrowserStorage() {
  return typeof window !== 'undefined';
}

function updateSessionCache(rawSession: string | null, parsedSession: AuthSession | null) {
  cachedRawSession = rawSession;
  cachedParsedSession = parsedSession;
}

export function getStoredSession(): AuthSession | null {
  if (!canUseBrowserStorage()) {
    return null;
  }

  const rawSession = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (rawSession === cachedRawSession) {
    return cachedParsedSession;
  }

  if (!rawSession) {
    updateSessionCache(null, null);
    return null;
  }

  try {
    const parsedSession = JSON.parse(rawSession) as AuthSession;
    updateSessionCache(rawSession, parsedSession);
    return parsedSession;
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    updateSessionCache(null, null);
    return null;
  }
}

export function storeSession(session: AuthSession) {
  if (!canUseBrowserStorage()) {
    return;
  }

  const rawSession = JSON.stringify(session);
  updateSessionCache(rawSession, session);
  window.localStorage.setItem(AUTH_STORAGE_KEY, rawSession);
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function clearSession() {
  if (!canUseBrowserStorage()) {
    return;
  }

  updateSessionCache(null, null);
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function getAuthToken() {
  return getStoredSession()?.token || null;
}

export function subscribeToAuthChanges(listener: () => void) {
  if (!canUseBrowserStorage()) {
    return () => undefined;
  }

  window.addEventListener(AUTH_CHANGE_EVENT, listener);
  window.addEventListener('storage', listener);

  return () => {
    window.removeEventListener(AUTH_CHANGE_EVENT, listener);
    window.removeEventListener('storage', listener);
  };
}

export function useAuthSession() {
  return useSyncExternalStore(subscribeToAuthChanges, getStoredSession, () => null);
}

export function getUserDisplayName(user: AuthUser | null) {
  if (!user) {
    return '';
  }

  if (user.Customer) {
    return `${user.Customer.Name} ${user.Customer.Surname}`;
  }

  return user.Username || user.Email;
}
