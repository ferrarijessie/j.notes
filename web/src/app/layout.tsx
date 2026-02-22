import type { ReactNode } from "react";

import Navbar from "./components/Navbar";
import Providers from "./providers";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" style={{ background: "#fbf1e3" }}>
      <body
        style={{
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          margin: 0,
          padding: 0,
          background: "#fbf1e3",
          minHeight: "100vh",
        }}
      >
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
