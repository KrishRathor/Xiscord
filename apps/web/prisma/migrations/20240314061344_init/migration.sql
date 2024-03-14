-- AlterTable
ALTER TABLE "Bots" ADD COLUMN     "servers" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "Server" ADD COLUMN     "Bots" TEXT[] DEFAULT ARRAY[]::TEXT[];
