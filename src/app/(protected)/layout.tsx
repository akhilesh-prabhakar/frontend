import RequireAuth from "@/components/RequireAuth";
import AppShell from "@/components/AppShell";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <AppShell>{children}</AppShell>
    </RequireAuth>
  );
}
