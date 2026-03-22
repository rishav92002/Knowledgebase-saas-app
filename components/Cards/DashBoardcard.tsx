"use client"

import React, { JSX } from "react";

import { useRouter } from "next/navigation";

interface DashBoardCardProps {
  title: string;
  value: number;
  icon?: JSX.Element;
}

const DashBoardCard = ({ title, value, icon }: DashBoardCardProps) => {
    const router = useRouter()

    function menuClick(item: string) {
        router.push(`/dashboard/${item}`);
  }
  return (
    <div className="flex flex-col items-center gap-4 p-5 bg-card-bg border border-card-border rounded-xl hover:bg-card-hover transition-colors h-56 w-56 justify-center items-start cursor-pointer" onClick={()=>menuClick(title.toLowerCase())}>
      <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center  justify-center shrink-0">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-xl text-muted">{title}</span>
        <span className="text-2xl font-bold text-foreground">{value}</span>
      </div>
    </div>
  );
};

export default DashBoardCard;