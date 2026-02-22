import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { Category, Note } from "../api";
import { createNote, listCategories, updateNote } from "../api";

const DEFAULT_TITLE = "Note Title";
const DEFAULT_CONTENT = "Note content...";

export function useNoteDraft({
  categories,
  setCategories,
  setNotes,
  refresh,
  onAuthError,
}: {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  refresh: () => Promise<void>;
  onAuthError: () => void;
}): {
  filterCategoryId: number | null;
  setFilterCategoryId: React.Dispatch<React.SetStateAction<number | null>>;
  showNoteEditor: boolean;
  draftNoteId: number | null;
  title: string;
  content: string;
  draftCategoryId: number | null;
  lastEditedAt: Date | null;
  error: string | null;
  openNewNote: () => Promise<void>;
  openExistingNote: (note: Note) => void;
  closeNote: () => Promise<void>;
  onChangeTitle: (v: string) => void;
  onChangeContent: (v: string) => void;
  onSelectDraftCategoryId: (id: number | null) => void;
} {
  const [filterCategoryId, setFilterCategoryId] = useState<number | null>(null);

  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [draftNoteId, setDraftNoteId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [draftCategoryId, setDraftCategoryId] = useState<number | null>(null);
  const [lastEditedAt, setLastEditedAt] = useState<Date | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const autosaveTimerRef = useRef<number | null>(null);
  const savingRef = useRef(false);

  const defaultCategoryId = useMemo(() => {
    const randomThoughts = categories.find((c) => c.name.trim().toLowerCase() === "random thoughts");
    return randomThoughts ? randomThoughts.id : null;
  }, [categories]);

  const saveDraft = useCallback(
    async (flush: boolean): Promise<boolean> => {
      if (!showNoteEditor) return true;
      if (savingRef.current) return true;
      if (!isDirty && !flush) return true;

      const hasAnyInput = Boolean(title.trim() || content.trim() || draftCategoryId);
      if (!hasAnyInput) return true;

      savingRef.current = true;
      setError(null);
      try {
        if (draftNoteId == null) {
          const created = await createNote({ title: title.trim(), content, category: draftCategoryId });
          setDraftNoteId(created.id);
        } else {
          await updateNote(draftNoteId, { title: title.trim(), content, category: draftCategoryId });
        }
        setIsDirty(false);
        return true;
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to save note");
        return false;
      } finally {
        savingRef.current = false;
      }
    },
    [content, draftCategoryId, draftNoteId, isDirty, showNoteEditor, title],
  );

  useEffect(() => {
    if (!showNoteEditor) return;
    if (!isDirty) return;
    if (autosaveTimerRef.current) window.clearTimeout(autosaveTimerRef.current);
    autosaveTimerRef.current = window.setTimeout(() => {
      void saveDraft(false);
    }, 900);

    return () => {
      if (autosaveTimerRef.current) window.clearTimeout(autosaveTimerRef.current);
    };
  }, [title, content, draftCategoryId, showNoteEditor, isDirty, saveDraft]);

  const openNewNote = useCallback(async () => {
    setError(null);
    setDraftNoteId(null);
    setIsDirty(false);
    setTitle(DEFAULT_TITLE);
    setContent(DEFAULT_CONTENT);
    setLastEditedAt(null);

    let cats = categories;
    if (cats.length === 0) {
      try {
        cats = await listCategories();
        setCategories(cats);
      } catch {
        onAuthError();
        return;
      }
    }

    const rt = cats.find((c) => c.name.trim().toLowerCase() === "random thoughts");
    const newDefaultCategoryId = rt ? rt.id : null;
    setDraftCategoryId(newDefaultCategoryId);

    setShowNoteEditor(true);

    try {
      const created = await createNote({ title: DEFAULT_TITLE, content: DEFAULT_CONTENT, category: newDefaultCategoryId });
      setDraftNoteId(created.id);
      setLastEditedAt(
        created.updated_at ? new Date(created.updated_at) : created.created_at ? new Date(created.created_at) : null,
      );
      setNotes((prev) => [created, ...prev.filter((n) => n.id !== created.id)]);
    } catch {
      onAuthError();
    }
  }, [categories, onAuthError, setCategories, setNotes]);

  const openExistingNote = useCallback(
    (note: Note) => {
      setError(null);
      setShowNoteEditor(true);
      setDraftNoteId(note.id);
      setTitle(note.title ?? "");
      setContent(note.content ?? "");
      setDraftCategoryId(note.category ?? null);
      setLastEditedAt(note.updated_at ? new Date(note.updated_at) : note.created_at ? new Date(note.created_at) : null);
      setIsDirty(false);
    },
    [],
  );

  const closeNote = useCallback(async () => {
    if (autosaveTimerRef.current) window.clearTimeout(autosaveTimerRef.current);
    const ok = await saveDraft(true);
    if (!ok) return;

    setShowNoteEditor(false);
    setFilterCategoryId(null);
    setError(null);
    setDraftNoteId(null);
    setIsDirty(false);
    setTitle("");
    setContent("");
    setDraftCategoryId(defaultCategoryId);
    setLastEditedAt(null);
    await refresh();
  }, [defaultCategoryId, refresh, saveDraft]);

  const onChangeTitle = useCallback((v: string) => {
    setTitle(v);
    setLastEditedAt(new Date());
    setIsDirty(true);
  }, []);

  const onChangeContent = useCallback((v: string) => {
    setContent(v);
    setLastEditedAt(new Date());
    setIsDirty(true);
  }, []);

  const onSelectDraftCategoryId = useCallback((id: number | null) => {
    setDraftCategoryId(id);
    setLastEditedAt(new Date());
    setIsDirty(true);
  }, []);

  return {
    filterCategoryId,
    setFilterCategoryId,
    showNoteEditor,
    draftNoteId,
    title,
    content,
    draftCategoryId,
    lastEditedAt,
    error,
    openNewNote,
    openExistingNote,
    closeNote,
    onChangeTitle,
    onChangeContent,
    onSelectDraftCategoryId,
  };
}
