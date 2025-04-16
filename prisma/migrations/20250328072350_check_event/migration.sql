-- CreateTable
CREATE TABLE "Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "eventName" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Event_eventName_key" ON "Event"("eventName");
