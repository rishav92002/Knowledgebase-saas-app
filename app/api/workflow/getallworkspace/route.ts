import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }
    const workspaces = await prisma.workspace.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        updatedAt: true,
        _count: {
          select: { documents: true },
        },
      },
    });
    const formattedWorkspaces = workspaces.map((ws) => ({
      id: ws.id,
      name: ws.name,
      updatedAt: ws.updatedAt,
      documentCount: ws._count.documents,
    }));
    return NextResponse.json({ workspaces: formattedWorkspaces }, { status: 200 });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: "Failed to fetch workspaces" },
      { status: 500 },
    );
  }
};
