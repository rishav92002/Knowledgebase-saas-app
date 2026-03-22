import prisma from "@/lib/prisma";
import { getAuth } from "@/lib/auth";
import CreateWorkspace from "@/components/CreateWorkspace/CreateWorkspace";
import WorkspacesCard from "@/components/Cards/WorkspacesCard";

export default async function Workspaces() {
  const { decoded } = await getAuth();

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
                        <WorkspacesCard key= {val.id} id= {val.id} name={val.name} updatedAt={val.updatedAt} documentCount= {val._count.documents}/>
                    )
                })
            }
        </div>
        
    </div>
}