-- CreateTable
CREATE TABLE "homepage_settings" (
    "id" TEXT NOT NULL DEFAULT 'home',
    "content" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "homepage_settings_pkey" PRIMARY KEY ("id")
);
