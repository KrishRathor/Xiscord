/*
  Warnings:

  - A unique constraint covering the columns `[botName]` on the table `Bots` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Bots_botName_key" ON "Bots"("botName");
