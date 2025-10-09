/*
  Warnings:

  - You are about to drop the column `clients` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "clients";

-- CreateTable
CREATE TABLE "_ContactToProduct" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ContactToProduct_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ContactToProduct_B_index" ON "_ContactToProduct"("B");

-- AddForeignKey
ALTER TABLE "_ContactToProduct" ADD CONSTRAINT "_ContactToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContactToProduct" ADD CONSTRAINT "_ContactToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
