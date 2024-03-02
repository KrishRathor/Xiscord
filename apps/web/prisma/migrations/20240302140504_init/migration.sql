/*
  Warnings:

  - A unique constraint covering the columns `[channelName,server]` on the table `textChannels` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "textChannels_channelName_server_key" ON "textChannels"("channelName", "server");
