/*
  Warnings:

  - A unique constraint covering the columns `[channelServer]` on the table `ConversationMessage` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `channelServer` to the `ConversationMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `server` to the `ConversationMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ConversationMessage" ADD COLUMN     "channelServer" TEXT NOT NULL,
ADD COLUMN     "server" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ConversationMessage_channelServer_key" ON "ConversationMessage"("channelServer");
