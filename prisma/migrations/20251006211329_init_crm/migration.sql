-- CreateTable
CREATE TABLE "Contact" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "company" TEXT,
    "type" TEXT,
    "address" TEXT,
    "city" TEXT,
    "country" TEXT,
    "postalCode" TEXT,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interaction" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "content" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "duration" TEXT,
    "status" TEXT,
    "contactId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Interaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Interaction" ADD CONSTRAINT "Interaction_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
