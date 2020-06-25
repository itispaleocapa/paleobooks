-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Creato il: Giu 25, 2020 alle 19:10
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

--
-- Dump dei dati per la tabella `adoptions`
--

INSERT INTO `adoptions` (`id`, `book_id`, `class_id`, `subject_id`, `must_buy`, `recommended`, `new_adoption`, `created_at`, `updated_at`) VALUES
(1, 56, 2, 2, 1, 1, 1, NULL, NULL),
(2, 55, 2, 2, 1, 1, 1, NULL, NULL),
(3, 54, 2, 2, 1, 1, 1, NULL, NULL);

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

--
-- Dump dei dati per la tabella `books`
--

INSERT INTO `books` (`id`, `title`, `isbn`, `price`, `autors`, `photo`, `publisher`, `created_at`, `updated_at`) VALUES
(1, 'Chimica: molecole in movimento. Volume unico. Per le Scuole superiori  . Con Contenuto digitale (fornito elettronicamente)', '9788808269409', '34.60', '', NULL, '', NULL, NULL),
(2, 'Giovani Diritti Regole.  Con Cittadini digitali + ITE + Didastore', '9788839526953', '21.95', '', NULL, '', NULL, NULL),
(3, 'La fisica di Walker. Vol. unico. Per le Scuole superiori. Con e-book. Con espansione online', '9788863648850', '32.15', '', NULL, '', NULL, NULL),
(4, 'Grammar reference. Per le Scuole superiori. Con DVD-ROM. Con e-book. Con espansione online', '9788849420883', '28.70', '', NULL, '', NULL, NULL),
(5, 'Engage! With your future. Per le Scuole superiori. Con e-book. Con espansione online', '9788883395260', '28.60', '', NULL, '', NULL, NULL),
(6, 'Un libro sogna. Narrativa. Per le Scuole superiori. Con aggiornamento online', '9788808721075', '23.40', '', NULL, '', NULL, NULL),
(7, 'Il buon uso dell\'italiano. Vol. A-B. Per le Scuole superiori. Con e-book. Con espansione online', '9788869644801', '32.20', '', NULL, '', NULL, NULL),
(8, 'Colori della matematica. Geometria-Quaderno geometria. Ediz. verde. Per gli Ist. tecnici. Con e-book. Con espansione online', '9788849421712', '17.70', '', NULL, '', NULL, NULL),
(9, 'Colori della matematica. Algebra-Quaderno. Ediz. verde. Per gli Ist. tecnici. Con e-book. Con espansione online: 1', '9788849421699', '28.10', '', NULL, '', NULL, NULL),
(10, 'Terra, acqua, aria. Per le Scuole superiori. Con e-book. Con espansione online', '9788808520593', '20.00', '', NULL, '', NULL, NULL),
(11, 'Sapere storia. Con Atlante. Per le Scuole superiori. Con e-book. Con espansione online: 1', '9788842114888', '22.90', '', NULL, '', NULL, NULL),
(12, 'TTR. Tecnologie e tecniche di rappresentazione grafica. Disegno 1-Materiali misura sicurezza-schede di disegno 1. Per le Scuole superiori', '9788805073634', '13.20', '', NULL, '', NULL, NULL),
(13, 'TTR. Tecnologie e tecniche di rappresentazione grafica. Disegno 2-Schede di disegno 2. Per le Scuole superiori', '9788805073641', '14.20', '', NULL, '', NULL, NULL),
(14, 'Dal bit alle App. Con codifiche in Scratch, Clanguage, Python, Pascal App Inventor per Android. Per le Scuole superiori. Con e-book. Con espansione online', '9788863648935', '21.70', '', NULL, '', NULL, NULL),
(15, 'Il nuovo tiberiade. Le grandi religioni. Per le Scuole superiori. Con e-book. Con espansione online', '9788835047537', '16.70', '', NULL, '', NULL, NULL),
(16, 'Più movimento. Vol. unico. Per le Scuole superiori. Con e-book. Con espansione online', '9788839302809', '21.35', '', NULL, '', NULL, NULL),
(17, 'Biologica. Capire le scienze della vita. Per le Scuole superiori. Con e-book. Con espansione online', '9788863649611', '22.80', '', NULL, '', NULL, NULL),
(18, 'Ora geo. Per gli Ist. tecnici e professionali. Con e-book. Con espansione online. Con Libro: Atlante', '9788851128272', '11.65', '', NULL, '', NULL, NULL),
(19, 'Un libro sogna. Poesia e teatro. Per le Scuole superiori. Con aggiornamento online', '9788808592095', '17.20', '', NULL, '', NULL, NULL),
(20, 'La matematica a colori. Algebra. Ediz. verde. Per le Scuole superiori. Con e-book. Con espansione online: 2', '9788849419153', '24.20', '', NULL, '', NULL, NULL),
(21, 'Corso di scienze e tecnologie applicate. Ediz. openschool. Per gli Ist. tecnici settore tecnologico. Con e-book. Con espansione online', '9788820372729', '20.90', '', NULL, '', NULL, NULL),
(22, 'Sapere storia. Per le Scuole superiori. Con e-book. Con espansione online: 2', '9788842114895', '22.90', '', NULL, '', NULL, NULL),
(23, 'Speak your mind compact. Per le Scuole superiori. Con e-book. Con espansione online', '9788883392481', '29.10', '', NULL, '', NULL, NULL),
(24, 'La matematica a colori. Geometria. Ediz. verde. Per le Scuole superiori. Con e-book. Con espansione online', '9788849419160', '14.95', '', NULL, '', NULL, NULL),
(25, 'Corso di elettrotecnica ed elettronica. Per l\'articolazione elettrotecnica degli istituti tecnici settore tecnologico. Per le Scuole superiori. Con DVD', '9788820366261', '25.90', '', NULL, '', NULL, NULL),
(26, 'Performer B2 updated. Ready for First and INVALSI. Student\'s book-Workbook. Per le Scuole superiori. Con espansione online', '9788808812568', '36.00', '', NULL, '', NULL, NULL),
(27, 'La letteratura ieri, oggi, domani. Con Antologia. Ediz. nuovo esame di Stato. Per le Scuole superiori. Con e-book. Con espansione online: 1', '9788839536440', '44.20', '', NULL, '', NULL, NULL),
(28, 'La matematica a colori. Ediz. verde. Vol. A-B. Per le Scuole superiori. Con e-book. Con espansione online: 3', '9788849420227', '31.90', '', NULL, '', NULL, NULL),
(29, 'Corso di sistemi automatici. Nuova edizione openschool. Per le articolazioni elettrotecnica, elettronica e automazione degli Istituti Tecnici.. Con DVD: 1', '9788820366322', '25.90', '', NULL, '', NULL, NULL),
(30, 'Voci della storia e dell\'attualità. Per le Scuole superiori. Con espansione online: 1', '9788822173386', '23.60', '', NULL, '', NULL, NULL),
(31, 'Tecnologie e progettazione di sistemi elettrici ed elettronici. Nuova edizione openschool. Per l\'articolazione elettronica degli Istituti Tecnici ... di Sistemi Elettrici ed Elettronici  - VOL.1', '9788820366643', '24.90', '', NULL, '', NULL, NULL),
(32, 'Fondamenti di elettrotecnica ed elettronica. Con quaderno. Per gli Ist. tecnici industriali. Con espansione online: 1', '9788884881182', '19.50', '', NULL, '', NULL, NULL),
(33, 'Scienze e tecnologie applicate con Arduino. Per gli Ist. tecnici. Con e-book. Con espansione online', '9788826818184', '13.50', '', NULL, '', NULL, NULL),
(34, 'Nuovo sistemi e reti. Per l\'articolazione informatica degli istituti tecnici settore tecnologico. Ediz. openschool. Per gli Ist. tecnici industriali. Con e-book. Con espansione online: 1', '9788820388737', '20.90', '', NULL, '', NULL, NULL),
(35, 'Nuovo tecnologie e progettazione di sistemi informatici e di telecomunicazioni. Per l\'articolazione informatica degli istituti tecnici settore ... Con e-book. Con espansione online: 1', '9788820388584', '22.90', '', NULL, '', NULL, NULL),
(36, 'Telecomunicazioni per informatica. Laboratorio. Con quaderno operativo di laboratorio. Con e-book. Con espansione online. Per gli Ist. tecnici industriali', '9788884882615', '24.00', '', NULL, '', NULL, NULL),
(37, 'Corso di informatica. Per le Scuole superiori. Con Contenuto digitale (fornito elettronicamente): 1', '9788808520937', '28.60', '', NULL, '', NULL, NULL),
(38, 'Il nuovo dal progetto al prodotto. Per gli Ist. tecnici industriali. Con espansione online: 1', '9788839529930', '37.70', '', NULL, '', NULL, NULL),
(39, 'Sistemi automazione industriale. Meccanica-Meccatronica. Per gli Ist. tecnici e professionali. Con espansione online: 1', '9788837914059', '24.50', '', NULL, '', NULL, NULL),
(40, 'Corso di tecnologia meccanica. Ediz. openschool. Controlli, produzione dei materiali, processi di trasformazione, collegamenti. Per le Scuole superiori: 1', '9788820366506', '28.90', '', NULL, '', NULL, NULL),
(41, 'Manuale di meccanica', '9788820366452', '71.90', '', NULL, '', NULL, NULL),
(42, 'Le basi della chimica analitica. Laboratorio. Per le Scuole superiori. Con espansione online', '9788808202871', '17.20', '', NULL, '', NULL, NULL),
(43, 'Percorsi di chimica organica. Per le Scuole superiori. Con espansione online', '9788808063656', '19.50', '', NULL, '', NULL, NULL),
(44, 'Il tempo del vestire. Storia del costume e della moda. Per le Scuole superiori. Con espansione online: 3', '9788808353467', '23.70', '', NULL, '', NULL, NULL),
(45, 'Corso di elettrotecnica ed elettronica. Ediz. openschool. Per gli Ist. tecnici industriali. Con e-book. Con espansione online: 2', '9788820372767', '23.90', '', NULL, '', NULL, NULL),
(46, 'Working with new technology. Per gli Ist. professionali. Con e-book. Con espansione online [Lingua inglese]', '9788883394348', '24.60', '', NULL, '', NULL, NULL),
(47, 'La letteratura ieri, oggi, domani. Dal barocco a Leopardi. Ediz. nuovo esame di Stato. Per le Scuole superiori. Con e-book. Con espansione online: 2', '9788839536457', '39.70', '', NULL, '', NULL, NULL),
(48, 'La matematica a colori. Ediz. verde. Per le Scuole superiori. Con e-book. Con espansione online: 4', '9788849420234', '30.85', '', NULL, '', NULL, NULL),
(49, 'Corso di sistemi automatici. Ediz. openschool. Con e-book. Con espansione online. Per gli Ist. tecnici industriali: 2', '9788820372750', '25.90', '', NULL, '', NULL, NULL),
(50, 'Voci della storia e dell\'attualità. Per le Scuole superiori. Con espansione online: 2', '9788822173515', '25.10', '', NULL, '', NULL, NULL),
(51, 'Tecnologie e progettazione di sistemi elettrici ed elettronici. Per gli Ist. tecnici industriali. Con e-book. Con espansione online: 2', '9788820372781', '25.90', '', NULL, '', NULL, NULL),
(52, 'Cult B2. Student\'s book and Workbook. Per le Scuole superiori. Con espansione online [Lingua inglese]', '9788853015044', '30.90', '', NULL, '', NULL, NULL),
(53, 'Tiberiade. Ediz. plus. Per le Scuole superiori. Con DVD. Con e-book. Con espansione online', '9788835038412', '15.40', '', NULL, '', NULL, NULL),
(54, 'Economia, marketing & distribuzione. Ediz. blu: moda. Per gli Ist. tecnici e professionali. Con ebook. Con espansione online', '9788820383299', '0.00', '', NULL, '', NULL, NULL),
(55, 'Fondamenti di elettrotecnica ed elettronica. Con Quaderno operativo di laboratorio. Per gli Ist. tecnici industriali. Con espansione online: 2', '9788884881250', '22.50', '', NULL, '', NULL, NULL),
(56, 'Sistemi e reti. Ediz. openschool. PEr gli Ist. tecnici industriali. Con e-book. Con espansione online: 2', '9788820372484', '21.90', '', NULL, '', NULL, NULL),
(57, 'Tecnologie e progettazione di sistemi informatici e di telecomunicazioni. Per gli Ist. tecnici industriali. Con e-book. Con espansione online: 2', '9788820372347', '22.90', '', NULL, '', NULL, NULL),
(58, 'Bit by bit. English for information and communications technology. Per il triennio degli Ist. tecnici settore tecnologico. Con ebook. Con espansione online. Con CD-Audio [Lingua inglese]', '9788844120801', '0.00', '', NULL, '', NULL, NULL),
(59, 'Tutti i colori della vita. Con fascicolo Ciotti: non lasciamoci rubare il futuro. Ediz. blu. Per le Scuole superiori. Con espansione online', '9788805070237', '19.70', '', NULL, '', NULL, NULL),
(60, 'Il nuovo dal progetto al prodotto. Per gli Ist. Tecnici industriali. Con espansione online: 2', '9788839529947', '37.70', '', NULL, '', NULL, NULL),
(61, 'I mech. English for mechanical technology. Ediz. openschool. Per gli Ist. tecnici e professionali. Con e-book. Con espansione online. Con CD-Audio', '9788820388669', '22.90', '', NULL, '', NULL, NULL),
(62, 'Sistemi e automazione. Ediz. openschool. Per gli Ist. tecnici industriali. Con e-book. Con espansione online: 2', '9788820378349', '25.90', '', NULL, '', NULL, NULL),
(63, 'Corso di tecnologia meccanica. Ediz. openschool. Per gli Ist. tecnici industriali. Con e-book. Con espansione online: 2', '9788820372408', '25.90', '', NULL, '', NULL, NULL),
(64, 'Smartmech. Prove d\'esame-Flip book. Per gli Ist. tecnici. Con e-book. Con espansione online [Lingua inglese]', '9788853620774', '23.90', '', NULL, '', NULL, NULL),
(65, 'Macchine termiche. Per gli Ist. tecnici e professionali', '9788842660149', '0.00', '', NULL, '', NULL, NULL),
(66, 'Corso di elettrotecnica ed elettronica. Ediz. openschool. Per gli Ist. tecnici industriali. Con e-book. Con espansione online: 3', '9788820378479', '25.90', '', NULL, '', NULL, NULL),
(67, 'Talent Level 3 Exams Toolkit [Lingua inglese]', '9781108454551', '6.40', '', NULL, '', NULL, NULL),
(68, 'La letteratura ieri, oggi, domani. Ediz. nuovo esame di Stato. Per le Scuole superiori. Con e-book. Con espansione online: 3\\2', '9788839536495', '26.40', '', NULL, '', NULL, NULL),
(69, 'La letteratura ieri, oggi, domani. Ediz. nuovo esame di Stato. Per le Scuole superiori. Con e-book. Con espansione online: 3\\1', '9788839536488', '26.40', '', NULL, '', NULL, NULL),
(70, 'La matematica a colori. Ediz. verde. Per le Scuole superiori: 5', '9788849420241', '28.70', '', NULL, '', NULL, NULL),
(71, 'Corso di sistemi automatici. Ediz. openschool. Per gli Ist. tecnici industriali. Con e-book. Con espansione online: 3', '9788820378462', '27.90', '', NULL, '', NULL, NULL),
(72, 'Voci della storia e dell\'attualità. Per le Scuole superiori. Con espansione online: 3', '9788822173430', '26.20', '', NULL, '', NULL, NULL),
(73, 'Tecnologie e progettazione di sistemi elettrici ed elettronici. Per gli Ist. tecnici industriali. Con e-book. Con espansione online: 3', '9788820378509', '25.90', '', NULL, '', NULL, NULL),
(74, 'New electr-on. English for electronics, electrotechnology, automation and Ict. Per gli Ist. Tecnici e professionali. Con CD Audio. Con espansione online [Lingua inglese]', '9788844118730', '24.80', '', NULL, '', NULL, NULL),
(75, 'Le vie del mondo. Per le Scuole superiori. Con e-book', '9788805074389', '17.70', '', NULL, '', NULL, NULL),
(76, 'Fondamenti di elettrotecnica ed elettronica. Con quaderno. Con espansione online. Per gli Ist. tecnici industriali: 3', '9788884881267', '23.50', '', NULL, '', NULL, NULL),
(77, 'Corso di sistemi automatici. Per l\'articolazione automazione. Ediz. openschool gialla. Per gli Ist. tecnici settore tecnologico. Con e-book. Con espansione online: 3', '9788820378455', '26.90', '', NULL, '', NULL, NULL),
(78, 'Sitemi e reti. Ediz. openschool. Per gli Ist. tecnici industriali. Con e-book. Con espansione online: 3', '9788820378622', '22.90', '', NULL, '', NULL, NULL),
(79, 'Tecnologie e progettazione di sistemi informatici e di telecomunicazioni. Per gli Ist. tecnici industriali. Con e-book. Con espansione online: 3', '9788820378424', '23.90', '', NULL, '', NULL, NULL),
(80, 'Gestione del progetto e organizzazione di impresa. Per gli Ist. tecnici. Con e-book. Con espansione online', '9788820361099', '21.50', '', NULL, '', NULL, NULL),
(81, 'New i-tech. English for information and communication technology. Per gli Ist. tecnici e professionali. Con e-book. Con espansione online', '9788844119621', '24.80', '', NULL, '', NULL, NULL),
(82, 'Corso di informatica. Per le Scuole superiori. Con espansione online: 3', '9788808245427', '32.00', '', NULL, '', NULL, NULL),
(83, 'Nuovo dal progetto al prodotto. Per gli Ist. Tecnici industriali. Con espansione online: 3', '9788839529954', '41.35', '', NULL, '', NULL, NULL),
(84, 'Sistemi e automazione. Ediz. Openschool. Per l\'indirizzo Meccanica, meccatronica ed energia degli Ist. tecnici settore tecnologico. Con ebook. Con espansione online: 3', '9788820383268', '25.90', '', NULL, '', NULL, NULL),
(85, 'Marketing, distribuzione & presentazione del prodotto. Tessile abbigliamento. Con e-book. Con espansione online. Per gli Ist. tecnici e professionali', '9788884882707', '21.00', '', NULL, '', NULL, NULL);

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

