-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Creato il: Giu 27, 2020 alle 15:44
-- Versione del server: 10.3.22-MariaDB-log
-- Versione PHP: 7.1.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `riccar21_PALEObooks`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `adoptions`
--

CREATE TABLE `adoptions` (
  `id` int(10) UNSIGNED NOT NULL,
  `book_id` int(10) UNSIGNED NOT NULL,
  `class_id` int(10) UNSIGNED NOT NULL,
  `subject_id` int(10) UNSIGNED NOT NULL,
  `must_buy` tinyint(1) DEFAULT NULL,
  `recommended` tinyint(1) DEFAULT NULL,
  `new_adoption` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella `books`
--

CREATE TABLE `books` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `isbn` varchar(13) NOT NULL,
  `price` decimal(4,2) NOT NULL,
  `autors` varchar(100) NOT NULL,
  `photo` varchar(100) DEFAULT NULL,
  `publisher` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Struttura della tabella `classes`
--

CREATE TABLE `classes` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `school_year` varchar(20) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella `demands`
--

CREATE TABLE `demands` (
  `id` int(10) UNSIGNED NOT NULL,
  `book_id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dump dei dati per la tabella `demands`
--

INSERT INTO `demands` (`id`, `book_id`, `user_id`, `created_at`, `updated_at`) VALUES
(2, 55, 6, NULL, NULL),
(3, 56, 6, NULL, NULL),
(4, 57, 6, NULL, NULL);

-- --------------------------------------------------------

--
-- Struttura della tabella `password_resets`
--

CREATE TABLE `password_resets` (
  `id` int(10) UNSIGNED NOT NULL,
  `email` varchar(100) NOT NULL,
  `reset_token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella `subjects`
--

CREATE TABLE `subjects` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `course` varchar(100) NOT NULL,
  `course_year` varchar(20) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella `supplies`
--

CREATE TABLE `supplies` (
  `id` int(10) UNSIGNED NOT NULL,
  `book_id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `price` decimal(10,0) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dump dei dati per la tabella `supplies`
--

INSERT INTO `supplies` (`id`, `book_id`, `user_id`, `price`, `created_at`, `updated_at`) VALUES
(1, 56, 7, '0', NULL, NULL),
(2, 56, 7, '0', NULL, NULL),
(3, 56, 7, '0', NULL, NULL),
(5, 56, 7, '0', NULL, NULL),
(7, 56, 7, '0', NULL, NULL),
(9, 55, 6, '0', NULL, NULL),
(10, 53, 6, '0', NULL, NULL),
(11, 56, 6, '0', NULL, NULL);

-- --------------------------------------------------------

--
-- Struttura della tabella `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `refresh_token` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dump dei dati per la tabella `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `refresh_token`, `created_at`, `updated_at`) VALUES
(6, 'Jocelyn Hodkiewicz III', 'antwan20@hotmail.com', '$2y$10$EYxj/NyKtlbx6xX6V5AMpeNV4eH1wqtu6WXbAGYn/AtpWN07u8BSK', NULL, '2020-06-22 17:40:41', '2020-06-22 17:40:41'),
(7, 'Kiana Davis Sr.', 'andres84@waelchi.com', '$2y$10$7SBKZtLBad/0.7pACu6dWezBcJJIYIMrWbA1LZK.liocmKvpML6y.', NULL, '2020-06-22 17:40:42', '2020-06-22 18:56:48'),
(8, 'Cecelia Terry', 'west.dallas@hartmann.biz', '$2y$10$3O/Ug5wRrbK2lFNu7M2JD.b.9W2WTTC3xQSu6SUdSsVZ6j/mvKYHm', NULL, '2020-06-22 17:40:42', '2020-06-22 17:40:42'),
(9, 'Breana Nader', 'murray.coby@yahoo.com', '$2y$10$lHhJ3FdyZyTExPy4vd6LJuB9pJ2B9Kw3gPrPx..DB4KW0E1l2Q.mC', NULL, '2020-06-22 17:40:42', '2020-06-22 17:40:42'),
(10, 'Miss Cynthia Hyatt', 'vern83@lowe.biz', '$2y$10$U54fhYmCmxKPQeWlGMuhNOiAzbvFmagpzAY5n7MRnmIX0LNrcZvPW', NULL, '2020-06-22 17:40:42', '2020-06-22 17:40:42'),
(11, 'Mozelle Satterfield', 'gulgowski.della@nienow.com', '$2y$10$.0tGHgwQFbZkJPOl12XfmubnnpMYutRZpQD62mjla9o9zYzXiSvti', NULL, '2020-06-22 17:40:42', '2020-06-22 17:40:42'),
(12, 'Ricky Considine', 'cummings.warren@zboncak.com', '$2y$10$hdhnMf2oNn0qnh0ppcRb3O95wTh/jE7HVood4Bjyu9S7OJYapKhd6', NULL, '2020-06-22 17:40:42', '2020-06-22 17:40:42'),
(13, 'Mrs. Yazmin Will Sr.', 'glowe@collins.info', '$2y$10$cAzFF/2BW/A9GejbGdl.sOXR2nUrm70F65LCcqIhJp1PhBiupQyE6', NULL, '2020-06-22 17:40:42', '2020-06-22 17:40:42'),
(14, 'Viola Parisian', 'waters.deshaun@schultz.info', '$2y$10$E1uNGK7ndMELIDfgDzMk6O8BTF.MKFVF9QxE5A7LIBQ3DAAFDTT2i', NULL, '2020-06-22 17:40:42', '2020-06-22 17:40:42'),
(15, 'Prof. Rylee Wisozk MD', 'stamm.celestino@hotmail.com', '$2y$10$1DsarARHMZ9hPdNYlXINneW08o5Oj25gxjGYNO8IMJuSnGqp3mAW.', NULL, '2020-06-22 17:40:42', '2020-06-22 22:31:00'),
(16, 'prova', 'prova@prova.prova', '$2y$10$9ovNRsrneFyr7ZXt2lLGvuOJnygpxGmBkj5Ta7WbVvYfBYmeNt6wy', NULL, '2020-06-22 18:26:55', '2020-06-22 18:26:55'),
(17, 'Prova2', 'prova@prova.it', '$2y$10$XFTwYhg2MudgNjQSpJ9eMOEmmVX0k3PbIFoHJwFaFZU8yh1/yEK1O', NULL, '2020-06-23 11:50:49', '2020-06-23 11:50:49'),
(18, 'Prova4', 'prova4@prova.it', '$2y$10$RHZJIf36RTHmN0VSxeRzFOU9TPs/0LqB7cO4BCi2LGFHRu213.gP2', NULL, '2020-06-23 11:51:45', '2020-06-23 11:51:45'),
(19, 'Cristian Livella', 'cristian@cristianlivella.com', 'paleoid', NULL, '2020-06-24 14:40:27', '2020-06-24 14:40:27'),
(21, 'rik', 'reek.dangerous@gmail.com', '$2y$10$x1dBkdjylUK5o7Dpe.pwHezQqimjnLTTIkHbEpqiIsIQGzKPjqJh6', NULL, '2020-06-26 15:45:47', '2020-06-27 13:10:11'),
(22, 'proof', 'proof@gmail.com', '$2y$10$cLUKxhV3fSUWZspe0nfL8.O4Y5dBTlff7dGrxpLdSg4K334M0WJw6', NULL, '2020-06-27 13:08:24', '2020-06-27 13:10:24');

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `adoptions`
--
ALTER TABLE `adoptions`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `classes`
--
ALTER TABLE `classes`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `demands`
--
ALTER TABLE `demands`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `supplies`
--
ALTER TABLE `supplies`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `adoptions`
--
ALTER TABLE `adoptions`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT per la tabella `books`
--
ALTER TABLE `books`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=86;

--
-- AUTO_INCREMENT per la tabella `classes`
--
ALTER TABLE `classes`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT per la tabella `demands`
--
ALTER TABLE `demands`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT per la tabella `password_resets`
--
ALTER TABLE `password_resets`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT per la tabella `subjects`
--
ALTER TABLE `subjects`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `supplies`
--
ALTER TABLE `supplies`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT per la tabella `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
