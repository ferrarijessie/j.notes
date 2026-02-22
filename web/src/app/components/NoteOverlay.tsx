"use client";

import React from "react";

import { Block } from "baseui/block";
import { Banner, KIND as BANNER_KIND } from "baseui/banner";
import { Button, KIND, SIZE } from "baseui/button";
import { Input } from "baseui/input";
import { StatefulPopover } from "baseui/popover";
import { StatefulMenu } from "baseui/menu";
import { Textarea } from "baseui/textarea";

import type { Category } from "../../lib/api";

import { hexWithAlpha, lastEditedLabel } from "../../lib/ui";

type Props = {
  open: boolean;
  categories: Category[];
  selectedCategoryId: number | null;
  onSelectCategoryId: (id: number | null) => void;
  title: string;
  onChangeTitle: (v: string) => void;
  content: string;
  onChangeContent: (v: string) => void;
  error: string | null;
  lastEditedAt: Date | null;
  onEdited: () => void;
  onClose: () => void;
};

export default function NoteOverlay({
  open,
  categories,
  selectedCategoryId,
  onSelectCategoryId,
  title,
  onChangeTitle,
  content,
  onChangeContent,
  error,
  lastEditedAt,
  onEdited,
  onClose,
}: Props) {
  const selectedCategory = React.useMemo(
    () => (selectedCategoryId ? categories.find((c) => c.id === selectedCategoryId) ?? null : null),
    [categories, selectedCategoryId],
  );

  const categoryLabel = selectedCategory?.name ?? "Select category";

  const categoryThemeColor = selectedCategory?.color ?? "#f4a26a";
  const canvasBorderColor = hexWithAlpha(categoryThemeColor, 0.65);
  const canvasBgColor = hexWithAlpha(categoryThemeColor, 0.22);

  const displayTitle = React.useMemo(() => {
    if (!title.trim()) return "";
    if (title === "Note Title") return "";
    return title;
  }, [title]);

  const displayContent = React.useMemo(() => {
    if (content === "Note content...") return "";
    return content;
  }, [content]);

  const categoryItems = React.useMemo(
    () =>
      categories.map((c, idx) => {
        const dotColor = c.color ?? "#f4a26a";
        return {
          id: c.id,
          label: (
            <Block display="flex" alignItems="center" style={{ gap: "14px", width: "200px" }}>
              <Block
                as="span"
                overrides={{
                  Block: {
                    style: {
                      width: "14px",
                      height: "14px",
                      borderRadius: "999px",
                      backgroundColor: dotColor,
                      display: "inline-block",
                    },
                  },
                }}
              />
              <Block
                as="span"
                overrides={{
                  Block: {
                    style: {
                      fontSize: "20px",
                      color: "#3a2a1b",
                      fontWeight: 100,
                      lineHeight: 1.1,
                    },
                  },
                }}
              >
                {c.name}
              </Block>
            </Block>
          ),
        };
      }),
    [categories],
  );

  if (!open) return null;

  return (
    <Block
      overrides={{
        Block: {
          style: {
            position: "fixed",
            inset: 0,
            zIndex: 50,
            backgroundColor: "#fbf1e3",
          },
        },
      }}
    >
      <Block overrides={{ Block: { style: { padding: "2% 16%", boxSizing: "border-box", height: "100%" } } }}>
        <Block
          overrides={{
            Block: {
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "5px",
              },
            },
          }}
        >
          <Block overrides={{ Block: { style: { width: "260px" } } }}>
            <StatefulPopover
              placement="bottomLeft"
              returnFocus
              overrides={{
                Body: {
                  style: {
                    zIndex: 9999,
                  },
                },
              }}
              content={({ close }) => (
                <StatefulMenu
                  items={categoryItems}
                  onItemSelect={(info) => {
                    const item = info.item as { id: number | null; label: string };
                    onSelectCategoryId(item.id);
                    onEdited();
                    close();
                  }}
                  overrides={{
                    List: {
                      style: {
                        backgroundColor: "#f7efe2",
                        borderRadius: "16px",
                        border: "none",
                        boxShadow: "0 12px 34px #3a2a1b26",
                        paddingTop: "10px",
                        paddingBottom: "10px",
                        paddingLeft: "10px",
                        paddingRight: "10px",
                      },
                    },
                    Option: {
                      style: ({ $isHighlighted }) => ({
                        paddingTop: "16px",
                        paddingBottom: "16px",
                        paddingLeft: "16px",
                        paddingRight: "16px",
                        borderRadius: "12px",
                        backgroundColor: $isHighlighted ? "rgba(139, 94, 43, 0.08)" : "transparent",
                      }),
                    },
                  }}
                />
              )}
            >
              <Button
                type="button"
                kind={KIND.secondary}
                size={SIZE.compact}
                overrides={{
                  BaseButton: {
                    style: {
                      width: "100%",
                      justifyContent: "space-between",
                      height: "45px",
                      minHeight: "45px",
                      borderRadius: "12px",
                      borderColor: "#8b5e2b99",
                      borderWidth: "1px",
                      borderStyle: "solid",
                      backgroundColor: "transparent",
                      color: "#3a2a1b",
                      paddingTop: 0,
                      paddingBottom: 0,
                      paddingLeft: "14px",
                      paddingRight: "14px",
                      alignItems: "center",
                    },
                  },
                }}
              >
                <Block display="flex" alignItems="center" $style={{ gap: "12px" }}>
                  <Block
                    $style={{
                      width: "14px",
                      height: "14px",
                      borderRadius: "999px",
                      background: selectedCategory?.color ?? "#f4a26a",
                      display: "inline-block",
                    }}
                  />
                  <Block as="span" $style={{ fontSize: "20px", fontWeight: 100, lineHeight: 1.1 }}>
                    {categoryLabel}
                  </Block>
                </Block>
                <Block
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  $style={{ marginLeft: "10px", height: "100%" }}
                >
                  <Block
                    $style={{
                      width: "10px",
                      height: "10px",
                      borderRight: "2px solid #8b5e2b99",
                      borderBottom: "2px solid #8b5e2b99",
                      transform: "rotate(45deg)",
                    }}
                  />
                </Block>
              </Button>
            </StatefulPopover>
          </Block>

          <Button
            type="button"
            kind={KIND.tertiary}
            size={SIZE.compact}
            onClick={onClose}
            overrides={{
              BaseButton: {
                style: {
                  paddingRight: 0,
                  border: "none",
                  borderRadius: 0,
                  color: "#8b5e2b99",
                  backgroundColor: "transparent",
                  fontSize: "48px",
                  fontWeight: 100,
                  lineHeight: 1,
                  ':hover': {
                    backgroundColor: "transparent",
                    opacity: 0.8,
                  },
                  ':active': {
                    backgroundColor: "transparent",
                    opacity: 0.65,
                  },
                },
              },
            }}
          >
            ×
          </Button>
        </Block>

        <Block
          overrides={{
            Block: {
              style: {
                height: "calc(100% - 52px)",
                borderRadius: "10px",
                border: `2px solid ${canvasBorderColor}`,
                backgroundColor: canvasBgColor,
                padding: "39px 64px 64px 64px",
                boxSizing: "border-box",
                position: "relative",
              },
            },
          }}
        >
          <Block
            overrides={{
              Block: {
                style: {
                  padding: "20px 0 20px 0",
                  justifySelf: "flex-end",
                  color: "#3a2a1b99",
                  fontSize: "12px",
                },
              },
            }}
          >
            Last Edited: {lastEditedAt ? lastEditedLabel(lastEditedAt) : "—"}
          </Block>

          {error ? (
            <Block overrides={{ Block: { style: { marginBottom: "10px" } } }}>
              <Banner kind={BANNER_KIND.negative}>{error}</Banner>
            </Block>
          ) : null}

          <Input
            value={displayTitle}
            onChange={(e) => {
              onChangeTitle((e.target as HTMLInputElement).value);
              onEdited();
            }}
            placeholder="Note Title"
            overrides={{
              Root: {
                style: {
                  border: "0px",
                  backgroundColor: "transparent",
                },
              },
              InputContainer: {
                style: {
                  backgroundColor: "transparent",
                  boxShadow: "none",
                },
              },
              Input: {
                style: {
                  paddingLeft: 0,
                  paddingRight: 0,
                  fontSize: "26px",
                  fontWeight: 700,
                  color: "#3a2a1b",
                  fontFamily: "ui-serif, Georgia, serif",
                  backgroundColor: "transparent",
                  border: 0,
                },
              },
            }}
          />

          <Block overrides={{ Block: { style: { height: "12px" } } }} />

          <Textarea
            value={displayContent}
            onChange={(e) => {
              onChangeContent((e.target as HTMLTextAreaElement).value);
              onEdited();
            }}
            placeholder="Pour your heart out..."
            overrides={{
              Root: {
                style: {
                  border: "0px",
                  backgroundColor: "transparent",
                  height: "stretch"
                },
              },
              InputContainer: {
                style: {
                  border: "none",
                  backgroundColor: "transparent",
                  boxShadow: "none",
                },
              },
              Input: {
                style: {
                  paddingLeft: 0,
                  paddingRight: 0,
                  fontSize: "16px",
                  color: "#3a2a1b",
                  resize: "none",
                  lineHeight: 1.6,
                  backgroundColor: "transparent",
                  border: "none",
                },
              },
            }}
          />
        </Block>
      </Block>
    </Block>
  );
}
