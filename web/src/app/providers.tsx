"use client";

import { useMemo, type ReactNode } from "react";
import { BaseProvider, LightTheme } from "baseui";
import { Provider as StyletronProvider } from "styletron-react";
import { Client as StyletronClient, Server as StyletronServer } from "styletron-engine-atomic";

export default function Providers({ children }: { children: ReactNode }) {
  const engine = useMemo(() => {
    if (typeof document === "undefined") return new StyletronServer();
    return new StyletronClient();
  }, []);

  return (
    <StyletronProvider value={engine}>
      <BaseProvider theme={LightTheme}>{children}</BaseProvider>
    </StyletronProvider>
  );
}
