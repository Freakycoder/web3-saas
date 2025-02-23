-- CreateTable
CREATE TABLE "Count" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "submissionCount" INTEGER NOT NULL,

    CONSTRAINT "Count_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Count" ADD CONSTRAINT "Count_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
