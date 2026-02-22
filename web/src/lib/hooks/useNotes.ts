import { useCallback, useMemo, useState } from "react";

import type { Category, Note } from "../api";
import { listCategories, listNotes } from "../api";

export function useNotes({
  onAuthError,
}: {
  onAuthError: () => void;
}): {
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  loading: boolean;
  refresh: () => Promise<void>;
  categoryById: Map<number, Category>;
  categoryCounts: Map<number, number>;
} {
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [cats, noteData] = await Promise.all([listCategories(), listNotes()]);
      setCategories(cats);
      setNotes(noteData);
    } catch {
      onAuthError();
    } finally {
      setLoading(false);
    }
  }, [onAuthError]);

  const categoryById = useMemo(() => {
    const m = new Map<number, Category>();
    categories.forEach((c) => m.set(c.id, c));
    return m;
  }, [categories]);

  const categoryCounts = useMemo(() => {
    const m = new Map<number, number>();
    notes.forEach((n) => {
      if (!n.category) return;
      m.set(n.category, (m.get(n.category) ?? 0) + 1);
    });
    return m;
  }, [notes]);

  return {
    notes,
    setNotes,
    categories,
    setCategories,
    loading,
    refresh,
    categoryById,
    categoryCounts,
  };
}
