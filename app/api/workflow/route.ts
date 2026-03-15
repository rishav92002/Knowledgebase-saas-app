import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const body = await req.json();
    const { name } = body;
    const userId = req.headers.get("x-user-id");
    console.log('create workspace', { name, userId });
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }
    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: "Workspace name is required" },
        { status: 400 },
      );
    }
    const newWorkspace = await prisma.workspace.create({
      data: {
        name,
        userId,
      },
    });
    return NextResponse.json(
      {
        workspace: {
          id: newWorkspace.id,
          name: newWorkspace.name,
        },
      },
      { status: 201 },
    );
  } catch (e: unknown) {
    return NextResponse.json(
      { error: "Failed to create workspace" },
      { status: 500 },
    );
  }
};

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const workspaceId = req.headers.get("workspaceId");
    console.log('get workspace', { workspaceId });
    if (!workspaceId) {
      return NextResponse.json(
        { error: "workspace ID is required" },
        { status: 400 },
      );
    }
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
    });
    if (!workspace) {
      return NextResponse.json(
        { error: "workspace not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ workspace }, { status: 200 });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: "Failed to fetch workspace" },
      { status: 500 },
    );
  }
};

export const DELETE = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const workspaceId = req.headers.get("workspaceId");
    if (!workspaceId) {
      return NextResponse.json(
        { error: "workspace ID is required" },
        { status: 400 },
      );
    }
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
    });
    if (!workspace) {
      return NextResponse.json(
        { error: "workspace not found" },
        { status: 404 },
      );
    }
    await prisma.workspace.delete({
      where: { id: workspaceId },
    });
    return NextResponse.json({ message: "Workspace deleted" }, { status: 200 });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: "Failed to delete workspace" },
      { status: 500 },
    );
  }
};


export  const PATCH = async (req: NextRequest): Promise<NextResponse> => {
    try{
        const workspaceId = req.headers.get("workspaceId");
        if (!workspaceId) {
          return NextResponse.json(
            { error: "workspace ID is required" },
            { status: 400 },
          );
        }
        const body = await req.json();
        const { name } = body;
        if (!name || name.trim() === "") {
          return NextResponse.json(
            { error: "Workspace name is required" },
            { status: 400 },
          );
        }
        const updatedWorkspace = await prisma.workspace.update({
          where: { id: workspaceId },
          data: { name },
        });
        return NextResponse.json({ workspace: updatedWorkspace }, { status: 200 });
    }catch(e){
        return NextResponse.json(
            { error: "Failed to update workspace" },
            { status: 500 },
        );
    }
};
  