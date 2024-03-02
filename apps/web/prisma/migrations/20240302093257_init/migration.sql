-- AlterTable
ALTER TABLE "Server" ADD COLUMN     "textChannels" TEXT[],
ADD COLUMN     "voiceChannels" TEXT[];

-- CreateTable
CREATE TABLE "textChannels" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "channelName" TEXT NOT NULL,
    "users" TEXT[],

    CONSTRAINT "textChannels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConversationMessage" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT NOT NULL,
    "fromUser" TEXT NOT NULL,
    "channelName" TEXT NOT NULL,

    CONSTRAINT "ConversationMessage_pkey" PRIMARY KEY ("id")
);
