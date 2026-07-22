import type { Metadata } from "next";
import AdminApp from "@/components/admin/AdminApp";

/**
 * Hidden /admin content editor. Not linked from the site and excluded from
 * search indexing. Protected by a single password (basic protection that is
 * appropriate for a personal portfolio site).
 */
export const metadata: Metadata = {
  title: "Admin — Site Editor",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminApp />;
}
