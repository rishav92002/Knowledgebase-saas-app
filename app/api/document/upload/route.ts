import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import pdfParse from "pdf-parse/lib/pdf-parse.js";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const workspacename = formData.get("workspaceName") as string | null;

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }
    if (!workspacename || workspacename.trim() === "") {
      return NextResponse.json(
        { error: "Workspace name is required" },
        { status: 400 },
      );
    }

    const extension = file.name
      .slice(file.name.lastIndexOf("."))
      .toLowerCase();

    let textContent: string;
    if (extension === ".pdf") {
      const buffer = Buffer.from(await file.arrayBuffer());
      const pdfData = await pdfParse(buffer);
      textContent = pdfData.text;
    } else {
      textContent = await file.text();
    }

    const escapeHtml = (str: string) =>
      str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

    const htmlContent = textContent
      .split("\n")
      .filter((line) => line.trim() !== "")
      .map((line) => `<p>${escapeHtml(line)}</p>`)
      .join("");

    const docName = file.name.slice(0, file.name.lastIndexOf(".")) || file.name;

    const workspace = await prisma.workspace.upsert({
      where: { name_userId: { name: workspacename, userId } },
      update: {
        documents: {
          create: { name: docName, title: file.name, content: htmlContent },
        },
      },
      create: {
        name: workspacename,
        userId,
        documents: {
          create: { name: docName, title: file.name, content: htmlContent },
        },
      },
      include: { documents: true },
    });

    return NextResponse.json(workspace, { status: 201 });
  } catch (e) {
    console.error("Upload error:", e);
    const message = e instanceof Error ? e.message : "Failed to upload document";
    return NextResponse.json({ error: message }, { status: 500 });
  }
};
