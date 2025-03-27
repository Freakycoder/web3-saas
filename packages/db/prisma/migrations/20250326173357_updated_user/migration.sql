/*
  Warnings:

  - You are about to drop the column `worker_id` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the `Count` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Worker` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[user_id,task_id]` on the table `Submission` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `completion_time` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `submission_date` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `task_creation_time` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `task_deadline_time` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Count" DROP CONSTRAINT "Count_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_worker_id_fkey";

-- DropIndex
DROP INDEX "Submission_worker_id_task_id_key";

-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "worker_id",
ADD COLUMN     "completion_time" INTEGER NOT NULL,
ADD COLUMN     "submission_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "task_creation_time" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "task_deadline_time" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "display_name" TEXT,
ADD COLUMN     "locked_amount" INTEGER DEFAULT 0,
ADD COLUMN     "pending_amount" INTEGER DEFAULT 0,
ADD COLUMN     "reputation" INTEGER DEFAULT 100,
ADD COLUMN     "task_completed" INTEGER DEFAULT 0,
ADD COLUMN     "task_failed" INTEGER DEFAULT 0,
ADD COLUMN     "username" TEXT,
ALTER COLUMN "walletAddress" DROP NOT NULL;

-- DropTable
DROP TABLE "Count";

-- DropTable
DROP TABLE "Worker";

-- CreateIndex
CREATE UNIQUE INDEX "Submission_user_id_task_id_key" ON "Submission"("user_id", "task_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
