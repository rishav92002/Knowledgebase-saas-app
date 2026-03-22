import Menu from "@/components/Menu/Menu";
import TopBar from "@/components/TopBar/TopBar";
import { getAuth } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {user} = await getAuth();

  return (
    <div className="flex h-screen w-screen bg-background font-sans">
      <div className="h-full w-60 bg-sidebar-bg border-r border-sidebar-border p-2">
        <Menu />
      </div>
      <div className="flex flex-col h-full w-[calc(100%-15rem)]">
        <TopBar userData={user} />
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}