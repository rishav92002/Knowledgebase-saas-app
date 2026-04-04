"use client";

import React, {useState, useEffect} from "react";
import { Icons } from "@/utils/icon";
import { useTheme } from "@/context/ThemeContext";
import { usePathname,useRouter,useSearchParams } from "next/navigation";

interface TopBarProps {
  userData: {
    id: string;
    name: string | null;
    email: string;
  };
}

const TopBar = ({ userData }: TopBarProps) => {
  const { theme, toggleTheme } = useTheme();
  const [searchVal, setSearchVal] = useState("");
  const pathname = usePathname();       // e.g. "/dashboard/documents"
  const searchParams = useSearchParams();
  const router = useRouter();
  const showSearch = pathname !== "/dashboard";

  function getNameShortForm() {
    if (!userData.name) return "";
    const parts = userData.name.trim().split(/\s+/);
    const first = parts[0][0];
    const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (first + last).toUpperCase();
  }
  useEffect(()=>{
    const timeOutid = setTimeout(()=>{
      const params = new URLSearchParams(searchParams.toString());
      if (searchVal) {
      params.set("q", searchVal);
      } else {
        params.delete("q");
      }
      router.replace(`${pathname}?${params.toString()}`);

    },500);
    return () => clearTimeout(timeOutid);
  },[searchVal])
  return (
    <div className="h-14 shrink-0 flex justify-between items-center px-4 bg-topbar-bg border-b border-topbar-border w-full">
      {showSearch ? (
        <div className="flex items-center gap-2 bg-input-bg border border-input-border rounded-lg px-3 py-2 w-80">
          <div className="text-muted-light">{Icons.search({ size: 18 })}</div>
          <input
            type="text"
            placeholder="Search documents..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="bg-transparent outline-none text-sm text-input-text placeholder-input-placeholder w-full"
          />
        </div>
      ) : (
        <div />
      )}
      <div className="flex items-center gap-3">
        <div className="relative group">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-text text-sm font-medium cursor-pointer">
            {getNameShortForm()}
          </div>
          {userData.name && (
            <div className="absolute right-0 top-full mt-2 px-3 py-1.5 rounded-lg bg-foreground text-background text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
              {userData.name}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;