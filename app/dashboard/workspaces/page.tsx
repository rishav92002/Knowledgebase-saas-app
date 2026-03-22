
import { cookies } from "next/headers";
import { verifyToken } from "@/utils/token";
import prisma from "@/lib/prisma";
import CreateWorkspace from "@/components/CreateWorkspace/CreateWorkspace"
import { redirect } from "next/navigation";
import WorkspacesCard from "@/components/Cards/WorkspacesCard";

export default async function Workspaces(){
    const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  const decoded = await verifyToken(token, process.env.SECRET_KEY as string);
  if (!decoded) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: { id: true, name: true, email: true },
  });

  if (!user) {
    redirect("/login");
  }

    const workspaces = await prisma.workspace.findMany({
      where: { userId: decoded.userId },
      select: {
        id: true,
        name: true,
        updatedAt: true,
        _count: {
          select: { documents: true },
        },
      },
    });
    
   
    return <div className="flex flex-col p-4 gap-12">
        <div className="flex justify-between ">
            <span className="font-semibold text-xl">Your Workspaces</span>
            <CreateWorkspace/>
        </div>
        <div className="flex gap-8 ">
            {
                workspaces.map((val,i)=>{
                    return(
                        <WorkspacesCard id= {val.id} name={val.name} updatedAt={val.updatedAt} documentCount= {val._count.documents}/>
                    )
                })
            }
        </div>
        
    </div>
}