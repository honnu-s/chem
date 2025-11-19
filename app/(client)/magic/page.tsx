export const dynamic = "force-dynamic";

import { Suspense } from "react";
import MagicPage from "./magic-page";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MagicPage />
    </Suspense>
  );
}
