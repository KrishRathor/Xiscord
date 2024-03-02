/*
  Warnings:

  - A unique constraint covering the columns `[serverName]` on the table `Server` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Server_serverName_key" ON "Server"("serverName");
