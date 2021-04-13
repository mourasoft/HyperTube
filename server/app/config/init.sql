CREATE DATABASE IF NOT EXISTS hypertube;
USE hypertube;

CREATE TABLE `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `firstname` VARCHAR(20) NOT NULL,
    `lastname` VARCHAR(20) NOT NULL,
    `username` VARCHAR(50) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `image` TEXT DEFAULT NULL,
    `verified` TINYINT DEFAULT 0,
    `language` ENUM('EN', 'FR') DEFAULT 'EN',
    `created_at` DATETIME DEFAULT NOW()
);

CREATE TABLE `tokens` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `type` ENUM('email', 'access', 'password'),
    `token` TEXT NOT NULL,
    `created_at` DATETIME DEFAULT NOW(),
    UNIQUE KEY (`user_id`, `type`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

CREATE TABLE `movies` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `imdb_code` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `path` TEXT DEFAULT NULL,
    `created_at` DATETIME DEFAULT NOW()
);

CREATE TABLE `watches` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `movie_id` INT NOT NULL,
    `created_at` DATETIME DEFAULT NOW(),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
    FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`)
);

CREATE TABLE `watch_list` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `movie_id` INT NOT NULL,
    `created_at` DATETIME DEFAULT NOW(),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
    FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`)
);

CREATE TABLE `comments` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `movie_id` INT NOT NULL,
    `comments` TEXT NOT NULL,
    `created_at` DATETIME DEFAULT NOW(),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
    FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`)
);