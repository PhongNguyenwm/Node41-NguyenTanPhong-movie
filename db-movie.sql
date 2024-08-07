/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE TABLE `banner` (
  `id` int NOT NULL AUTO_INCREMENT,
  `movie_id` int DEFAULT NULL,
  `banner_image` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `movie_id` (`movie_id`),
  CONSTRAINT `banner_ibfk_1` FOREIGN KEY (`movie_id`) REFERENCES `movie` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `cinema` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cinema_name` varchar(100) DEFAULT NULL,
  `cinema_group_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cinema_group_id` (`cinema_group_id`),
  CONSTRAINT `cinema_ibfk_1` FOREIGN KEY (`cinema_group_id`) REFERENCES `cinema_group` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `cinema_chain` (
  `id` int NOT NULL AUTO_INCREMENT,
  `chain_name` varchar(100) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `cinema_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `group_name` varchar(100) DEFAULT NULL,
  `address` varchar(100) DEFAULT NULL,
  `cinema_chain_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cinema_chain_id` (`cinema_chain_id`),
  CONSTRAINT `cinema_group_ibfk_1` FOREIGN KEY (`cinema_chain_id`) REFERENCES `cinema_chain` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `movie` (
  `id` int NOT NULL AUTO_INCREMENT,
  `movie_name` varchar(100) DEFAULT NULL,
  `trailer` varchar(100) DEFAULT NULL,
  `image` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `description` varchar(255) DEFAULT NULL,
  `premiere_day` datetime DEFAULT NULL,
  `rating` int DEFAULT NULL,
  `hot` tinyint(1) DEFAULT NULL,
  `showing` tinyint(1) DEFAULT NULL,
  `showing_soon` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `movie_booking` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `schedule_id` int DEFAULT NULL,
  `seat_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `schedule_id` (`schedule_id`),
  KEY `seat_id` (`seat_id`),
  CONSTRAINT `movie_booking_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `movie_booking_ibfk_2` FOREIGN KEY (`schedule_id`) REFERENCES `movie_schedule` (`id`),
  CONSTRAINT `movie_booking_ibfk_3` FOREIGN KEY (`seat_id`) REFERENCES `seat` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `movie_schedule` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cinema_id` int DEFAULT NULL,
  `movie_id` int DEFAULT NULL,
  `showing_datetime` datetime DEFAULT NULL,
  `ticket_price` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cinema_id` (`cinema_id`),
  KEY `movie_id` (`movie_id`),
  CONSTRAINT `movie_schedule_ibfk_1` FOREIGN KEY (`cinema_id`) REFERENCES `cinema` (`id`),
  CONSTRAINT `movie_schedule_ibfk_2` FOREIGN KEY (`movie_id`) REFERENCES `movie` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `seat` (
  `id` int NOT NULL AUTO_INCREMENT,
  `seat_name` varchar(50) DEFAULT NULL,
  `seat_type` varchar(50) DEFAULT NULL,
  `cinema_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cinema_id` (`cinema_id`),
  CONSTRAINT `seat_ibfk_1` FOREIGN KEY (`cinema_id`) REFERENCES `cinema` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fullname` varchar(100) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `phone` varchar(10) DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `user_type` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `banner` (`id`, `movie_id`, `banner_image`) VALUES
(1, 1, 'king_kong.jpeg');
INSERT INTO `banner` (`id`, `movie_id`, `banner_image`) VALUES
(3, 20, '1719823265564_Loki.jpg');


INSERT INTO `cinema` (`id`, `cinema_name`, `cinema_group_id`) VALUES
(1, 'CGV_D5_1', 2);
INSERT INTO `cinema` (`id`, `cinema_name`, `cinema_group_id`) VALUES
(2, 'CGV_D5_2', 2);
INSERT INTO `cinema` (`id`, `cinema_name`, `cinema_group_id`) VALUES
(4, 'BHD STAR 3/2', 9);

INSERT INTO `cinema_chain` (`id`, `chain_name`, `logo`) VALUES
(2, 'CGV_MEGA', 'MEGA_CGV.jpeg');
INSERT INTO `cinema_chain` (`id`, `chain_name`, `logo`) VALUES
(3, 'CineStar', 'CineStart.jpeg');
INSERT INTO `cinema_chain` (`id`, `chain_name`, `logo`) VALUES
(4, 'LotteCinema', 'LotteCinema.jpeg');
INSERT INTO `cinema_chain` (`id`, `chain_name`, `logo`) VALUES
(6, 'BHD STAR', '1719837435195_logoBHD.png');

INSERT INTO `cinema_group` (`id`, `group_name`, `address`, `cinema_chain_id`) VALUES
(2, 'CGV_district_5', 'Tran Hung Dao street, district 5', 2);
INSERT INTO `cinema_group` (`id`, `group_name`, `address`, `cinema_chain_id`) VALUES
(3, 'CGV_district_10', 'Nguyen Tri Phuong street, district 10', 2);
INSERT INTO `cinema_group` (`id`, `group_name`, `address`, `cinema_chain_id`) VALUES
(4, 'CGV_premium', 'Nguyen Tri Phuong street, district 1', 2);
INSERT INTO `cinema_group` (`id`, `group_name`, `address`, `cinema_chain_id`) VALUES
(6, 'BHD STAR THẢO ĐIỀN', 'Tầng 5, Vincom Mega Mall Thảo Điền, 159 Xa Lộ Hà Nội, P.Thảo Điền, Quận 2, TPHCM', 6),
(7, 'BHD STAR QUANG TRUNG', 'Tầng B2, Vincom Plaza Quang Trung, 190 Quang Trung, P.10, Quận Gò Vấp, Tp.HCM', 6),
(8, 'BHD STAR PHẠM HÙNG', 'Tầng 4, TTTM Satra Phạm Hùng, C6/27 Phạm Hùng, Bình Chánh, TPHCM.', 6),
(9, 'BHD STAR 3/2', 'Tầng 5, Vincom Plaza 3/2, 3C Đường 3 Tháng 2, P.11, Quận 10, TPHCM', 6);

INSERT INTO `movie` (`id`, `movie_name`, `trailer`, `image`, `description`, `premiere_day`, `rating`, `hot`, `showing`, `showing_soon`) VALUES
(1, 'King Kong', 'king_kong.mp3', 'King Kong poster.jpeg', 'King Kong Movie 2025', '2024-04-06 15:30:00', 9, 1, 1, 0);
INSERT INTO `movie` (`id`, `movie_name`, `trailer`, `image`, `description`, `premiere_day`, `rating`, `hot`, `showing`, `showing_soon`) VALUES
(2, 'Kingsman Origin', 'kings_man_trailer.jpeg', 'kings_man_poster.jpeg', 'kingmans origin', '2024-05-01 00:00:00', 8, 1, 0, 1);
INSERT INTO `movie` (`id`, `movie_name`, `trailer`, `image`, `description`, `premiere_day`, `rating`, `hot`, `showing`, `showing_soon`) VALUES
(3, 'King Of Monsters', 'monster_king.mov', 'monster_king.jpeg', 'Godzilla fighting to be the king of monster', '2024-06-01 00:00:00', 10, 1, 0, 1);
INSERT INTO `movie` (`id`, `movie_name`, `trailer`, `image`, `description`, `premiere_day`, `rating`, `hot`, `showing`, `showing_soon`) VALUES
(4, 'King of the Jungle', 'king_of_the_jungle.mov', '1719655124027_Loki.jpg', 'disney tarzan movie', '2025-12-12 00:00:00', 8, 1, 0, 1),
(20, 'Loki', 'https://youtu.be/dug56u8NN7g', '1719822514600_Loki.jpg', 'test decription', '2024-06-28 00:00:00', 9, 1, 1, 0);

INSERT INTO `movie_booking` (`id`, `user_id`, `schedule_id`, `seat_id`) VALUES
(1, 2, 1, 1);
INSERT INTO `movie_booking` (`id`, `user_id`, `schedule_id`, `seat_id`) VALUES
(2, 2, 1, 2);
INSERT INTO `movie_booking` (`id`, `user_id`, `schedule_id`, `seat_id`) VALUES
(9, 2, 1, 3);
INSERT INTO `movie_booking` (`id`, `user_id`, `schedule_id`, `seat_id`) VALUES
(11, 1, 5, 9),
(12, 5, 5, 14),
(13, 1, NULL, 1),
(14, 1, NULL, 1),
(15, 1, 1, 1),
(16, 1, 2, 3);

INSERT INTO `movie_schedule` (`id`, `cinema_id`, `movie_id`, `showing_datetime`, `ticket_price`) VALUES
(1, 1, 1, '2024-06-11 15:18:48', 500);
INSERT INTO `movie_schedule` (`id`, `cinema_id`, `movie_id`, `showing_datetime`, `ticket_price`) VALUES
(2, 2, 1, '2024-06-15 15:18:48', 500);
INSERT INTO `movie_schedule` (`id`, `cinema_id`, `movie_id`, `showing_datetime`, `ticket_price`) VALUES
(4, NULL, 3, '2024-06-30 17:00:00', 20);
INSERT INTO `movie_schedule` (`id`, `cinema_id`, `movie_id`, `showing_datetime`, `ticket_price`) VALUES
(5, 4, 20, '2024-07-02 01:00:00', 20);

INSERT INTO `seat` (`id`, `seat_name`, `seat_type`, `cinema_id`) VALUES
(1, 'FRONT_ROW_1', 'NORMAL', 1);
INSERT INTO `seat` (`id`, `seat_name`, `seat_type`, `cinema_id`) VALUES
(2, 'FRONT_ROW_2', 'NORMAL', 1);
INSERT INTO `seat` (`id`, `seat_name`, `seat_type`, `cinema_id`) VALUES
(3, 'FRONT_ROW_3', 'NORMAL', 1);
INSERT INTO `seat` (`id`, `seat_name`, `seat_type`, `cinema_id`) VALUES
(4, 'FRONT_ROW_4', 'NORMAL', 1),
(5, 'FRONT_ROW_5', 'NORMAL', 1),
(6, 'COUPLE_1', 'COUPLE', 1),
(7, 'COUPLE_2', 'COUPLE', 1),
(8, 'COUPLE_3', 'COUPLE', 1),
(9, 'A1', 'Normal', 4),
(10, 'A2', 'Normal', 4),
(11, 'A3', 'Normal', 4),
(12, 'A4', 'Normal', 4),
(14, 'SweetBox_1', 'Couple', 4),
(15, 'SweetBox_2', 'Couple', 4),
(16, 'SweetBox_3', 'Couple', 4),
(17, 'SweetBox_4', 'Couple', 4);

INSERT INTO `user` (`id`, `fullname`, `email`, `phone`, `password`, `user_type`) VALUES
(1, 'Tấn Phong', 'phong@mail.com', '0909999999', '1234', 'ADMIN');
INSERT INTO `user` (`id`, `fullname`, `email`, `phone`, `password`, `user_type`) VALUES
(2, 'Tony Teo', 'teo123@mail.com', '0909888888', '$2b$05$yrVzqXnbjGwqeTQZdEf2H.k3r9YqHcF8e7G95KDdbMdB5npMRWcVW', 'USER');
INSERT INTO `user` (`id`, `fullname`, `email`, `phone`, `password`, `user_type`) VALUES
(3, 'Tonnie Tam', 'ttam4456@mail.com', '0909777777', '$2b$05$AgHFV7.DvJcnWYoMmSUtg.UrUUj8nkknrBtHAxcQmlFkTLrVjrRcS', 'USER');
INSERT INTO `user` (`id`, `fullname`, `email`, `phone`, `password`, `user_type`) VALUES
(5, 'Nguyễn Văn Test', 'test@mail.com', '0909666666', '$2b$05$jdzJhMzrq5hvMNaIx51Hme7c23w3mqyBTE6uO7neGOGEC.KWCNgBu', 'USER'),
(6, 'Test Admin', 'admin@mail.com', '0909111111', '$2b$05$8domrqEjQu7fZNjjXqId6OMmOrC8ZKNa8j8GH6yTPqn11yI6dxK1q', 'ADMIN'),
(9, 'testadduser', 'add@mail.com', '0909010101', '$2b$05$axqncKHTrRUUxYK5KnFmRe1ry/yynqLtIkgU7Dy2Cq3lG4OZi2FU6', 'USER');


/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;