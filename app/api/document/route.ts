import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
    try {
        const body = await req.json();
        const { name, title, content, workspaceName } = body;
        const userId = req.headers.get("x-user-id");

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }
        if (!workspaceName || workspaceName.trim() === "" || !name || name.trim() === "") {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        const workspace = await prisma.workspace.upsert({
            where: { name: workspaceName },
            update: {
                documents: {
                    create: { name, title, content },
                },
            },
            create: {
                name: workspaceName,
                userId,
                documents: {
                    create: { name, title, content },
                },
            },
            include: { documents: true },
        });

        return NextResponse.json(workspace, { status: 201 });
    } catch (e) {
        console.error("Create document error:", e);
        return NextResponse.json({ error: "Failed to create document" }, { status: 500 });
    }
};

export const GET = async (req: NextRequest): Promise<NextResponse> => {
    try {
        const userId = req.headers.get("x-user-id");
        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }
        const documentId = req.headers.get("documentId");
        if (!documentId) {
            return NextResponse.json({ error: "document ID is required" }, { status: 400 });
        }

        const document = await prisma.document.findUnique({
            where: { id: documentId },
            include: { workspace: { select: { userId: true } } },
        });

        if (!document || document.workspace.userId !== userId) {
            return NextResponse.json({ error: "Document not found" }, { status: 404 });
        }

        return NextResponse.json(document, { status: 200 });
    } catch (e) {
        console.error("Fetch document error:", e);
        return NextResponse.json({ error: "Failed to fetch document" }, { status: 500 });
    }
};

export const DELETE = async (req: NextRequest): Promise<NextResponse> => {
    try {
        const userId = req.headers.get("x-user-id");
        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }
        const documentId = req.headers.get("documentId");
        if (!documentId) {
            return NextResponse.json({ error: "document ID is required" }, { status: 400 });
        }

        const document = await prisma.document.findUnique({
            where: { id: documentId },
            select: { workspace: { select: { userId: true } } },
        });

        if (!document || document.workspace.userId !== userId) {
            return NextResponse.json({ error: "Document not found" }, { status: 404 });
        }

        await prisma.document.delete({
            where: { id: documentId },
        });

        return NextResponse.json({ message: "Document deleted" }, { status: 200 });
    } catch (e) {
        console.error("Delete document error:", e);
        return NextResponse.json({ error: "Failed to delete document" }, { status: 500 });
    }
};

export const PATCH = async (req: NextRequest): Promise<NextResponse> => {
    try {
        const userId = req.headers.get("x-user-id");
        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }
        const documentId = req.headers.get("documentId");
        if (!documentId) {
            return NextResponse.json({ error: "document ID is required" }, { status: 400 });
        }

        const existing = await prisma.document.findUnique({
            where: { id: documentId },
            select: { workspace: { select: { userId: true } } },
        });

        if (!existing || existing.workspace.userId !== userId) {
            return NextResponse.json({ error: "Document not found" }, { status: 404 });
        }

        const body = await req.json();
        const { name, title, content, isFavourite } = body;

        const data: Record<string, string | boolean> = {};
        if (name !== undefined) data.name = name;
        if (title !== undefined) data.title = title;
        if (content !== undefined) data.content = content;
        if (isFavourite !== undefined) data.isFavourite = isFavourite;

        if (Object.keys(data).length === 0) {
            return NextResponse.json({ error: "No fields to update" }, { status: 400 });
        }

        const document = await prisma.document.update({
            where: { id: documentId },
            data,
        });

        return NextResponse.json(document, { status: 200 });
    } catch (e) {
        console.error("Update document error:", e);
        return NextResponse.json({ error: "Failed to update document" }, { status: 500 });
    }
};
