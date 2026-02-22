
"use client";

import { useEffect, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Block } from "baseui/block";
import { Button, KIND, SHAPE, SIZE } from "baseui/button";
import { Spinner } from "baseui/spinner";
import { LabelSmall, ParagraphMedium } from "baseui/typography";

import { hexWithAlpha, noteDateLabel } from "../lib/ui";

import { useNoteDraft } from "../lib/hooks/useNoteDraft";
import { useNotes } from "../lib/hooks/useNotes";

import NoteOverlay from "./components/NoteOverlay";

export default function HomePage() {
  const router = useRouter();
  const notesState = useNotes({
    onAuthError: () => router.replace("/login"),
  });

  const draft = useNoteDraft({
    categories: notesState.categories,
    setCategories: notesState.setCategories,
    setNotes: notesState.setNotes,
    refresh: notesState.refresh,
    onAuthError: () => router.replace("/login"),
  });

  const filteredNotes = useMemo(
    () => (draft.filterCategoryId ? notesState.notes.filter((n) => n.category === draft.filterCategoryId) : notesState.notes),
    [notesState.notes, draft.filterCategoryId],
  );

  useEffect(() => {
    void notesState.refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Block
      as="main"
      overrides={{
        Block: {
          style: {
            minHeight: "100vh",
            backgroundColor: "#fbf1e3",
          },
        },
      }}
    >
      <Block
        overrides={{
          Block: {
            style: {
              padding: "2% 17%",
              boxSizing: "border-box",
              position: "relative",
            },
          },
        }}
      >
        <Block overrides={{ Block: { style: { display: "flex", justifyContent: "flex-end", paddingRight: "1.8%" } } }}>
              <Button
                type="button"
                onClick={() => void draft.openNewNote()}
                kind={KIND.secondary}
                size={SIZE.compact}
                shape={SHAPE.pill}
                overrides={{
                  BaseButton: {
                    style: {
                      borderColor: "#8b5e2b8c",
                      borderWidth: "1px",
                      borderStyle: "solid",
                      backgroundColor: "transparent",
                      color: "#8b5e2b",
                      fontWeight: 600,
                      paddingTop: "8px",
                      paddingBottom: "8px",
                      paddingLeft: "14px",
                      paddingRight: "14px",
                    },
                  },
                }}
              >
                + New Note
              </Button>
            </Block>
            
        <NoteOverlay
          open={draft.showNoteEditor}
          categories={notesState.categories}
          selectedCategoryId={draft.draftCategoryId}
          onSelectCategoryId={draft.onSelectDraftCategoryId}
          title={draft.title}
          onChangeTitle={draft.onChangeTitle}
          content={draft.content}
          onChangeContent={draft.onChangeContent}
          error={draft.error}
          lastEditedAt={draft.lastEditedAt}
          onEdited={() => {}}
          onClose={() => void draft.closeNote()}
        />

        <Block
          overrides={{
            Block: {
              style: {
                display: "grid",
                gridTemplateColumns: "240px 1fr",
                alignItems: "start",
                columnGap: "40px",
                marginTop: "18px",
                '@media screen and (max-width: 920px)': {
                  gridTemplateColumns: "1fr",
                  rowGap: "22px",
                },
              },
            },
          }}
        >
          
          <Block>
            <Block overrides={{ Block: { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" } } }}>
              <Block
                as="button"
                onClick={() => draft.setFilterCategoryId(null)}
                overrides={{
                  Block: {
                    style: {
                      border: "none",
                      backgroundColor: "transparent",
                      padding: 0,
                      cursor: "pointer",
                      textAlign: "left",
                    },
                  },
                }}
              >
                <LabelSmall overrides={{ Block: { style: { fontWeight: 700, color: "#3a2a1b", margin: 0 } } }}>
                  All Categories
                </LabelSmall>
              </Block>
            </Block>

            <Block overrides={{ Block: { style: { display: "grid", gap: "8px" } } }}>
              {notesState.categories.map((c, idx) => {
                const isSelected = draft.filterCategoryId === c.id;
                const dots = ["#d88a6a", "#f0c27b", "#7ab7b3", "#b3a3d6"];
                const dotColor = c.color ?? dots[idx % dots.length];
                const count = notesState.categoryCounts.get(c.id) ?? 0;

                return (
                  <Block
                    key={c.id}
                    as="button"
                    onClick={() => draft.setFilterCategoryId(isSelected ? null : c.id)}
                    overrides={{
                      Block: {
                        style: {
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          border: "none",
                          backgroundColor: "transparent",
                          padding: 0,
                          textAlign: "left",
                          cursor: "pointer",
                          color: isSelected ? "#8b5e2b" : "#3a2a1b",
                          fontSize: "12px",
                        },
                      },
                    }}
                  >
                    <Block as="span" overrides={{ Block: { style: { width: "8px", height: "8px", borderRadius: "999px", background: dotColor, display: "inline-block" } } }} />
                    <Block as="span" overrides={{ Block: { style: { fontWeight: isSelected ? 700 : 500, flex: 1 } } }}>{c.name}</Block>
                    <Block as="span" overrides={{ Block: { style: { opacity: 0.75, fontWeight: 500 } } }}>{count}</Block>
                  </Block>
                );
              })}
            </Block>
          </Block>

          <Block>
            <Block>
              {notesState.loading ? (
                <Block overrides={{ Block: { style: { display: "flex", alignItems: "center", gap: "10px", color: "#8b5e2b" } } }}>
                  <Spinner size={20} />
                  <ParagraphMedium color="#8b5e2b">Loading…</ParagraphMedium>
                </Block>
              ) : filteredNotes.length === 0 && !draft.showNoteEditor ? (
                <Block overrides={{ Block: { style: { textAlign: "center" } } }}>
                  <Image src="/bobba.png" alt="Boba" width={220} height={220} priority style={{ margin: "0 auto" }} />
                  <ParagraphMedium
                    overrides={{
                      Block: {
                        style: {
                          marginTop: "18px",
                          marginBottom: 0,
                          fontSize: "18px",
                          color: "#8b5e2b",
                          fontFamily: "ui-serif, Georgia, serif",
                        },
                      },
                    }}
                  >
                    I’m just here waiting for your charming notes...
                  </ParagraphMedium>
                </Block>
              ) : !draft.showNoteEditor ? (
                <Block
                  overrides={{
                    Block: {
                      style: {
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, 303px)",
                        gap: "22px",
                        justifyContent: "flex-start",
                      },
                    },
                  }}
                >
                  {filteredNotes.map((n) => {
                    const cat = n.category ? notesState.categoryById.get(n.category) ?? null : null;
                    const theme = cat?.color ?? "#f4a26a";
                    const border = hexWithAlpha(theme, 0.6);
                    const bg = hexWithAlpha(theme, 0.22);
                    const dateLabel = noteDateLabel(n.updated_at || n.created_at);
                    const preview = (n.content ?? "").trim();
                    return (
                      <Block
                        key={n.id}
                        as="button"
                        onClick={() => draft.openExistingNote(n)}
                        overrides={{
                          Block: {
                            style: {
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-start",
                              justifyContent: "flex-start",
                              textAlign: "left",
                              cursor: "pointer",
                              border: "none",
                              borderRadius: "10px",
                              outline: "none",
                              border: `2px solid ${border}`,
                              backgroundColor: bg,
                              padding: "16px",
                              boxSizing: "border-box",
                              width: "303px",
                              height: "246px",
                              overflow: "hidden",
                              ':hover': {
                                boxShadow: `0 10px 26px ${hexWithAlpha(theme, 0.18)}`,
                              },
                              ':focus-visible': {
                                boxShadow: `0 0 0 2px ${hexWithAlpha(theme, 0.35)}`,
                              },
                            },
                          },
                        }}
                      >
                        <Block
                          overrides={{
                            Block: {
                              style: {
                                display: "flex",
                                alignItems: "baseline",
                                gap: "14px",
                                marginBottom: "8px",
                                fontSize: "11px",
                                color: "#3a2a1bd9",
                              },
                            },
                          }}
                        >
                          <Block as="span" overrides={{ Block: { style: { fontWeight: 700 } } }}>{dateLabel}</Block>
                          {cat ? <Block as="span" overrides={{ Block: { style: { fontWeight: 400 } } }}>{cat.name}</Block> : null}
                        </Block>

                        <Block
                          overrides={{
                            Block: {
                              style: {
                                fontSize: "26px",
                                fontWeight: 700,
                                color: "#3a2a1b",
                                fontFamily: "ui-serif, Georgia, serif",
                                lineHeight: 1.1,
                                marginBottom: "10px",
                                wordBreak: "break-word",
                              },
                            },
                          }}
                        >
                          {n.title}
                        </Block>

                        <Block
                          overrides={{
                            Block: {
                              style: {
                                whiteSpace: "pre-wrap",
                                color: "#3a2a1bd9",
                                fontSize: "12px",
                                lineHeight: 1.45,
                                display: "-webkit-box",
                                WebkitLineClamp: 7,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              },
                            },
                          }}
                        >
                          {preview || "\u00a0"}
                        </Block>
                      </Block>
                    );
                  })}
                </Block>
              ) : null}
            </Block>
          </Block>
        </Block>
      </Block>
    </Block>
  );
}
