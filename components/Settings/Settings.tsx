"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import { useState } from "react";
import { Icons } from "@/utils/icon";

const Settings = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await axios.post("/api/auth/logout");
      router.replace("/login");
    } catch {
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute bottom-12 left-0 w-52 bg-surface border border-border rounded-xl shadow-lg p-2">
      <button
        onClick={handleLogout}
        disabled={isLoading}
        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-danger hover:bg-surface-hover transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {Icons.logout({ size: 18 })}
        <span className="text-sm font-medium">
          {isLoading ? "Logging out..." : "Logout"}
        </span>
      </button>
    </div>
  );
};

export default Settings;