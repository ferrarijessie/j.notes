"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
  
import { Block } from "baseui/block";
import { Button } from "baseui/button";
import { Avatar } from "baseui/avatar";
import ChevronDownSmallFilled from "baseui/icon/chevron-down";
import ChevronUpSmallFilled from "baseui/icon/chevron-up";
import { StatefulMenu } from "baseui/menu";
import { StatefulPopover, PLACEMENT, TRIGGER_TYPE } from "baseui/popover";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

async function ensureCsrfCookie(): Promise<void> {
  await fetch(`${API_URL}/api/auth/csrf/`, { credentials: "include" });
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const hide = pathname === "/login" || pathname === "/signup";

  useEffect(() => {
    if (hide) return;

    (async () => {
      const res = await fetch(`${API_URL}/api/auth/me/`, { credentials: "include" });
      if (res.ok) {
        const data = (await res.json()) as { user: { email: string } };
        setEmail(data.user.email);
      } else {
        setEmail(null);
      }
    })();
  }, [hide]);

  async function onLogout() {
    await ensureCsrfCookie();
    const csrf = getCookie("csrftoken");
    await fetch(`${API_URL}/api/auth/logout/`, {
      method: "POST",
      headers: {
        ...(csrf ? { "X-CSRFToken": csrf } : {}),
      },
      credentials: "include",
    });
    router.replace("/login");
  }

  if (hide) return null;

  return (
    <Block
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      paddingLeft="5%"
      paddingRight="5%"
      height="64px"
      position="sticky"
      top="0"
      zIndex={10}
      backgroundColor="#fbf1e3d9"
      overrides={{
        Block: {
          style: {
            backdropFilter: "blur(6px)",
            borderBottom: "1px solid #95713940",
          },
        },
      }}
    >
      <Block font="font450" color="#8b5e2b" overrides={{ Block: { style: { fontWeight: 700 } } }}>
        J.Notes
      </Block>

      <StatefulPopover
        placement={PLACEMENT.bottomRight}
        triggerType={TRIGGER_TYPE.click}
        autoFocus={false}
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
        content={({ close }) => (
          <Block width="275px">
            <Block
              display="flex"
              alignItems="center"
              gap="12px"
              paddingTop="16px"
              paddingBottom="12px"
              paddingLeft="16px"
              paddingRight="16px"
              overrides={{
                Block: {
                  style: {
                    borderBottom: "1px solid #95713926",
                  },
                },
              }}
            >
              <Avatar
                name={email ?? ""}
                size="40px"
                overrides={{
                  Root: {
                    style: {
                      backgroundColor: "#8b5e2b",
                      color: "#fbf1e3",
                    },
                  },
                }}
              />
              <Block color="#8b5e2b" overrides={{ Block: { style: { fontWeight: 600, marginLeft: "8px" } } }}>
                {email}
              </Block>
            </Block>

            <StatefulMenu
              items={[{ label: "Logout" }]}
              onItemSelect={() => {
                close();
                onLogout();
              }}
              overrides={{
                List: {
                  style: {
                    backgroundColor: "transparent",
                    paddingTop: "8px",
                    paddingBottom: "12px",
                  },
                },
                Option: {
                  style: ({ $isHighlighted }: { $isHighlighted: boolean }) => ({
                    backgroundColor: $isHighlighted ? "#8b5e2b14" : "transparent",
                    color: "#7f5627ff",
                    borderRadius: "10px",
                    marginLeft: "8px",
                    marginRight: "8px",
                    paddingTop: "10px",
                    paddingBottom: "10px",
                    paddingLeft: "14px",
                    paddingRight: "14px",
                    ":hover": {
                      backgroundColor: "#8b5e2b14",
                      color: "#7f5627ff",
                    },
                    ":active": {
                      backgroundColor: "#8b5e2b1f",
                      color: "#7f5627ff",
                    },
                  }),
                },
              }}
            />
          </Block>
        )}
        overrides={{
          Body: {
            style: {
              backgroundColor: "#fbf1e3",
              border: "1px solid #95713940",
              borderRadius: "12px",
              boxShadow: "0 12px 34px #3a2a1b26",
              paddingTop: "0px",
              paddingBottom: "0px",
              paddingLeft: "0px",
              paddingRight: "0px",
              overflow: "hidden",
            },
          },
          Inner: {
            style: {
              backgroundColor: "transparent",
            },
          },
        }}
      >
        <Button
          kind="tertiary"
          size="compact"
          overrides={{
            BaseButton: {
              style: {
                paddingLeft: "8px",
                paddingRight: "8px",
                color: "#8b5e2b",
                backgroundColor: "transparent",
                ":hover": {
                  backgroundColor: "#8b5e2b14",
                  color: "#8b5e2b",
                },
                ":active": {
                  backgroundColor: "#8b5e2b1f",
                  color: "#8b5e2b",
                },
                "svg, svg *": {
                  fill: "currentColor",
                  stroke: "currentColor",
                },
              },
            },
          }}
        >
          <Block display="flex" alignItems="center" gap="8px">
            <Avatar
              name={email ?? ""}
              size="32px"
              overrides={{
                Root: {
                  style: {
                    backgroundColor: "#8b5e2b",
                    color: "#fbf1e3",
                  },
                },
              }}
            />
            {isOpen ? <ChevronUpSmallFilled size={24} /> : <ChevronDownSmallFilled size={24} />}
          </Block>
        </Button>
      </StatefulPopover>
    </Block>
  );
}