--
-- Dump dei dati per la tabella `classes`
--

INSERT INTO `classes` (`id`, `name`, `school_year`, `created_at`, `updated_at`) VALUES
(2, '1 IA', '2020', NULL, NULL);

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
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dump dei dati per la tabella `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `created_at`, `updated_at`) VALUES
(1, 'Cristian', '', '', NULL, NULL),
(2, 'Adriano', '', '', NULL, NULL),
(3, 'Alessandro', '', '', NULL, NULL),
(4, 'Davide', '', '', NULL, NULL),
(5, 'Riccardo', '', '', NULL, NULL),
(6, 'Jocelyn Hodkiewicz III', 'antwan20@hotmail.com', '$2y$10$EYxj/NyKtlbx6xX6V5AMpeNV4eH1wqtu6WXbAGYn/AtpWN07u8BSK', '2020-06-22 17:40:41', '2020-06-22 17:40:41'),
(7, 'Kiana Davis Sr.', 'andres84@waelchi.com', '$2y$10$7SBKZtLBad/0.7pACu6dWezBcJJIYIMrWbA1LZK.liocmKvpML6y.', '2020-06-22 17:40:42', '2020-06-22 18:56:48'),
(8, 'Cecelia Terry', 'west.dallas@hartmann.biz', '$2y$10$3O/Ug5wRrbK2lFNu7M2JD.b.9W2WTTC3xQSu6SUdSsVZ6j/mvKYHm', '2020-06-22 17:40:42', '2020-06-22 17:40:42'),
(9, 'Breana Nader', 'murray.coby@yahoo.com', '$2y$10$lHhJ3FdyZyTExPy4vd6LJuB9pJ2B9Kw3gPrPx..DB4KW0E1l2Q.mC', '2020-06-22 17:40:42', '2020-06-22 17:40:42'),
(10, 'Miss Cynthia Hyatt', 'vern83@lowe.biz', '$2y$10$U54fhYmCmxKPQeWlGMuhNOiAzbvFmagpzAY5n7MRnmIX0LNrcZvPW', '2020-06-22 17:40:42', '2020-06-22 17:40:42'),
(11, 'Mozelle Satterfield', 'gulgowski.della@nienow.com', '$2y$10$.0tGHgwQFbZkJPOl12XfmubnnpMYutRZpQD62mjla9o9zYzXiSvti', '2020-06-22 17:40:42', '2020-06-22 17:40:42'),
(12, 'Ricky Considine', 'cummings.warren@zboncak.com', '$2y$10$hdhnMf2oNn0qnh0ppcRb3O95wTh/jE7HVood4Bjyu9S7OJYapKhd6', '2020-06-22 17:40:42', '2020-06-22 17:40:42'),
(13, 'Mrs. Yazmin Will Sr.', 'glowe@collins.info', '$2y$10$cAzFF/2BW/A9GejbGdl.sOXR2nUrm70F65LCcqIhJp1PhBiupQyE6', '2020-06-22 17:40:42', '2020-06-22 17:40:42'),
(14, 'Viola Parisian', 'waters.deshaun@schultz.info', '$2y$10$E1uNGK7ndMELIDfgDzMk6O8BTF.MKFVF9QxE5A7LIBQ3DAAFDTT2i', '2020-06-22 17:40:42', '2020-06-22 17:40:42'),
(15, 'Prof. Rylee Wisozk MD', 'stamm.celestino@hotmail.com', '$2y$10$1DsarARHMZ9hPdNYlXINneW08o5Oj25gxjGYNO8IMJuSnGqp3mAW.', '2020-06-22 17:40:42', '2020-06-22 22:31:00'),
(16, 'prova', 'prova@prova.prova', '$2y$10$9ovNRsrneFyr7ZXt2lLGvuOJnygpxGmBkj5Ta7WbVvYfBYmeNt6wy', '2020-06-22 18:26:55', '2020-06-22 18:26:55'),
(17, 'Prova2', 'prova@prova.it', '$2y$10$XFTwYhg2MudgNjQSpJ9eMOEmmVX0k3PbIFoHJwFaFZU8yh1/yEK1O', '2020-06-23 11:50:49', '2020-06-23 11:50:49'),
(18, 'Prova4', 'prova4@prova.it', '$2y$10$RHZJIf36RTHmN0VSxeRzFOU9TPs/0LqB7cO4BCi2LGFHRu213.gP2', '2020-06-23 11:51:45', '2020-06-23 11:51:45'),
(19, 'Cristian Livella', 'cristian@cristianlivella.com', 'paleoid', '2020-06-24 14:40:27', '2020-06-24 14:40:27');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
