-- CreateTable
CREATE TABLE "Bots" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "botName" TEXT NOT NULL,
    "owner" TEXT NOT NULL,

    CONSTRAINT "Bots_pkey" PRIMARY KEY ("id")
);
