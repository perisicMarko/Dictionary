-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(100) NOT NULL,
    `last_name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `refresh_token` VARCHAR(255) NULL,
    `refresh_token_expiration_date` DATETIME(0) NULL,
    `email_verified` BOOLEAN NULL DEFAULT false,

    UNIQUE INDEX `id`(`id`),
    UNIQUE INDEX `unique_email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `words` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `word` VARCHAR(100) NOT NULL,
    `status` BOOLEAN NOT NULL,
    `user_notes` VARCHAR(2000) NOT NULL,
    `generated_notes` VARCHAR(3000) NOT NULL,
    `audio` VARCHAR(255) NOT NULL,
    `repetitions` INTEGER NOT NULL,
    `days` INTEGER NOT NULL,
    `review_date` DATE NOT NULL,
    `ease_factor` FLOAT NOT NULL,
    `user_id` INTEGER NOT NULL,
    `language` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
