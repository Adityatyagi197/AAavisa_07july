-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 10, 2026 at 12:51 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `consultancy`
--

-- --------------------------------------------------------

--
-- Table structure for table `application_cycles`
--

CREATE TABLE `application_cycles` (
  `id` varchar(191) NOT NULL,
  `clientId` varchar(191) NOT NULL,
  `originalSubmissionDate` datetime(3) DEFAULT NULL,
  `refusalDate` datetime(3) DEFAULT NULL,
  `refusalReason` text DEFAULT NULL,
  `resubmissionDate` datetime(3) DEFAULT NULL,
  `lawyerAssigned` varchar(191) DEFAULT NULL,
  `appealDeadline` datetime(3) DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'Resubmission in Progress',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `serviceType` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `id` varchar(191) NOT NULL,
  `applicationId` varchar(191) NOT NULL,
  `actorId` varchar(191) NOT NULL,
  `action` varchar(191) NOT NULL,
  `previousState` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`previousState`)),
  `newState` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`newState`)),
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `clients`
--

CREATE TABLE `clients` (
  `id` varchar(191) NOT NULL,
  `firstName` varchar(191) NOT NULL,
  `lastName` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `phone` varchar(191) NOT NULL,
  `nationality` varchar(191) DEFAULT NULL,
  `countryOfResidence` varchar(191) DEFAULT NULL,
  `preferredLanguage` varchar(191) DEFAULT 'English',
  `serviceType` varchar(191) DEFAULT NULL,
  `packageId` varchar(191) DEFAULT NULL,
  `applicantsCount` varchar(191) DEFAULT 'Main Only',
  `status` varchar(191) NOT NULL DEFAULT 'Waiting for Payment',
  `visaStatus` varchar(191) NOT NULL DEFAULT 'Not Started',
  `documentUploadAllowed` tinyint(1) NOT NULL DEFAULT 0,
  `profileSummary` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `assignedToId` varchar(191) DEFAULT NULL,
  `password` varchar(191) DEFAULT NULL,
  `isTemporaryPassword` tinyint(1) NOT NULL DEFAULT 1,
  `deviceFingerprint` varchar(191) DEFAULT NULL,
  `isBlocked` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `clients`
--

INSERT INTO `clients` (`id`, `firstName`, `lastName`, `email`, `phone`, `nationality`, `countryOfResidence`, `preferredLanguage`, `serviceType`, `packageId`, `applicantsCount`, `status`, `visaStatus`, `documentUploadAllowed`, `profileSummary`, `createdAt`, `updatedAt`, `assignedToId`, `password`, `isTemporaryPassword`, `deviceFingerprint`, `isBlocked`) VALUES
('7712dfcd-5901-4f70-a986-c2816ad29867', 'sf', 'sdg', 'sdfsd@gmail.com', '1532412364', 'American', NULL, 'English', 'dnv', NULL, 'Main Only', 'Waiting for Payment', 'Not Started', 0, NULL, '2026-07-09 12:40:42.301', '2026-07-09 12:40:42.301', NULL, NULL, 1, NULL, 0),
('7ba12992-fc66-47e5-b305-dc800da5593f', 'shree', 'sharma', 'shree@gmail', '2328846651', '', NULL, 'English', NULL, 'full_process', '1', 'Waiting for Payment', 'Not Started', 0, 'shree migrated from Lead. Wants null processing.', '2026-07-09 13:39:00.732', '2026-07-09 13:39:00.732', 'e81233e7-7166-45d3-9d3a-aa28eba58ae7', NULL, 1, NULL, 0),
('c77a598e-d2c0-491f-8713-d24f823a1b75', 'radhee', 'lal', 'ra@gmail.com', '2353241132', 'Afghan', NULL, 'English', 'dnv', 'full_process', '2', 'Waiting for Payment', 'Not Started', 0, 'radhee migrated from Lead. Wants dnv processing.', '2026-07-09 12:34:26.911', '2026-07-09 13:11:39.724', '84a4611a-395a-4534-ab40-1a71ae3f5ad2', NULL, 1, NULL, 0),
('CL2001', 'Elena', 'Petrova', 'elena@aaaconsultancy.com', '+971500000001', NULL, NULL, 'English', NULL, 'full_process', 'Main Only', 'Payment Received', 'Document Preparation', 1, NULL, '2026-07-10 07:28:06.684', '2026-07-10 09:03:01.767', NULL, '$2b$10$EEAsYjG0gBGoncn3LkuGX.ZZ4MvC65YxMrFKeP.VZ7sA4PC.0Ek0a', 0, NULL, 0),
('CL2002', 'Chloe', 'Dupont', 'chloe@aaaconsultancy.com', '+971500000002', NULL, NULL, 'English', NULL, NULL, 'Main Only', 'Under Process', 'Under Process', 0, NULL, '2026-07-10 07:28:06.698', '2026-07-10 07:28:06.698', NULL, '$2b$10$EEAsYjG0gBGoncn3LkuGX.ZZ4MvC65YxMrFKeP.VZ7sA4PC.0Ek0a', 0, NULL, 0),
('fca399f8-d8c7-4a4b-afe6-f5f68b77f304', 'test', 'client', 'testclient@gmail.com', '123456789', 'British', NULL, 'English', NULL, NULL, 'Main Only', 'Waiting for Payment', 'Not Started', 0, NULL, '2026-07-04 05:22:42.301', '2026-07-04 05:25:55.711', NULL, '$2b$10$sAi/wRa4HoKzi231iAzEHe1vdYl.7x8GupNamE1sIZsW3m6MeHbt6', 1, NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `communication_logs`
--

CREATE TABLE `communication_logs` (
  `id` varchar(191) NOT NULL,
  `clientId` varchar(191) NOT NULL,
  `channel` varchar(191) NOT NULL,
  `direction` varchar(191) NOT NULL,
  `messageId` varchar(191) DEFAULT NULL,
  `externalProviderId` varchar(191) DEFAULT NULL,
  `deliveryStatus` varchar(191) NOT NULL,
  `readStatus` tinyint(1) NOT NULL DEFAULT 0,
  `failureReason` text DEFAULT NULL,
  `content` text NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `company_settings`
--

CREATE TABLE `company_settings` (
  `id` varchar(191) NOT NULL,
  `companyName` varchar(191) NOT NULL DEFAULT 'AAA Business Consultancy LLC',
  `phone` varchar(191) NOT NULL DEFAULT '+971 50 955 4142',
  `email` varchar(191) NOT NULL DEFAULT 'info@aaabusinessconsultancy.com',
  `address` varchar(191) NOT NULL DEFAULT 'Business Village, Block B, 4th Floor, Office F09, Deira, Dubai, UAE',
  `vatRate` double NOT NULL DEFAULT 5,
  `vatId` varchar(191) NOT NULL DEFAULT 'VAT-AE-2026-9932',
  `website` varchar(191) NOT NULL DEFAULT 'https://aaabusinessconsultancy.com',
  `incorporationDate` varchar(191) NOT NULL DEFAULT '2018-05-12',
  `autoAssignConsultant` tinyint(1) NOT NULL DEFAULT 1,
  `recordingStorage` varchar(191) NOT NULL DEFAULT 'cloud',
  `swornTranslationRates` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`swornTranslationRates`)),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `company_settings`
--

INSERT INTO `company_settings` (`id`, `companyName`, `phone`, `email`, `address`, `vatRate`, `vatId`, `website`, `incorporationDate`, `autoAssignConsultant`, `recordingStorage`, `swornTranslationRates`, `updatedAt`) VALUES
('564aa112-6df0-4bb9-9bb0-e9566329d779', 'AAA Business Consultancy LLC', '+971 50 955 4142', 'info@aaabusinessconsultancy.com', 'Business Village, Block B, 4th Floor, Office F09, Deira, Dubai, UAE', 5, 'VAT-AE-2026-9932', 'https://aaabusinessconsultancy.com', '2018-05-12', 1, 'cloud', NULL, '2026-07-10 07:30:57.862');

-- --------------------------------------------------------

--
-- Table structure for table `consultations`
--

CREATE TABLE `consultations` (
  `id` varchar(191) NOT NULL,
  `date` varchar(191) NOT NULL,
  `timeSlot` varchar(191) NOT NULL,
  `durationMinutes` int(11) NOT NULL DEFAULT 20,
  `meetingLink` varchar(191) DEFAULT NULL,
  `recordingUrl` varchar(191) DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'Scheduled',
  `eligibility` varchar(191) DEFAULT NULL,
  `recommendedService` varchar(191) DEFAULT NULL,
  `recommendedPackageId` varchar(191) DEFAULT NULL,
  `internalNotes` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `leadId` varchar(191) DEFAULT NULL,
  `consultantId` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `consultations`
--

INSERT INTO `consultations` (`id`, `date`, `timeSlot`, `durationMinutes`, `meetingLink`, `recordingUrl`, `status`, `eligibility`, `recommendedService`, `recommendedPackageId`, `internalNotes`, `createdAt`, `updatedAt`, `leadId`, `consultantId`) VALUES
('3335da6f-a5d1-4ad5-8237-3940099016ee', '', 'TBD', 30, 'https://zoom.us/j/376554798', NULL, 'Pending Acceptance', NULL, NULL, NULL, NULL, '2026-07-09 10:39:25.378', '2026-07-09 10:39:29.700', '5957b406-d57a-4b15-a7a9-cd6e3315df9a', 'e81233e7-7166-45d3-9d3a-aa28eba58ae7'),
('46318b27-3a75-480e-aabb-9e02eb540158', '2026-07-12', 'morning', 30, NULL, NULL, 'Cancelled', NULL, NULL, NULL, '', '2026-07-09 11:40:37.881', '2026-07-09 12:04:03.179', '9b0e6f30-c359-435c-ae01-791d4d882479', '84a4611a-395a-4534-ab40-1a71ae3f5ad2'),
('61da3501-00cb-4f27-8c9b-db43541a94f3', '2026-07-14', 'morning', 30, NULL, NULL, 'Completed', '{\"clientRequestedService\":\"Digital Nomad Visa (DNV)\",\"aaaRecommendedService\":\"Digital Nomad Visa (DNV)\"}', NULL, NULL, '', '2026-07-09 13:37:52.460', '2026-07-09 13:38:24.647', '0accf7d2-5f14-499a-83ea-d5c51e3cf868', 'e81233e7-7166-45d3-9d3a-aa28eba58ae7'),
('94ed20c7-7e5f-48bf-8085-b32c48d48fa8', '2026-07-20', 'Morning', 30, NULL, NULL, 'Scheduled', NULL, NULL, NULL, 'I want to know about Digital Nomad Visa process and requirements.', '2026-07-09 11:28:39.572', '2026-07-09 12:12:51.697', '238886b6-3632-4fa3-b6e6-27413cca393c', '84a4611a-395a-4534-ab40-1a71ae3f5ad2'),
('a23fce37-9b21-4c99-946c-92eb6cf5c55b', '2026-07-20', 'morning', 30, NULL, NULL, 'Completed', '{\"clientRequestedService\":\"Digital Nomad Visa (DNV)\",\"aaaRecommendedService\":\"Digital Nomad Visa (DNV)\"}', NULL, NULL, 'wkhksjlklkz', '2026-07-09 11:40:37.909', '2026-07-09 12:29:23.998', 'dabd6864-5f07-43b1-a62f-dde5759bf7e2', '84a4611a-395a-4534-ab40-1a71ae3f5ad2'),
('fd0b1c49-b4e8-4ed1-857a-245bcb3364f9', '', 'TBD', 30, 'https://zoom.us/j/218104549', NULL, 'Pending Acceptance', NULL, NULL, NULL, NULL, '2026-07-09 09:55:00.545', '2026-07-09 10:06:54.789', '3b769035-206a-4f30-9ff9-05d679661e59', 'c01fa286-8bad-45e0-aa50-46cfe96526bd');

-- --------------------------------------------------------

--
-- Table structure for table `documents`
--

CREATE TABLE `documents` (
  `id` varchar(191) NOT NULL,
  `clientId` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `category` varchar(191) NOT NULL,
  `url` varchar(191) NOT NULL,
  `size` varchar(191) DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'Pending Verification',
  `comment` text DEFAULT NULL,
  `uploadedDate` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `applicationId` varchar(191) DEFAULT NULL,
  `belongsTo` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `documents`
--

INSERT INTO `documents` (`id`, `clientId`, `name`, `category`, `url`, `size`, `status`, `comment`, `uploadedDate`, `updatedAt`, `applicationId`, `belongsTo`) VALUES
('c9c1deef-ef89-4b0b-8782-6f63706db51c', 'CL2001', 'Legal Policies for Meta API Approval (AAA Business Consultancy).pdf', 'Others', '/uploads/1783675385799-Legal Policies for Meta API Approval (AAA Business Consultancy).pdf', '0.06 MB', 'Pending Verification', NULL, '2026-07-10 09:23:05.822', '2026-07-10 09:23:05.822', NULL, 'Main Applicant');

-- --------------------------------------------------------

--
-- Table structure for table `leads`
--

CREATE TABLE `leads` (
  `id` varchar(191) NOT NULL,
  `firstName` varchar(191) NOT NULL,
  `lastName` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `phone` varchar(191) NOT NULL,
  `nationality` varchar(191) DEFAULT NULL,
  `countryOfResidence` varchar(191) DEFAULT NULL,
  `preferredLanguage` varchar(191) DEFAULT 'English',
  `serviceType` varchar(191) DEFAULT NULL,
  `applicantsCount` varchar(191) DEFAULT 'Main Only',
  `source` varchar(191) DEFAULT NULL,
  `campaignId` varchar(191) DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'New Lead',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `assignedToId` varchar(191) DEFAULT NULL,
  `clientId` varchar(191) DEFAULT NULL,
  `formSubmittedAt` datetime(3) DEFAULT NULL,
  `meetingNotes` text DEFAULT NULL,
  `meetingPreferredDate` varchar(191) DEFAULT NULL,
  `meetingPreferredLanguage` varchar(191) DEFAULT NULL,
  `meetingPreferredTime` varchar(191) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `qualificationData` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`qualificationData`)),
  `timeline` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`timeline`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `leads`
--

INSERT INTO `leads` (`id`, `firstName`, `lastName`, `email`, `phone`, `nationality`, `countryOfResidence`, `preferredLanguage`, `serviceType`, `applicantsCount`, `source`, `campaignId`, `status`, `createdAt`, `updatedAt`, `assignedToId`, `clientId`, `formSubmittedAt`, `meetingNotes`, `meetingPreferredDate`, `meetingPreferredLanguage`, `meetingPreferredTime`, `notes`, `qualificationData`, `timeline`) VALUES
('0accf7d2-5f14-499a-83ea-d5c51e3cf868', 'shree', 'sharma', 'shree@gmail', '2328846651', '', NULL, 'English', NULL, 'Main Only', 'Facebook Ads', NULL, 'Completed', '2026-07-04 09:40:23.138', '2026-07-09 13:39:00.831', 'e81233e7-7166-45d3-9d3a-aa28eba58ae7', '7ba12992-fc66-47e5-b305-dc800da5593f', '2026-07-09 13:37:52.401', '', '2026-07-14', 'English', 'morning', NULL, NULL, NULL),
('238886b6-3632-4fa3-b6e6-27413cca393c', 'Avinash', 'Thakur', 'avnish@gmail.com', '+91 9876543210', 'Indian', NULL, 'English', 'dnv', '1', 'Google Ads', NULL, 'Form Submitted', '2026-07-09 06:22:59.284', '2026-07-09 12:24:58.688', '84a4611a-395a-4534-ab40-1a71ae3f5ad2', NULL, '2026-07-09 10:16:45.843', 'I want to know about Digital Nomad Visa process and requirements.', '2026-07-15', 'English', 'Evening', NULL, NULL, NULL),
('3b769035-206a-4f30-9ff9-05d679661e59', 'hamza ali ', 'mazari', 'hamza@gmail.com', '1234567890', 'Albanian', NULL, 'English', 'dnv', '1', 'Google Ads', NULL, 'Waiting for Payment', '2026-07-09 07:40:13.969', '2026-07-09 10:07:23.469', 'c01fa286-8bad-45e0-aa50-46cfe96526bd', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('5957b406-d57a-4b15-a7a9-cd6e3315df9a', 'sf', 'sdg', 'sdfsd@gmail.com', '1532412364', 'American', NULL, 'English', 'dnv', '1', 'Google Ads', NULL, 'New Lead', '2026-07-09 10:36:57.888', '2026-07-09 12:53:37.688', 'e81233e7-7166-45d3-9d3a-aa28eba58ae7', NULL, '2026-07-09 10:53:30.940', '', '2026-07-14', 'English', 'morning', NULL, NULL, NULL),
('66dd31e4-ee1a-4d1f-9e64-5a0c667b0e04', 'akljfks', 'asfasf', 'su@aaaconsultancy.com', '2864782648', 'Albanian', NULL, 'English', 'dnv', '1', 'Google Ads', NULL, 'Hot Lead', '2026-07-09 12:58:57.461', '2026-07-09 13:00:53.208', '84a4611a-395a-4534-ab40-1a71ae3f5ad2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('8242449f-9b5e-4d17-8ac8-02cb2a564bf6', 'satish ', 'bhagat', 'sat@gmail.com', '987654321', 'india', NULL, 'English', 'dnv', '1', 'Google Ads', NULL, 'New Lead', '2026-07-04 10:05:51.585', '2026-07-04 10:05:51.585', 'e81233e7-7166-45d3-9d3a-aa28eba58ae7', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('9b0e6f30-c359-435c-ae01-791d4d882479', 'kushall ', 'sir ', 'kush@gmail.com', '2765372761', 'Indian', NULL, 'English', 'dnv', '1', 'Google Ads', NULL, 'Form Submitted', '2026-07-09 11:09:35.052', '2026-07-09 11:11:23.128', '84a4611a-395a-4534-ab40-1a71ae3f5ad2', NULL, '2026-07-09 11:11:23.125', '', '2026-07-12', 'English', 'morning', NULL, NULL, NULL),
('dabd6864-5f07-43b1-a62f-dde5759bf7e2', 'radhee', 'lal', 'ra@gmail.com', '2353241132', 'Afghan', NULL, 'English', 'dnv', '2', 'Google Ads', NULL, 'Completed', '2026-07-09 10:35:08.134', '2026-07-09 13:11:39.921', '84a4611a-395a-4534-ab40-1a71ae3f5ad2', 'c77a598e-d2c0-491f-8713-d24f823a1b75', '2026-07-09 10:57:07.639', '', '2026-07-20', 'English', 'morning', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `type` varchar(191) NOT NULL DEFAULT 'new_document',
  `title` varchar(191) NOT NULL,
  `body` text NOT NULL,
  `clientId` varchar(191) DEFAULT NULL,
  `documentId` varchar(191) DEFAULT NULL,
  `isRead` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` varchar(191) NOT NULL,
  `clientId` varchar(191) NOT NULL,
  `amount` double NOT NULL,
  `discount` double NOT NULL DEFAULT 0,
  `totalPaid` double NOT NULL DEFAULT 0,
  `status` varchar(191) NOT NULL DEFAULT 'Pending',
  `paymentMethod` varchar(191) DEFAULT NULL,
  `transactionId` varchar(191) DEFAULT NULL,
  `billingDate` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `dueDate` datetime(3) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `applicationId` varchar(191) DEFAULT NULL,
  `gatewayId` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `clientId`, `amount`, `discount`, `totalPaid`, `status`, `paymentMethod`, `transactionId`, `billingDate`, `dueDate`, `createdAt`, `updatedAt`, `applicationId`, `gatewayId`) VALUES
('2e2628d1-f679-4a28-94c5-a2fda5a3d687', 'c77a598e-d2c0-491f-8713-d24f823a1b75', 2200, 750, 0, 'Pending', NULL, NULL, '2026-07-09 13:11:10.672', '2026-07-23 13:11:10.669', '2026-07-09 13:11:10.672', '2026-07-09 13:11:10.672', NULL, NULL),
('8b9f68af-ef6f-4f86-9af3-9b0ed19aa54c', 'c77a598e-d2c0-491f-8713-d24f823a1b75', 2000, 0, 0, 'Pending', NULL, NULL, '2026-07-09 13:11:39.855', '2026-07-23 13:11:39.852', '2026-07-09 13:11:39.855', '2026-07-09 13:11:39.855', NULL, NULL),
('8f37fbed-87ee-4bf2-9f6f-dae1ffa5ffa5', '7ba12992-fc66-47e5-b305-dc800da5593f', 1500, 0, 0, 'Pending', NULL, NULL, '2026-07-09 13:39:00.815', '2026-07-23 13:39:00.813', '2026-07-09 13:39:00.815', '2026-07-09 13:39:00.815', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `refund_requests`
--

CREATE TABLE `refund_requests` (
  `id` varchar(191) NOT NULL,
  `clientId` varchar(191) NOT NULL,
  `category` varchar(191) NOT NULL,
  `reason` text DEFAULT NULL,
  `amount` double NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'Pending Review',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `relocation_packages`
--

CREATE TABLE `relocation_packages` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` text NOT NULL,
  `price` double NOT NULL,
  `includes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`includes`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `templates`
--

CREATE TABLE `templates` (
  `id` varchar(191) NOT NULL,
  `type` varchar(191) NOT NULL,
  `subject` varchar(191) DEFAULT NULL,
  `body` text NOT NULL,
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(191) NOT NULL,
  `fullName` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `hotlineNumber` varchar(191) DEFAULT NULL,
  `role` varchar(191) NOT NULL DEFAULT 'consultant',
  `spokenLanguages` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`spokenLanguages`)),
  `nationalities` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`nationalities`)),
  `commissionRate` double DEFAULT 0,
  `immigrationBio` text DEFAULT NULL,
  `customPermissions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`customPermissions`)),
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `commissionPaid` double DEFAULT 0,
  `commissionType` varchar(191) DEFAULT '10%',
  `createdById` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `fullName`, `email`, `password`, `hotlineNumber`, `role`, `spokenLanguages`, `nationalities`, `commissionRate`, `immigrationBio`, `customPermissions`, `createdAt`, `updatedAt`, `commissionPaid`, `commissionType`, `createdById`) VALUES
('51caeca7-057b-41b1-926d-a6d5ab010a73', 'Finance User', 'finance@aaaconsultancy.com', '$2b$10$EEAsYjG0gBGoncn3LkuGX.ZZ4MvC65YxMrFKeP.VZ7sA4PC.0Ek0a', NULL, 'finance', NULL, NULL, 0, NULL, NULL, '2026-07-04 03:52:29.074', '2026-07-10 07:28:06.659', 0, '10%', NULL),
('597a1a11-6115-4d73-84da-42bcb47c4dd8', 'test1', 'test@gmail.com', '$2b$10$0Lh02TkoowCOLM/ugbyfNeqayIk.I46JxoNXiw9Ysi3iy2dig7Zhy', '1234', 'admin', '[\"English\"]', '[\"British\"]', 10, 'hgjk', '{\"enabled\":false,\"menus\":[],\"cards\":[],\"canManageOverrides\":false}', '2026-07-03 12:34:03.652', '2026-07-03 12:38:48.228', 0, '10%', NULL),
('664df84f-2f6f-49e9-9f4c-46b5e7e51ed0', 'Operations User', 'operations@aaaconsultancy.com', '$2b$10$EEAsYjG0gBGoncn3LkuGX.ZZ4MvC65YxMrFKeP.VZ7sA4PC.0Ek0a', NULL, 'operations', NULL, NULL, 0, NULL, NULL, '2026-07-04 03:52:29.291', '2026-07-10 07:28:06.668', 0, '10%', NULL),
('754b8223-1298-4ae7-b73b-ecb201625cd8', 'Marketing User', 'marketing@aaaconsultancy.com', '$2b$10$EEAsYjG0gBGoncn3LkuGX.ZZ4MvC65YxMrFKeP.VZ7sA4PC.0Ek0a', NULL, 'marketing', NULL, NULL, 0, NULL, NULL, '2026-07-04 03:52:29.506', '2026-07-10 07:28:06.675', 0, '10%', NULL),
('8438c74c-cc9f-4aa3-bd29-3cfd029e7bf3', 'Admin User', 'admin@aaaconsultancy.com', '$2b$10$EEAsYjG0gBGoncn3LkuGX.ZZ4MvC65YxMrFKeP.VZ7sA4PC.0Ek0a', NULL, 'admin', NULL, NULL, 0, NULL, NULL, '2026-07-04 03:52:27.818', '2026-07-10 07:28:06.641', 0, '10%', NULL),
('84a4611a-395a-4534-ab40-1a71ae3f5ad2', 'Tiger ', 'tiger@gmail.com', '$2b$10$Iaruti.l6OTyTEwKS5HtPeUbsVCbwUhNaRWNj99k9bKGoTWaVG.wG', '12', 'consultant', '[\"English\"]', '[\"British\"]', 10, '', '{\"enabled\":false,\"menus\":[],\"cards\":[],\"canManageOverrides\":false}', '2026-07-09 07:38:48.252', '2026-07-09 10:58:55.445', 0, '10%', '85419ace-6141-4c99-addc-267bb29b188a'),
('85419ace-6141-4c99-addc-267bb29b188a', 'John SuperAdmin', 'superadmin@aaaconsultancy.com', '$2b$10$EEAsYjG0gBGoncn3LkuGX.ZZ4MvC65YxMrFKeP.VZ7sA4PC.0Ek0a', NULL, 'super_admin', NULL, NULL, 0, NULL, NULL, '2026-07-03 11:19:05.913', '2026-07-10 07:28:06.601', 0, '10%', NULL),
('c01fa286-8bad-45e0-aa50-46cfe96526bd', 'test2', 'test2@gmail.com', '$2b$10$lOsaaWJPltuakh1Q9fDpbuQ/m/AkQonIc23KjB8/ThVq2BKthOREO', '1234', 'finance', '[\"English\"]', '[\"British\"]', 10, '', '{\"enabled\":false,\"menus\":[],\"cards\":[]}', '2026-07-04 05:21:42.344', '2026-07-04 05:21:42.344', 0, '10%', NULL),
('e2d88f50-5f1c-4b65-a0c8-02d78bc54bc5', 'rajesh', 'raj@gmail.com', '$2b$10$EVfh0w/zNNzzTQzX5d3cE.0woUyPzyJsm.dUHNyjR/i1CK9oZf7nu', '1234567890', 'admin', '[\"english\"]', '[\"british\"]', 12, '', '{\"enabled\":false,\"menus\":[],\"cards\":[],\"canManageOverrides\":false}', '2026-07-04 10:03:40.970', '2026-07-04 10:04:34.998', 0, '10%', NULL),
('e81233e7-7166-45d3-9d3a-aa28eba58ae7', 'Agent User', 'agent@aaaconsultancy.com', '$2b$10$EEAsYjG0gBGoncn3LkuGX.ZZ4MvC65YxMrFKeP.VZ7sA4PC.0Ek0a', NULL, 'consultant', NULL, NULL, 0, NULL, NULL, '2026-07-04 03:52:28.992', '2026-07-10 07:28:06.650', 0, '10%', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `visa_services`
--

CREATE TABLE `visa_services` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `category` varchar(191) NOT NULL,
  `basePrice` double NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `application_cycles`
--
ALTER TABLE `application_cycles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `application_cycles_clientId_fkey` (`clientId`);

--
-- Indexes for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `audit_logs_applicationId_fkey` (`applicationId`);

--
-- Indexes for table `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `clients_email_key` (`email`),
  ADD KEY `clients_assignedToId_fkey` (`assignedToId`);

--
-- Indexes for table `communication_logs`
--
ALTER TABLE `communication_logs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `communication_logs_messageId_key` (`messageId`),
  ADD KEY `communication_logs_clientId_fkey` (`clientId`);

--
-- Indexes for table `company_settings`
--
ALTER TABLE `company_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `consultations`
--
ALTER TABLE `consultations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `consultations_leadId_fkey` (`leadId`),
  ADD KEY `consultations_consultantId_fkey` (`consultantId`);

--
-- Indexes for table `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `documents_clientId_fkey` (`clientId`),
  ADD KEY `documents_applicationId_fkey` (`applicationId`);

--
-- Indexes for table `leads`
--
ALTER TABLE `leads`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `leads_clientId_key` (`clientId`),
  ADD KEY `leads_assignedToId_fkey` (`assignedToId`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payments_clientId_fkey` (`clientId`),
  ADD KEY `payments_applicationId_fkey` (`applicationId`);

--
-- Indexes for table `refund_requests`
--
ALTER TABLE `refund_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `refund_requests_clientId_fkey` (`clientId`);

--
-- Indexes for table `relocation_packages`
--
ALTER TABLE `relocation_packages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `templates`
--
ALTER TABLE `templates`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_key` (`email`),
  ADD KEY `users_createdById_fkey` (`createdById`);

--
-- Indexes for table `visa_services`
--
ALTER TABLE `visa_services`
  ADD PRIMARY KEY (`id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `application_cycles`
--
ALTER TABLE `application_cycles`
  ADD CONSTRAINT `application_cycles_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `clients` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD CONSTRAINT `audit_logs_applicationId_fkey` FOREIGN KEY (`applicationId`) REFERENCES `application_cycles` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `clients`
--
ALTER TABLE `clients`
  ADD CONSTRAINT `clients_assignedToId_fkey` FOREIGN KEY (`assignedToId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `communication_logs`
--
ALTER TABLE `communication_logs`
  ADD CONSTRAINT `communication_logs_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `clients` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `consultations`
--
ALTER TABLE `consultations`
  ADD CONSTRAINT `consultations_consultantId_fkey` FOREIGN KEY (`consultantId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `consultations_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `leads` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `documents`
--
ALTER TABLE `documents`
  ADD CONSTRAINT `documents_applicationId_fkey` FOREIGN KEY (`applicationId`) REFERENCES `application_cycles` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `documents_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `clients` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `leads`
--
ALTER TABLE `leads`
  ADD CONSTRAINT `leads_assignedToId_fkey` FOREIGN KEY (`assignedToId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `leads_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `clients` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_applicationId_fkey` FOREIGN KEY (`applicationId`) REFERENCES `application_cycles` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `payments_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `clients` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `refund_requests`
--
ALTER TABLE `refund_requests`
  ADD CONSTRAINT `refund_requests_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `clients` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
