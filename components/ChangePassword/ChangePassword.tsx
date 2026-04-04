"use client";

import React, { useState } from "react";
import { Icons } from "@/utils/icon";
import axios from "axios";
import { useRouter } from "next/navigation";

interface ChangePasswordProps {
  onCancel: () => void;
}

const ChangePassword = ({ onCancel }: ChangePasswordProps) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
    const router = useRouter();
  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>, setFun: React.Dispatch<React.SetStateAction<string>>) => {
    const value = e.target.value;
    setFun(value);
  };

  const handlePasswordUpdate = async () => {
    setError("");
    setSuccess("");
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setError("All fields are required.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError("New password and confirm password do not match.");
      return;
    }
    if (newPassword === currentPassword) {
      setError("New password and current password must be different.");
      return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    try {
      setIsLoading(true);
      await axios.patch("/api/auth/user", {
        oldPassword: currentPassword,
        newPassword,
      });
      setSuccess("Password updated successfully. Redirecting to login...");
      setIsLoading(false);
      setTimeout(() => setFadeOut(true), 1000);
      setTimeout(() => {
        onCancel();
        router.replace("/login");
      }, 1800);
    } catch (err: unknown) {
      setIsLoading(false);
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Failed to update password. Please try again.");
      }
    }
  };

  return (
    <div className={`flex flex-col gap-3 pt-2 border-t border-border/50 transition-opacity duration-700 ${fadeOut ? "opacity-0" : "opacity-100"}`}>
      {error && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-danger/10 text-danger text-sm animate-[fadeSlideIn_0.3s_ease-out]">
          {Icons.close({ size: 14 })}
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/10 text-green-500 text-sm animate-[fadeSlideIn_0.3s_ease-out]">
          <span>{success}</span>
        </div>
      )}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted">Current Password</label>
        <div className="relative">
          <input
            type={showCurrent ? "text" : "password"}
            placeholder="Enter current password"
            value={currentPassword}
            onChange={(e) => handlePasswordInputChange(e, setCurrentPassword)}
            className="w-full px-3 py-2 pr-10 rounded-lg bg-input-bg border border-input-border text-sm text-input-text placeholder-input-placeholder outline-none focus:border-primary transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowCurrent((prev) => !prev)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors cursor-pointer"
          >
            {showCurrent ? Icons.eyeOff({ size: 16 }) : Icons.eye({ size: 16 })}
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted">New Password</label>
        <div className="relative">
          <input
            type={showNew ? "text" : "password"}
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => handlePasswordInputChange(e, setNewPassword)}
            className="w-full px-3 py-2 pr-10 rounded-lg bg-input-bg border border-input-border text-sm text-input-text placeholder-input-placeholder outline-none focus:border-primary transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowNew((prev) => !prev)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors cursor-pointer"
          >
            {showNew ? Icons.eyeOff({ size: 16 }) : Icons.eye({ size: 16 })}
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted">Confirm New Password</label>
        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm new password"
            value={confirmNewPassword}
            onChange={(e) => handlePasswordInputChange(e, setConfirmNewPassword)}
            className="w-full px-3 py-2 pr-10 rounded-lg bg-input-bg border border-input-border text-sm text-input-text placeholder-input-placeholder outline-none focus:border-primary transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowConfirm((prev) => !prev)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors cursor-pointer"
          >
            {showConfirm ? Icons.eyeOff({ size: 16 }) : Icons.eye({ size: 16 })}
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2 pt-1">
        <button className="px-4 py-2 rounded-lg bg-primary text-primary-text text-sm font-medium hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed" onClick={handlePasswordUpdate} disabled={isLoading}>
          {isLoading ? "Updating Password..." : "Update Password"}
        </button>
        <button
          className="px-4 py-2 rounded-lg text-sm font-medium text-muted hover:text-foreground hover:bg-surface-hover transition-colors cursor-pointer"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ChangePassword;
