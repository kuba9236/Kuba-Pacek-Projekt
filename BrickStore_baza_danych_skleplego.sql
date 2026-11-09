-- BrickStore: baza do nowej instalacji (nie importuj na bazę z danymi!)
-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Paź 29, 2026 at 08:58 AM
-- Wersja serwera: 10.11.16-MariaDB
-- Wersja PHP: 8.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
CREATE DATABASE IF NOT EXISTS `skleplego` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `skleplego`;

START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Baza danych: `skleplego`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `categories`
--

CREATE TABLE `categories` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Zrzut danych tabeli `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(4, 'Botanicals'),
(1, 'Harry Potter'),
(2, 'MARVEL'),
(3, 'Speed Champions');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `favorites`
--

CREATE TABLE `favorites` (
  `user_id` int(10) UNSIGNED NOT NULL,
  `product_id` int(10) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `orders`
--

CREATE TABLE `orders` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED DEFAULT NULL,
  `customer_name` varchar(150) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(40) DEFAULT NULL,
  `delivery_address` varchar(255) NOT NULL,
  `delivery_postal_code` varchar(20) NOT NULL,
  `delivery_city` varchar(100) NOT NULL,
  `payment_method` enum('przelew','blik','pobranie','karta') NOT NULL,
  `status` enum('nowe','oczekuje_na_platnosc','oplacone','w_realizacji','wyslane','anulowane') NOT NULL DEFAULT 'nowe',
  `total` decimal(10,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `order_items`
--

CREATE TABLE `order_items` (
  `id` int(10) UNSIGNED NOT NULL,
  `order_id` int(10) UNSIGNED NOT NULL,
  `product_id` int(10) UNSIGNED DEFAULT NULL,
  `product_name` varchar(255) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `quantity` int(10) UNSIGNED NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `products`
--

CREATE TABLE `products` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `category_id` int(10) UNSIGNED NOT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `image` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `stock` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `is_available` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Zrzut danych tabeli `products`
--

INSERT INTO `products` (`id`, `name`, `category_id`, `price`, `image`, `description`, `stock`, `is_available`, `created_at`) VALUES
(1, 'Zamek Hogwart™ i błonia', 1, 729.99, 'hpdwa.png', 'Zestaw LEGO z kategorii Harry Potter.', 5, 1, '2026-10-29 07:50:34'),
(2, 'Dom Luny Lovegood', 1, 419.99, 'hpcztery.png', 'Zestaw LEGO z kategorii Harry Potter.', 5, 1, '2026-10-29 07:50:34'),
(3, 'Wolny skrzat Zgredek', 1, 249.00, 'hptrzy.png', 'Zestaw LEGO z kategorii Harry Potter.', 8, 1, '2026-10-29 07:50:34'),
(4, 'Nora edycja kolekcjonerska', 1, 1129.99, 'hpjeden.png', 'Zestaw LEGO z kategorii Harry Potter.', 2, 1, '2026-10-29 07:50:34'),
(5, 'Zamek Hogwart™ Ceremonia przydziału', 1, 61.99, 'hppiec.png', 'Zestaw LEGO z kategorii Harry Potter.', 12, 1, '2026-10-29 07:50:34'),
(6, 'Bukiet różowych róż', 4, 249.99, 'kwiatyjeden.png', 'Zestaw LEGO z kategorii Botanicals.', 7, 1, '2026-10-29 07:50:34'),
(7, 'Wiszące epipremnum złociste', 4, 249.99, 'kwiatydwa.png', 'Zestaw LEGO z kategorii Botanicals.', 6, 1, '2026-10-29 07:50:34'),
(8, 'Mała orchidea', 4, 124.99, 'kwiatytrzy.png', 'Zestaw LEGO z kategorii Botanicals.', 9, 1, '2026-10-29 07:50:34'),
(9, 'Małe drzewka bonsai', 4, 249.99, 'kwiatycztery.png', 'Zestaw LEGO z kategorii Botanicals.', 4, 1, '2026-10-29 07:50:34'),
(10, 'Grzyby leśne', 4, 239.99, 'kwiatypiec.png', 'Zestaw LEGO z kategorii Botanicals.', 5, 1, '2026-10-29 07:50:34'),
(11, 'Panorama uniwersum Marvela', 2, 429.99, 'marveljeden.png', 'Zestaw LEGO z kategorii MARVEL.', 3, 1, '2026-10-29 07:50:34'),
(12, 'Avengers: Doomsday Nowa Wieża Avengersów', 2, 469.99, 'marveldwa.png', 'Zestaw LEGO z kategorii MARVEL.', 4, 1, '2026-10-29 07:50:34'),
(13, 'X-Men: Instytut Xaviera', 2, 1399.99, 'marveltzy.png', 'Zestaw LEGO z kategorii MARVEL.', 2, 1, '2026-10-29 07:50:34'),
(14, 'Logo MARVEL z minifigurkami', 2, 439.99, 'marvelpiec.png', 'Zestaw LEGO z kategorii MARVEL.', 6, 1, '2026-10-29 07:50:34');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `username` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indeksy dla tabeli `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`user_id`,`product_id`),
  ADD KEY `fk_favorites_product` (`product_id`);

--
-- Indeksy dla tabeli `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_orders_user` (`user_id`);

--
-- Indeksy dla tabeli `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_order_items_order` (`order_id`),
  ADD KEY `fk_order_items_product` (`product_id`);

--
-- Indeksy dla tabeli `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_products_category` (`category_id`);

--
-- Indeksy dla tabeli `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT dla zrzuconych tabel
--

--
-- AUTO_INCREMENT dla tabeli `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT dla tabeli `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT dla tabeli `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT dla tabeli `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE `products`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Ograniczenia dla zrzutów tabel
--

--
-- Ograniczenia dla tabeli `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `fk_favorites_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_favorites_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ograniczenia dla tabeli `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ograniczenia dla tabeli `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_order_items_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ograniczenia dla tabeli `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
