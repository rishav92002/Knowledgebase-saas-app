"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MenuItems } from "./menuHelper";
import { usePathname } from "next/navigation";
import { Icons } from "@/utils/icon";
import { useTheme } from "@/context/ThemeContext";

import Settings from "../Settings/Settings";

const Menu = () => {
  const [showSettings, setShowSettings] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  function isActive(url: string): boolean {
    const fullPath = `/dashboard/${url}`;
    return pathname === fullPath || (url === "" && pathname === "/dashboard");
  }

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="flex flex-col gap-6">
        <Link
          href={`/dashboard/${MenuItems[0].url}`}
          className="flex gap-2 items-center px-2 py-2"
        >
          <div className="text-primary">{MenuItems[0].icon({ size: 24 })}</div>
          <span className="text-lg font-semibold text-foreground">
            KnowledgeBase
          </span>
        </Link>
        <div className="flex flex-col gap-1">
          {MenuItems.map((item, i) => {
            if (i === 0) return null;
            const active = isActive(item.url);
            return (
              <Link
                key={item.title}
                href={`/dashboard/${item.url}`}
                className={`flex gap-3 items-center px-3 py-2 rounded-lg transition-colors ${
                  active
                    ? "bg-sidebar-active text-sidebar-active-text"
                    : "text-sidebar-text hover:bg-sidebar-hover"
                }`}
              >
                <div>{item.icon({ size: 20 })}</div>
                <span className="text-sm font-medium">{item.title}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-1 pb-2">
        <div className="relative">
          {showSettings && <Settings />}
          <div
            className="flex gap-3 items-center cursor-pointer px-3 py-2 rounded-lg text-sidebar-text hover:bg-sidebar-hover transition-colors"
            onClick={() => setShowSettings((prev) => !prev)}
          >
            <div>{Icons.settings({ size: 20 })}</div>
            <span className="text-sm font-medium">Settings</span>
          </div>
        </div>
        <div
          className="flex gap-3 items-center cursor-pointer px-3 py-2 rounded-lg text-sidebar-text hover:bg-sidebar-hover transition-colors"
          onClick={toggleTheme}
        >
          <div>
            {theme === "light"
              ? Icons.moon({ size: 20 })
              : Icons.sun({ size: 20 })}
          </div>
          <span className="text-sm font-medium">
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Menu;
