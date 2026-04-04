/*
  Warnings:

  - A unique constraint covering the columns `[name,workspaceId]` on the table `Document` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,userId]` on the table `Workspace` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Document_name_key";

-- DropIndex
DROP INDEX "Workspace_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Document_name_workspaceId_key" ON "Document"("name", "workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_name_userId_key" ON "Workspace"("name", "userId");
