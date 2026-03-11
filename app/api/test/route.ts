import prisma  from "@/lib/prisma"

export async function GET() {
    try{
        const users = await prisma.user.findMany()
        return Response.json({
            success:true,
            data: users
        })
    }catch(e){
        return Response.json({
            success:false,
            message: "Error fetching users"
        })
    }
}