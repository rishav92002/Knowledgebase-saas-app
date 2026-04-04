"use client";

import React, {useState} from "react";
import { Icons } from "@/utils/icon";
import ChangePassword from "@/components/ChangePassword/ChangePassword";
import axios from "axios";
import { useRouter } from "next/navigation";



interface UserSettingsProps {
  userData: {
    id: string;
    name: string | null;
    email: string;
  },
    onClose: () => void;
}

const UserSettings = ({ userData, onClose  }: UserSettingsProps) => {
    const [changePassword, setChangePassword] = useState(true);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
   
    try {
        setIsLoading(true);
      await axios.post("/api/auth/logout");
      router.replace("/login");
      router.refresh();
    } catch {
      setIsLoading(false);
    }
  };
const handleDeleteAccount = async () => {
     try {
    setIsLoading(true);
      await axios.delete("/api/auth/user");
      router.replace("/login");
      router.refresh();
    } catch {
      setIsLoading(false);
    }
}

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        // onClick={onClose}
      />
      <div className="relative bg-surface border border-border rounded-2xl shadow-xl min-w-3xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">
            Account Settings
          </h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-foreground transition-colors cursor-pointer"
          >
            {Icons.close({ size: 20 })}
          </button>
        </div>

        <div className="flex flex-col gap-5 w-full">
          {/* Profile */}
          <div className="flex flex-row gap-4 items-center w-full bg-surface-hover/50 p-4 rounded-xl">
            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-primary-text text-lg font-semibold shrink-0">
              {userData.name ? userData.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="flex flex-col gap-0.5">
              <h3 className="text-base font-semibold text-foreground">{userData.name || "User"}</h3>
              <p className="text-sm text-muted">{userData.email}</p>
            </div>
          </div>

          {/* Email */}
          {/* <div className="flex flex-col gap-2 w-full bg-surface-hover/50 p-4 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="text-muted">{Icons.mail({ size: 16 })}</span>
              <label className="text-sm font-medium text-foreground">Email Address</label>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted">{userData.email}</p>
              <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors cursor-pointer">
                Change
              </button>
            </div>
          </div> */}

          {/* Security */}
          <div className="flex flex-col gap-3 w-full bg-surface-hover/50 p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-muted">{Icons.shield({ size: 16 })}</span>
                <label className="text-sm font-medium text-foreground">Security</label>
              </div>
              {!changePassword && (
                <button
                  className="text-sm font-medium text-primary hover:text-primary/80 transition-colors cursor-pointer"
                  onClick={() => setChangePassword(true)}
                >
                  Change Password
                </button>
              )}
            </div>

            {changePassword && (
              <ChangePassword onCancel={() => setChangePassword(false)} />
            )}
          </div>

          {/* Logout & Delete */}
          <div className="flex flex-col gap-2 pt-2 border-t border-border">
            <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-foreground hover:bg-surface-hover transition-colors cursor-pointer" onClick = {handleLogout} disabled={isLoading}>
              {Icons.logout({ size: 18 })}
              <span className="text-sm font-medium">Logout</span>
            </button>
            {/* <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-danger hover:bg-danger/10 transition-colors cursor-pointer" onClick={handleDeleteAccount}>
              {Icons.trash({ size: 18 })}
              <span className="text-sm font-medium">Delete Account</span>
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
