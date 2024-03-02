/*
  Warnings:

  - Added the required column `server` to the `textChannels` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "textChannels" ADD COLUMN     "server" TEXT NOT NULL;
