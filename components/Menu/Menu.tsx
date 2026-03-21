"use client";
import { MenuItems } from "./menuHelper";
import { useRouter } from "next/navigation";
const Menu = () => {
const router = useRouter();


function menuClick(item:string){
    router.push(`/dashboard/${item}`);
}
  return (
    <div className="flex flex-col justify-between">
      <div className="flex flex-col gap-8">
        <div className="flex gap-2 items-center cursor-pointer" onClick = {()=> menuClick(MenuItems[0].url)}>
          <div>{MenuItems[0].icon()}</div>
          <span className="text-xl font-semibold">Knowledge Base</span>
        </div>
        <div className="flex flex-col gap-4 pl-2">
          {MenuItems.map((item,i) => {
            if(i==0) return null;
            return (
              <div className="flex gap-2 items-center cursor-pointer" onClick = {()=> menuClick(item.url)}>
                <div>{item.icon()}</div>
                <span className="text-base">{item.title}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default Menu;
