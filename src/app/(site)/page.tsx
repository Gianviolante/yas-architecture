// Route / is owned by src/app/page.tsx (outside the route group).
// This file is kept to satisfy Next.js conventions for (site) group,
// but the root route is handled by the sibling app/page.tsx.
import { notFound } from "next/navigation";

export default function SiteRoot() {
  notFound();
}
