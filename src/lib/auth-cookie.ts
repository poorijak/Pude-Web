/**
 * Helper utilities for managing userId cookie on the frontend
 */

export function getUserId(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)userId=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function setUserId(userId: string) {
  if (typeof document === "undefined") return;
  document.cookie = `userId=${encodeURIComponent(
    userId,
  )}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;
}

export function clearUserId() {
  if (typeof document === "undefined") return;
  document.cookie = `userId=; path=/; max-age=0; SameSite=Lax`;
}
