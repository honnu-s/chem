// app/layout.tsx
import { Toaster } from "sonner";
import { ReactNode } from "react";

export default function RootLayout({ children }:{ children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster richColors closeButton /> {/* ✅ global toast handler */}
      </body>
    </html>
  );
}
