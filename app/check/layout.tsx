// app/layout.tsx
import { Toaster } from "sonner";

export default function RootLayout({ children }:any) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster richColors closeButton /> {/* ✅ global toast handler */}
      </body>
    </html>
  );
}
