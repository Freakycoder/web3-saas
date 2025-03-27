/*
  Warnings:

  - Made the column `locked_amount` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pending_amount` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `reputation` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `task_completed` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `task_failed` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "locked_amount" SET NOT NULL,
ALTER COLUMN "pending_amount" SET NOT NULL,
ALTER COLUMN "reputation" SET NOT NULL,
ALTER COLUMN "task_completed" SET NOT NULL,
ALTER COLUMN "task_failed" SET NOT NULL;
