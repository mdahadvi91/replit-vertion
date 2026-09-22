import { useState, useEffect, useCallback } from 'react';

const FAVORITES_STORAGE_KEY = 'ahadex_favorite_tools';

export function getFavoriteToolIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveFavoriteToolIds(ids: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids));
    window.dispatchEvent(new Event('ahadex_favorites_changed'));
  } catch (e) {
    console.error('Failed to save favorites to localStorage', e);
  }
}

export function useFavoriteTools() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => getFavoriteToolIds());

  useEffect(() => {
    const handleUpdate = () => {
      setFavoriteIds(getFavoriteToolIds());
    };
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('ahadex_favorites_changed', handleUpdate);
    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('ahadex_favorites_changed', handleUpdate);
    };
  }, []);

  const toggleFavorite = useCallback((toolId: string) => {
    setFavoriteIds((prev) => {
      const exists = prev.includes(toolId);
      const next = exists ? prev.filter((id) => id !== toolId) : [...prev, toolId];
      saveFavoriteToolIds(next);
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (toolId: string) => favoriteIds.includes(toolId),
    [favoriteIds]
  );

  return { favoriteIds, toggleFavorite, isFavorite };
}
