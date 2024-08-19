-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 23, 2024 at 04:02 PM
-- Server version: 11.1.3-MariaDB
-- PHP Version: 8.3.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `workbench_studio_ghibli`
--

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `learning_outcomes` text DEFAULT NULL,
  `course_inclusions` text DEFAULT NULL,
  `is_certified` int(11) DEFAULT NULL,
  `author` varchar(255) DEFAULT NULL,
  `course_content` text NOT NULL,
  `price` double(10,2) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL,
  `total_enrollments` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`id`, `title`, `description`, `learning_outcomes`, `course_inclusions`, `is_certified`, `author`, `course_content`, `price`, `status`, `rating`, `total_enrollments`, `created_at`, `updated_at`) VALUES
(3, 'Adobe Premiere Pro CC Masterclass: Video Editing in Premiere', 'Learn Beginner-Advanced Adobe Premiere Pro Video Editing, Audio Editing, Color Grading, Motion Graphics, Green Screen+', 'Master Premiere Pro and be CONFIDENT Editing Your Own Videos\\r\\n\nEdit an entire video from beginning to end, using professional and efficient techniques.\\r\\n\nBy the end of the course, you\'ll have edited your promo video with the supplied footage (video clips, photos, graphics, music, etc.), or your own footage!\\r\\n\nStart a project with the right settings for any type of video, from any camera.\\r\\n\nExport and save your videos for 4K & High Definition playback.\\r\\n\nEdit your videos, and make them more dynamic with cutaway footage and photos.\\r\\n', '25.5 hours on-demand video\\r\\n\n11 articles\\r\\n\n18 downloadable resources\\r\\n\nAccess on mobile and TV\\r\\n\nCertificate of completion\\r\\n', 1, 'Phil Ebiner', 'https://www.youtube.com/', 105.00, 1, 0, 0, '2005-01-24 00:00:00', '2024-03-18 16:53:13'),
(4, 'Complete Graphics Design and Video Editing Masterclass', 'Learn Graphics Design With Adobe Photoshop, Adobe Illustrator, Canva and Learn Video Editing With Adobe Premiere Pro', '\"Master the basics of image editing and manipulation.\\nExplore advanced techniques for photo retouching and enhancement.\\nDesign stunning graphics for both print and digital media.\\nLearn vector graphics creation for logos, illustrations, and more.\\nUnderstand the principles of design and composition.\\nDevelop skills in creating scalable and high-quality graphics.\\nHarness the power of Canva for quick and visually appealing designs.\\nCreate social media posts, presentations, and marketing materials effortlessly.\"', 'Essential Graphic Design With Adobe Photoshop \\r\\n\nPhotoshop Essential Color Adjustment\\r\\n\nContent Aware and Text in Photoshop\\r\\n\nShadow and Shape Symbol in Photoshop\\r\\n\nSelection and Masking With Photoshop\\r\\n', 0, 'Stephen Koel Soren', 'https://www.youtube.com/', 110.00, 1, 0, 0, '2026-01-24 00:00:00', '2024-03-18 16:55:51'),
(5, 'Video Editing Masterclass: Edit Your Videos Like a Pro!', 'The Beginner\'s Step-by-Step Guide to Edit Incredible Looking & Sounding Videos with Any Equipment or Software', 'Step-by-step process to take your video footage, organize, edit, and export an incredible looking video!\\r\\n\nOptimize your workflow and understanding of the editing process to create videos as efficiently as possible!\\r\\n\nChoose the absolute best audio and video filters that fit your personal video style!\nCreate professional looking and sounding videos using optimized editing techniques with virtually any footage!\\r\\n\nBlend together sound effects, background music, voice overs, and other audio elements all into each of your videos!\\r\\n', '16.5 hours on-demand video \\r\\n\nAssignments \\r\\n\n7 articles \\r\\n\n21 downloadable resources \\r\\n\nAccess on mobile and TV \\r\\n\nCertificate of completion \\r\\n', 0, 'Julian Melanson', 'https://www.youtube.com/', 99.00, 1, 0, 0, '2001-02-24 00:00:00', '2024-03-18 16:58:33'),
(6, 'Visual Approach to Screenwriting and Dramatic Storytelling', 'A complete guide to script writing: How to create your screenplay, from basics to techniques of top Hollywood writers', 'Learn how to write a professional-level screenplay or teleplay. \\r\\n\nUnderstand the Visual Approach to screen and television writing and why it matters. \\r\\n\nLearn essential industry concepts and selling tools like High Concept, the Pitch, and the Logline\nHow to write the Slug Line and the Action paragraph. \\r\\n\nThe Do\'s and Don\'ts of writing dialogue that really works. \\r\\n\nHow to hook the audience: The Setup and the Opening Shot. \\r\\n', 'Introduction to the Visual Approach to Screenwriting Course \\r\\n\nHigh Concept, the Pitch, and the Logline \\r\\n\nHow to write the Slug Line and the Action Paragraph \\r\\n\nThe Do\'s and Don\'ts of Effective Dialogue \\r\\n\nExposition: How to Write Exposition that isn\'t boring \\r\\n', 0, 'Andrew Kaplan', 'https://www.youtube.com/embed/_2uZ7IabVOM?si=0UPcdPjZDRPqMDHp', 121.00, 1, 0, 0, '2008-02-24 00:00:00', '2024-03-20 21:28:22'),
(7, 'Hollywood Film School: Filmmaking & TV Directing Masterclass', 'Learn How to Be a Working Hollywood Director, Take Your Filmmaking, Film School & Video Production to the Next Level.', 'Direct a short film, feature film or any narrative content.', 'Why You Must Shoot with a Moving Camera \\r\\n\nInternally Generated Camera Moves \\r\\n\nMoving Establishing Shots \\r\\n\nShowing Off by Showing the Camera Movement\\r\\n', 0, 'Gil Bettman', 'https://www.youtube.com/', 49.00, 1, 0, 0, '2009-03-24 00:00:00', '2024-03-18 17:06:09'),
(8, 'Aut magna aut debiti. Edite the data', 'Debitis cum et paria', '\"Voluptates reprehend\"', '\"Quia eligendi dolore\"', 0, 'Incidunt ipsum pro', 'Dolore tenetur quae ', 75.00, 1, 0, 0, '2024-03-11 10:41:44', '2024-03-18 17:06:16'),
(9, 'I am the new boss', 'Incididunt laudantiu', '\"Duis nihil aut provi\"', '\"In et voluptatem ali\"', 0, 'Voluptate sint accus', 'Voluptas porro sint ', 199.00, 1, 0, 0, '2024-03-18 16:31:14', '2024-03-18 17:06:23'),
(10, 'Nihil quae nulla mol', 'Dolores eum non veni', '\"Ab nihil veniam cup\"', '\"Beatae in minima pro\"', 1, 'Ipsum quisquam sunt', 'Officia vero suscipi', 213.00, -1, 0, 0, '2024-03-18 16:38:01', '2024-03-19 13:34:27'),
(11, 'Quia tenetur accusan', 'Dolorem similique vi', '\"In asperiores et cup\"', '\"Neque nisi aut facil\"', 0, 'Vel et id placeat ', 'Est in aliquam in t', 139.00, 1, 0, 0, '2024-03-18 16:38:57', '2024-03-18 17:06:38'),
(12, 'Officia in neque eos', 'Accusamus tempor dol', '\"Necessitatibus in au\"', '\"Autem similique est\"', 1, 'Cumque irure ipsa m', 'Mollitia impedit ul', 243.00, -1, 0, 0, '2024-03-18 16:40:19', '2024-03-19 13:34:25'),
(13, 'My new course', 'Quis voluptatibus im', '\"Consequatur Id dign\"', '\"Quo doloremque qui e\"', 1, 'Ad consequatur sed u', 'Ea laboriosam ut fu', 492.00, 1, 0, 0, '2024-03-19 13:34:19', '2024-03-19 13:34:19');

