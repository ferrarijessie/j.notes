import { renderHook, act } from '@testing-library/react';

import { useNoteDraft } from '../src/lib/hooks/useNoteDraft';

type Note = {
  id: number;
  title: string;
  content: string;
  category: number | null;
  created_at?: string;
  updated_at?: string;
};

type Category = {
  id: number;
  name: string;
  color?: string;
};

jest.mock('../src/lib/api', () => {
  return {
    createNote: jest.fn(async ({ title, content, category }: any) => ({
      id: 1,
      title,
      content,
      category: category ?? null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })),
    updateNote: jest.fn(async () => undefined),
    listCategories: jest.fn(async () => [
      { id: 10, name: 'Random Thoughts', color: '#EF9C66' },
      { id: 11, name: 'School', color: '#FCDC94' },
    ]),
  };
});

const api = jest.requireMock('../src/lib/api') as {
  createNote: jest.Mock;
  updateNote: jest.Mock;
  listCategories: jest.Mock;
};

beforeEach(() => {
  jest.useFakeTimers();
  api.createNote.mockClear();
  api.updateNote.mockClear();
  api.listCategories.mockClear();
});

afterEach(() => {
  jest.useRealTimers();
});

test('autosaves after debounce when dirty', async () => {
  const setCategories = jest.fn();
  const setNotes = jest.fn();
  const refresh = jest.fn(async () => undefined);
  const onAuthError = jest.fn();

  const initialCategories: Category[] = [
    { id: 10, name: 'Random Thoughts', color: '#EF9C66' },
  ];

  const { result } = renderHook(() =>
    useNoteDraft({
      categories: initialCategories,
      setCategories,
      setNotes,
      refresh,
      onAuthError,
    }),
  );

  const note: Note = { id: 42, title: 'T', content: 'C', category: 10 };

  act(() => {
    result.current.openExistingNote(note as any);
  });

  act(() => {
    result.current.onChangeContent('C2');
  });

  expect(api.updateNote).not.toHaveBeenCalled();

  await act(async () => {
    jest.advanceTimersByTime(900);
  });

  expect(api.updateNote).toHaveBeenCalledTimes(1);
  expect(api.updateNote.mock.calls[0][0]).toBe(42);
  expect(api.updateNote.mock.calls[0][1]).toMatchObject({
    title: 'T',
    content: 'C2',
    category: 10,
  });
});

test('does not autosave when not dirty', async () => {
  const setCategories = jest.fn();
  const setNotes = jest.fn();
  const refresh = jest.fn(async () => undefined);
  const onAuthError = jest.fn();

  const { result } = renderHook(() =>
    useNoteDraft({
      categories: [],
      setCategories,
      setNotes,
      refresh,
      onAuthError,
    }),
  );

  act(() => {
    result.current.openExistingNote({ id: 1, title: 'T', content: 'C', category: null } as any);
  });

  await act(async () => {
    jest.advanceTimersByTime(2000);
  });

  expect(api.updateNote).not.toHaveBeenCalled();
});

test('flushes pending changes on close', async () => {
  const setCategories = jest.fn();
  const setNotes = jest.fn();
  const refresh = jest.fn(async () => undefined);
  const onAuthError = jest.fn();

  const { result } = renderHook(() =>
    useNoteDraft({
      categories: [{ id: 10, name: 'Random Thoughts', color: '#EF9C66' }],
      setCategories,
      setNotes,
      refresh,
      onAuthError,
    }),
  );

  act(() => {
    result.current.openExistingNote({ id: 7, title: 'T', content: 'C', category: 10 } as any);
  });

  act(() => {
    result.current.onChangeTitle('T2');
  });

  await act(async () => {
    await result.current.closeNote();
  });

  expect(api.updateNote).toHaveBeenCalledTimes(1);
  expect(api.updateNote.mock.calls[0][0]).toBe(7);
  expect(api.updateNote.mock.calls[0][1]).toMatchObject({
    title: 'T2',
    content: 'C',
    category: 10,
  });

  expect(refresh).toHaveBeenCalledTimes(1);
});
