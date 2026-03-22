"use client";
import React, {useState, useEffect} from 'react'

import { Icons } from "@/utils/icon";
import { useTheme } from "@/context/ThemeContext";

import axios from "axios";


interface userType  {
  id?: string,
  name?: string,
  email?: string
}
const TopBar = () => {
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState<userType>({});


  useEffect(()=>{
    axios.get('/api/auth/user').then((res)=>{
        setUser(()=> res?.data?.user)
    }).catch((error)=>{
       
    })
  },[])

  function getNameShortForm(){
    const usernamearr = user?.name?.split(' ');
    const first = usernamearr?.[0][0];
    const last = usernamearr?.length? usernamearr?.length > 1 ? usernamearr?.[usernamearr.length-1][0]:'':'';
    console.log('usernamearr',usernamearr)
    return first+last
  }
  return (
    <div className="h-14 shrink-0 flex justify-between items-center px-4 bg-topbar-bg border-b border-topbar-border w-full">
      <div className="flex items-center gap-2 bg-input-bg border border-input-border rounded-lg px-3 py-2 w-80">
        <div className="text-muted-light">{Icons.search({ size: 18 })}</div>
        <input
          type="text"
          placeholder="Search documents..."
          className="bg-transparent outline-none text-sm text-input-text placeholder-input-placeholder w-full"
        />
      </div>
      <div className="flex items-center gap-3">
        {/* <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-muted hover:bg-surface-hover transition-colors cursor-pointer"
        >
          {theme === "light"
            ? Icons.moon({ size: 20 })
            : Icons.sun({ size: 20 })}
        </button> */}
        {/* <button className="p-2 rounded-lg text-muted hover:bg-surface-hover transition-colors cursor-pointer">
          {Icons.bell({ size: 20 })}
        </button> */}
        <div className="relative group">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-text text-sm font-medium cursor-pointer">
            {user?.name ? getNameShortForm().toUpperCase() : ""}
          </div>
          {user?.name && (
            <div className="absolute right-0 top-full mt-2 px-3 py-1.5 rounded-lg bg-foreground text-background text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
              {user.name}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;