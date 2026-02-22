export type Note = {
  id: number;
  title: string;
  content: string;
  category: number | null;
  category_name?: string;
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: number;
  name: string;
  color?: string;
  user?: number | null;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

export async function listNotes(): Promise<Note[]> {
  const res = await fetch(`${API_URL}/api/notes/`, { cache: "no-store", credentials: "include" });
  if (!res.ok) {
    throw new Error(`Failed to fetch notes: ${res.status}`);
  }
  return res.json();
}

export async function listCategories(): Promise<Category[]> {
  const res = await fetch(`${API_URL}/api/categories/`, { cache: "no-store", credentials: "include" });
  if (!res.ok) {
    throw new Error(`Failed to fetch categories: ${res.status}`);
  }
  return res.json();
}

export async function createNote(input: { title: string; content: string; category?: number | null }): Promise<Note> {
  const csrf = getCookie("csrftoken");
  const res = await fetch(`${API_URL}/api/notes/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(csrf ? { "X-CSRFToken": csrf } : {}),
    },
    credentials: "include",
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error(`Failed to create note: ${res.status}`);
  }
  return res.json();
}

export async function updateNote(
  id: number,
  input: { title?: string; content?: string; category?: number | null },
): Promise<Note> {
  const csrf = getCookie("csrftoken");
  const res = await fetch(`${API_URL}/api/notes/${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(csrf ? { "X-CSRFToken": csrf } : {}),
    },
    credentials: "include",
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error(`Failed to update note: ${res.status}`);
  }
  return res.json();
}