-- --------------------------------------------------------

--
-- Table structure for table `course_categories`
--

CREATE TABLE `course_categories` (
  `id` int(11) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `status` tinyint(4) NOT NULL,
  `created_at` timestamp NOT NULL,
  `updated_at` timestamp NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `course_contents`
--

CREATE TABLE `course_contents` (
  `id` int(11) NOT NULL,
  `course_id` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `course_content` text DEFAULT NULL,
  `duration` varchar(255) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `phone_no` varchar(50) DEFAULT NULL,
  `area_of_interests` text DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `user_id`, `full_name`, `phone_no`, `area_of_interests`, `status`, `created_at`, `updated_at`) VALUES
(1, 2, 'Hubert L Forrester', '+1 (994) 151-48311', NULL, 1, '2024-03-10 11:33:46', '2024-03-10 11:35:08'),
(3, 4, 'Richard A. King', '843-918-3922', NULL, 1, '2024-01-02 00:00:00', NULL),
(4, 5, 'Thomas S. Cobb', '913-310-0669', NULL, 1, '2024-01-05 00:00:00', NULL),
(5, 6, 'Mitch J. Albers', '305-979-1457', NULL, 1, '2024-02-10 00:00:00', NULL),
(6, 7, 'Joe E. Colvin', '815-787-2209', NULL, 1, '2024-03-02 00:00:00', NULL),
(7, 8, 'Ross R. Nolan', '435-683-2407', NULL, 1, '2024-03-05 00:00:00', NULL),
(8, 9, 'Rick M. Lawrence', '313-409-9295', NULL, 1, '2024-01-07 00:00:00', NULL),
(9, 10, 'Fred M. Govan', '530-827-9803', NULL, 1, '2024-02-13 00:00:00', NULL),
(10, 11, 'Jennifer M. Myrick', '775-789-5651', NULL, 1, '2024-01-25 00:00:00', NULL),
(11, 12, 'Winfred M. Godinez', '678-628-6634', NULL, 1, '2024-02-28 00:00:00', NULL),
(12, 13, 'Caryn R. Applin', '412-372-3738', NULL, 1, '2024-01-19 00:00:00', NULL),
(13, 14, 'Anton S. Govan', '818-682-4151', NULL, 1, '2024-02-14 00:00:00', NULL),
(14, 15, 'Samuel S. Scott', '908-360-0382', NULL, 1, '2024-01-30 00:00:00', NULL),
(15, 16, 'Helene R. Welch', '580-330-6230', NULL, 1, '2024-02-16 00:00:00', NULL),
(16, 17, 'Beth J. Capps', '816-797-9250', NULL, 1, '2024-01-09 00:00:00', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `enrollments`
--

CREATE TABLE `enrollments` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `course_id` int(11) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `payment_status` int(11) DEFAULT NULL,
  `enrollment_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP(),
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `enrollments`
--

INSERT INTO `enrollments` (`id`, `customer_id`, `course_id`, `status`, `payment_method`, `payment_status`, `enrollment_date`, `created_at`, `updated_at`) VALUES
(2, 2, 1, 1, 'Online', 1, '2024-03-10', '2024-03-10 13:49:04', '2024-03-10 13:49:04'),
(3, 4, 1, 1, 'Online', 1, '2024-03-10', '2024-03-10 14:53:05', '2024-03-10 14:53:05'),
(4, 4, 5, 1, 'Online', 1, '2024-03-10', '2024-03-10 14:53:32', '2024-03-10 14:53:32'),
(5, 5, 5, 1, 'Online', 1, '2024-03-10', '2024-03-10 14:53:47', '2024-03-10 14:53:47'),
(6, 5, 6, 1, 'Online', 1, '2024-03-10', '2024-03-10 14:53:57', '2024-03-10 14:53:57'),
(7, 7, 7, 1, 'Online', 1, '2024-03-10', '2024-03-10 14:54:18', '2024-03-10 14:54:18'),
(8, 7, 5, 1, 'Online', 1, '2024-03-10', '2024-03-10 14:54:22', '2024-03-10 14:54:22'),
(9, 2, 6, 1, 'card', 1, '2024-03-19', '2024-03-19 22:30:48', '2024-03-19 22:30:48'),
(10, 2, 8, 1, 'card', 1, '2024-03-19', '2024-03-19 22:31:52', '2024-03-19 22:31:52'),
(11, 2, 8, 1, 'card', 1, '2024-03-20', '2024-03-20 08:47:46', '2024-03-20 08:47:46'),
(12, 2, 8, 1, 'card', 1, '2024-03-20', '2024-03-20 10:05:51', '2024-03-20 10:05:51'),
(13, 2, 9, 1, 'card', 1, '2024-03-20', '2024-03-20 10:06:10', '2024-03-20 10:06:10'),
(14, 2, 9, 1, 'card', 1, '2024-03-20', '2024-03-20 10:06:44', '2024-03-20 10:06:44'),
(15, 2, 9, 1, 'card', 1, '2024-03-20', '2024-03-20 10:34:37', '2024-03-20 10:34:37'),
(16, 2, 9, 1, 'card', 1, '2024-03-20', '2024-03-20 10:35:00', '2024-03-20 10:35:00'),
(17, 2, 8, 1, 'card', 1, '2024-03-20', '2024-03-20 12:08:45', '2024-03-20 12:08:45'),
(18, 1, 9, 1, 'card', 1, '2024-03-20', '2024-03-20 12:14:16', '2024-03-20 12:14:16'),
(19, 2, 8, 1, 'card', 1, '2024-03-20', '2024-03-20 20:59:49', '2024-03-20 20:59:49');

-- --------------------------------------------------------

--
-- Table structure for table `securitylogs`
--

CREATE TABLE `securitylogs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `ip_address` varchar(100) DEFAULT NULL,
  `last_login` date DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email_id` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(50) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email_id`, `password`, `role`, `status`, `created_at`, `updated_at`) VALUES
(1, 'admin@studioghibli.com', '$2b$10$pvZr6491u3lU/sj/9O5HYuRLfNEPj3vgFJgoQByp4cpFyQY5H.PgS', 'admin', 1, '2024-03-10 11:31:23', '2024-03-10 11:31:23'),
(2, 'HubertLForrester@teleworm.us', '$2b$10$eDlfZmE6IhSsNMG6c9/0P./ThMl0jqJweJFq5QyL/n4qvCvOFpelm', 'customer', 1, '2024-03-10 11:33:46', '2024-03-10 11:33:46'),
(4, 'LauraWKing@dayrep.com', '$2b$10$eDlfZmE6IhSsNMG6c9/0P./ThMl0jqJweJFq5QyL/n4qvCvOFpelm', 'customer', 1, '2001-01-24 00:00:00', NULL),
(5, 'AndrewCArrington@dayrep.com', '$2b$10$eDlfZmE6IhSsNMG6c9/0P./ThMl0jqJweJFq5QyL/n4qvCvOFpelm', 'customer', 1, '2005-01-24 00:00:00', NULL),
(6, 'JanieLGoddard@dayrep.com', '$2b$10$eDlfZmE6IhSsNMG6c9/0P./ThMl0jqJweJFq5QyL/n4qvCvOFpelm', 'customer', 1, '2010-01-24 00:00:00', NULL),
(7, 'CindyPElmore@armyspy.com', '$2b$10$eDlfZmE6IhSsNMG6c9/0P./ThMl0jqJweJFq5QyL/n4qvCvOFpelm', 'customer', 1, '2015-01-24 00:00:00', NULL),
(8, 'EdnaRMorrison@armyspy.com', '$2b$10$eDlfZmE6IhSsNMG6c9/0P./ThMl0jqJweJFq5QyL/n4qvCvOFpelm', 'customer', 1, '2020-01-24 00:00:00', NULL),
(9, 'RobertJGolding@armyspy.com', '$2b$10$eDlfZmE6IhSsNMG6c9/0P./ThMl0jqJweJFq5QyL/n4qvCvOFpelm', 'customer', 1, '2025-01-24 00:00:00', NULL),
(10, 'HeatherJPaulson@teleworm.us', '$2b$10$eDlfZmE6IhSsNMG6c9/0P./ThMl0jqJweJFq5QyL/n4qvCvOFpelm', 'customer', 1, '2031-01-24 00:00:00', NULL),
(11, 'LaurenceRToney@dayrep.com', '$2b$10$eDlfZmE6IhSsNMG6c9/0P./ThMl0jqJweJFq5QyL/n4qvCvOFpelm', 'customer', 1, '2005-02-24 00:00:00', NULL),
(12, 'EduardoJFerry@jourrapide.com', '$2b$10$eDlfZmE6IhSsNMG6c9/0P./ThMl0jqJweJFq5QyL/n4qvCvOFpelm', 'customer', 1, '2010-02-24 00:00:00', NULL),
(13, 'AndreaJMorrell@armyspy.com', '$2b$10$eDlfZmE6IhSsNMG6c9/0P./ThMl0jqJweJFq5QyL/n4qvCvOFpelm', 'customer', 1, '2015-02-24 00:00:00', NULL),
(14, 'BarbaraRJohnson@armyspy.com', '$2b$10$eDlfZmE6IhSsNMG6c9/0P./ThMl0jqJweJFq5QyL/n4qvCvOFpelm', 'customer', 1, '2020-02-24 00:00:00', NULL),
(15, 'ArronARivers@jourrapide.com', '$2b$10$eDlfZmE6IhSsNMG6c9/0P./ThMl0jqJweJFq5QyL/n4qvCvOFpelm', 'customer', 1, '2025-02-24 00:00:00', NULL),
(16, 'KristenDCampbell@armyspy.com', '$2b$10$eDlfZmE6IhSsNMG6c9/0P./ThMl0jqJweJFq5QyL/n4qvCvOFpelm', 'customer', 1, '2005-03-24 00:00:00', NULL),
(17, 'WilliamVVanslyke@teleworm.us', '$2b$10$eDlfZmE6IhSsNMG6c9/0P./ThMl0jqJweJFq5QyL/n4qvCvOFpelm', 'customer', 1, '2007-03-24 00:00:00', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `course_categories`
--
ALTER TABLE `course_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `course_contents`
--
ALTER TABLE `course_contents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `securitylogs`
--
ALTER TABLE `securitylogs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `course_categories`
--
ALTER TABLE `course_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `course_contents`
--
ALTER TABLE `course_contents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `enrollments`
--
ALTER TABLE `enrollments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `securitylogs`
--
ALTER TABLE `securitylogs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `course_contents`
--
ALTER TABLE `course_contents`
  ADD CONSTRAINT `course_contents_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`);

--
-- Constraints for table `customers`
--
ALTER TABLE `customers`
  ADD CONSTRAINT `customers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `securitylogs`
--
ALTER TABLE `securitylogs`
  ADD CONSTRAINT `securitylogs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
