/*
  Warnings:

  - The values [USER,AI] on the enum `senderType` will be removed. If these variants are still used in the database, this will fail.
  - The values [ADMIN,ANALYST,VIEWER] on the enum `workRole` will be removed. If these variants are still used in the database, this will fail.
  - The values [ACTIVE,INACTIVE] on the enum `workStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `schema` on the `FileUpload` table. All the data in the column will be lost.
  - You are about to drop the column `senderEmail` on the `Message` table. All the data in the column will be lost.
  - Added the required column `title` to the `Conversation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supabaseFilePath` to the `FileUpload` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "senderType_new" AS ENUM ('User', 'Ai');
ALTER TABLE "Message" ALTER COLUMN "senderType" TYPE "senderType_new" USING ("senderType"::text::"senderType_new");
ALTER TYPE "senderType" RENAME TO "senderType_old";
ALTER TYPE "senderType_new" RENAME TO "senderType";
DROP TYPE "public"."senderType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "workRole_new" AS ENUM ('Admin', 'Analyst', 'Viewer');
ALTER TABLE "Role" ALTER COLUMN "workRole" TYPE "workRole_new" USING ("workRole"::text::"workRole_new");
ALTER TYPE "workRole" RENAME TO "workRole_old";
ALTER TYPE "workRole_new" RENAME TO "workRole";
DROP TYPE "public"."workRole_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "workStatus_new" AS ENUM ('Active', 'Inactive');
ALTER TABLE "public"."Role" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Role" ALTER COLUMN "status" TYPE "workStatus_new" USING ("status"::text::"workStatus_new");
ALTER TYPE "workStatus" RENAME TO "workStatus_old";
ALTER TYPE "workStatus_new" RENAME TO "workStatus";
DROP TYPE "public"."workStatus_old";
ALTER TABLE "Role" ALTER COLUMN "status" SET DEFAULT 'Active';
COMMIT;

-- DropForeignKey
ALTER TABLE "FileUpload" DROP CONSTRAINT "FileUpload_uploadedBy_fkey";

-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Dashboard" ADD COLUMN     "messageId" TEXT,
ALTER COLUMN "workspaceId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "FileUpload" DROP COLUMN "schema",
ADD COLUMN     "supabaseFilePath" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "senderEmail",
ADD COLUMN     "dashboards" JSONB,
ADD COLUMN     "senderName" TEXT;

-- AlterTable
ALTER TABLE "Role" ALTER COLUMN "status" SET DEFAULT 'Active';
