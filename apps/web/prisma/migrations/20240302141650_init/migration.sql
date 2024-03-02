/*
  Warnings:

  - You are about to drop the column `channelServer` on the `ConversationMessage` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "ConversationMessage_channelServer_key";

-- AlterTable
ALTER TABLE "ConversationMessage" DROP COLUMN "channelServer";
