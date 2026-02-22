"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Block } from "baseui/block";
import { Button, KIND, SIZE as BUTTON_SIZE, SHAPE } from "baseui/button";
import { Input, SIZE as INPUT_SIZE } from "baseui/input";
import { Banner, KIND as BANNER_KIND } from "baseui/banner";
import { Hide, Show } from "baseui/icon";
import { HeadingLarge, ParagraphSmall } from "baseui/typography";

import { 
  authInputOverrides, 
  authButtonOverrides, 
  authLinkOverrides, 
  errorBannerOverrides 
} from "../../lib/overrides";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

async function ensureCsrfCookie(): Promise<void> {
  await fetch(`${API_URL}/api/auth/csrf/`, { credentials: "include" });
}

function formatAuthError(data: any, status: number): string {
  if (!data) return `Signup failed: ${status}`;

  const first = (v: unknown): string | null => {
    if (typeof v === "string") return v;
    if (Array.isArray(v) && v.length > 0 && typeof v[0] === "string") return v[0];
    return null;
  };

  const msg = first(data.non_field_errors) || first(data.detail) || first(data.email) || first(data.password);
  return msg ?? "Signup failed";
}

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await ensureCsrfCookie();
      const csrf = getCookie("csrftoken");
      const res = await fetch(`${API_URL}/api/auth/signup/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(csrf ? { "X-CSRFToken": csrf } : {}),
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as any;
        throw new Error(formatAuthError(data, res.status));
      }

      setSuccess(true);
      setEmail("");
      setPassword("");
      router.replace("/");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Block as="main" overrides={{ Block: { style: { minHeight: "100vh", display: "grid", placeItems: "center", padding: "24px" } } }}>
      <Block overrides={{ Block: { style: { width: "100%", maxWidth: "520px", textAlign: "center" } } }}>
        <Block overrides={{ Block: { style: { marginBottom: "18px" } } }}>
          <Image src="/cat.png" alt="Sleeping cat" width={140} height={100} priority style={{ margin: "0 auto" }} />
        </Block>

        <HeadingLarge
          overrides={{
            Block: {
              style: {
                marginTop: 0,
                marginBottom: 0,
                color: "#8b5e2b",
                fontFamily: "ui-serif, Georgia, serif",
                fontWeight: 700,
              },
            },
          }}
        >
          Yay, New Friend!
        </HeadingLarge>

        <Block as="form" onSubmit={onSubmit} overrides={{ Block: { style: { marginTop: "22px", display: "grid", gap: "12px", justifyItems: "center" } } }}>
          {error ? (
            <Block overrides={{ Block: { style: { width: "320px", maxWidth: "100%", marginLeft: "auto", marginRight: "auto" } } }}>
              <Banner kind={BANNER_KIND.negative} overrides={errorBannerOverrides}>
                {error}
              </Banner>
            </Block>
          ) : null}

          <Input
            value={email}
            onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
            placeholder="Email address"
            type="email"
            required
            size={INPUT_SIZE.compact}
            overrides={authInputOverrides}
          />

          <Input
            value={password}
            onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            required
            size={INPUT_SIZE.compact}
            overrides={authInputOverrides}
          />

          <Button
            type="submit"
            isLoading={loading}
            overrides={authButtonOverrides}
            kind={KIND.secondary}
            size={BUTTON_SIZE.compact}
            shape={SHAPE.pill}
          >
            Sign Up
          </Button>

          <Link href="/login" style={authLinkOverrides}>
            We’re already friends!
          </Link>
          {success ? <ParagraphSmall color="#2f7a3d">Account created.</ParagraphSmall> : null}
        </Block>
      </Block>
    </Block>
  );
}
