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
    console.log("Received upload request from user:", userId);
    const formData = await req.formData();
    console.log("Form data received:", formData);
    const file = formData.get("file") as File | null;
    console.log("File received:", file);
    const extension = file?.name
      .slice(file.name.lastIndexOf("."))
      .toLowerCase(); // returns ".txt"
    const workspacename = formData.get("workspaceName") as string | null;
    console.log("Workspace name received:", workspacename, extension);
    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }
    let textContent: string;
    if (extension === ".pdf") {
        console.log("Processing PDF file:", file.name);
      const buffer = Buffer.from(await file.arrayBuffer());
      console.log("PDF file buffer created, size:", buffer.length);
      const pdfData = await pdfParse(buffer)
        console.log("PDF parser initialized");
        textContent = pdfData.text;
    //   console.log("PDF text extraction completed, length:", result.text.length);
    //   textContent = result.text;
      console.log("Extracted text from PDF:", textContent.substring(0, 200)); // Log first 200 chars
    } else {
      textContent = await file.text();
    }
    console.log("Extracted text content:", textContent);
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

    if (!workspacename || workspacename.trim() === "") {
      return NextResponse.json(
        { error: "Workspace name is required" },
        { status: 400 },
      );
    }
    console.log("Parsed content:", htmlContent);
    const workspace = await prisma.workspace.upsert({
      where: { name: workspacename },
      update: {
        documents: {
          create: { name: file.name, title: file.name, content: htmlContent },
        },
      },
      create: {
        name: workspacename,
        userId,
        documents: {
          create: { name: file.name, title: file.name, content: htmlContent },
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
