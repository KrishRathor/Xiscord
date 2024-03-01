-- DropForeignKey
ALTER TABLE "Friend" DROP CONSTRAINT "Friend_friendId_fkey";

-- DropForeignKey
ALTER TABLE "Friend" DROP CONSTRAINT "Friend_userId_fkey";

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
