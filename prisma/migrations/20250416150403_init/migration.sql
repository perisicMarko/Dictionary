-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "account_action_token" TEXT,
    "account_action_token_expires_at" TIMESTAMP(3),
    "email_verified" BOOLEAN DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "words" (
    "id" SERIAL NOT NULL,
    "word" TEXT NOT NULL,
    "is_learned" BOOLEAN NOT NULL,
    "user_notes" TEXT NOT NULL,
    "generated_notes" TEXT NOT NULL,
    "audio" TEXT NOT NULL,
    "repetitions" INTEGER NOT NULL,
    "days" INTEGER NOT NULL,
    "review_date" TIMESTAMP(3) NOT NULL,
    "ease_factor" DOUBLE PRECISION NOT NULL,
    "user_id" INTEGER NOT NULL,
    "language" TEXT NOT NULL,

    CONSTRAINT "words_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "id" ON "users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "unique_email" ON "users"("email");
