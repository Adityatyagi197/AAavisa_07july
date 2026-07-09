-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: consultancy
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `application_cycles`
--

DROP TABLE IF EXISTS `application_cycles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
  PRIMARY KEY (`id`),
  KEY `application_cycles_clientId_fkey` (`clientId`),
  CONSTRAINT `application_cycles_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `clients` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `application_cycles`
--

LOCK TABLES `application_cycles` WRITE;
/*!40000 ALTER TABLE `application_cycles` DISABLE KEYS */;
/*!40000 ALTER TABLE `application_cycles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
  PRIMARY KEY (`id`),
  UNIQUE KEY `clients_email_key` (`email`),
  KEY `clients_assignedToId_fkey` (`assignedToId`),
  CONSTRAINT `clients_assignedToId_fkey` FOREIGN KEY (`assignedToId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
INSERT INTO `clients` VALUES ('fca399f8-d8c7-4a4b-afe6-f5f68b77f304','test','client','testclient@gmail.com','123456789','British',NULL,'English',NULL,NULL,'Main Only','Waiting for Payment','Not Started',0,NULL,'2026-07-04 05:22:42.301','2026-07-04 05:25:55.711',NULL,'$2b$10$sAi/wRa4HoKzi231iAzEHe1vdYl.7x8GupNamE1sIZsW3m6MeHbt6',1);
/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company_settings`
--

DROP TABLE IF EXISTS `company_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company_settings`
--

LOCK TABLES `company_settings` WRITE;
/*!40000 ALTER TABLE `company_settings` DISABLE KEYS */;
/*!40000 ALTER TABLE `company_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `consultations`
--

DROP TABLE IF EXISTS `consultations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
  `consultantId` varchar(191) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `consultations_leadId_fkey` (`leadId`),
  KEY `consultations_consultantId_fkey` (`consultantId`),
  CONSTRAINT `consultations_consultantId_fkey` FOREIGN KEY (`consultantId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `consultations_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `leads` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `consultations`
--

LOCK TABLES `consultations` WRITE;
/*!40000 ALTER TABLE `consultations` DISABLE KEYS */;
/*!40000 ALTER TABLE `consultations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documents`
--

DROP TABLE IF EXISTS `documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
  PRIMARY KEY (`id`),
  KEY `documents_clientId_fkey` (`clientId`),
  CONSTRAINT `documents_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `clients` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documents`
--

LOCK TABLES `documents` WRITE;
/*!40000 ALTER TABLE `documents` DISABLE KEYS */;
/*!40000 ALTER TABLE `documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leads`
--

DROP TABLE IF EXISTS `leads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
  PRIMARY KEY (`id`),
  UNIQUE KEY `leads_clientId_key` (`clientId`),
  KEY `leads_assignedToId_fkey` (`assignedToId`),
  CONSTRAINT `leads_assignedToId_fkey` FOREIGN KEY (`assignedToId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `leads_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `clients` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leads`
--

LOCK TABLES `leads` WRITE;
/*!40000 ALTER TABLE `leads` DISABLE KEYS */;
/*!40000 ALTER TABLE `leads` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
  PRIMARY KEY (`id`),
  KEY `payments_clientId_fkey` (`clientId`),
  CONSTRAINT `payments_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `clients` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refund_requests`
--

DROP TABLE IF EXISTS `refund_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `refund_requests` (
  `id` varchar(191) NOT NULL,
  `clientId` varchar(191) NOT NULL,
  `category` varchar(191) NOT NULL,
  `reason` text DEFAULT NULL,
  `amount` double NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'Pending Review',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `refund_requests_clientId_fkey` (`clientId`),
  CONSTRAINT `refund_requests_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `clients` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refund_requests`
--

LOCK TABLES `refund_requests` WRITE;
/*!40000 ALTER TABLE `refund_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `refund_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `relocation_packages`
--

DROP TABLE IF EXISTS `relocation_packages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `relocation_packages` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` text NOT NULL,
  `price` double NOT NULL,
  `includes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`includes`)),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `relocation_packages`
--

LOCK TABLES `relocation_packages` WRITE;
/*!40000 ALTER TABLE `relocation_packages` DISABLE KEYS */;
/*!40000 ALTER TABLE `relocation_packages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `templates`
--

DROP TABLE IF EXISTS `templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `templates` (
  `id` varchar(191) NOT NULL,
  `type` varchar(191) NOT NULL,
  `subject` varchar(191) DEFAULT NULL,
  `body` text NOT NULL,
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `templates`
--

LOCK TABLES `templates` WRITE;
/*!40000 ALTER TABLE `templates` DISABLE KEYS */;
/*!40000 ALTER TABLE `templates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('51caeca7-057b-41b1-926d-a6d5ab010a73','Finance User','finance@aaaconsultancy.com','$2b$10$iIDusvPHLk7V4dqgcrW2JuzHsm7iGVa0FQ671zhX2becnEWyObPd2',NULL,'finance',NULL,NULL,0,NULL,NULL,'2026-07-04 03:52:29.074','2026-07-04 03:52:29.074',0,'10%'),('597a1a11-6115-4d73-84da-42bcb47c4dd8','test1','test@gmail.com','$2b$10$0Lh02TkoowCOLM/ugbyfNeqayIk.I46JxoNXiw9Ysi3iy2dig7Zhy','1234','admin','[\"English\"]','[\"British\"]',10,'hgjk','{\"enabled\":false,\"menus\":[],\"cards\":[],\"canManageOverrides\":false}','2026-07-03 12:34:03.652','2026-07-03 12:38:48.228',0,'10%'),('664df84f-2f6f-49e9-9f4c-46b5e7e51ed0','Operations User','operations@aaaconsultancy.com','$2b$10$iIDusvPHLk7V4dqgcrW2JuzHsm7iGVa0FQ671zhX2becnEWyObPd2',NULL,'operations',NULL,NULL,0,NULL,NULL,'2026-07-04 03:52:29.291','2026-07-04 03:52:29.291',0,'10%'),('754b8223-1298-4ae7-b73b-ecb201625cd8','Marketing User','marketing@aaaconsultancy.com','$2b$10$iIDusvPHLk7V4dqgcrW2JuzHsm7iGVa0FQ671zhX2becnEWyObPd2',NULL,'marketing',NULL,NULL,0,NULL,NULL,'2026-07-04 03:52:29.506','2026-07-04 03:52:29.506',0,'10%'),('8438c74c-cc9f-4aa3-bd29-3cfd029e7bf3','Admin User','admin@aaaconsultancy.com','$2b$10$iIDusvPHLk7V4dqgcrW2JuzHsm7iGVa0FQ671zhX2becnEWyObPd2',NULL,'admin',NULL,NULL,0,NULL,NULL,'2026-07-04 03:52:27.818','2026-07-04 03:52:27.818',0,'10%'),('85419ace-6141-4c99-addc-267bb29b188a','John SuperAdmin','superadmin@aaaconsultancy.com','$2b$10$NaEEKNqxHJT3yoCBqku7eeDLOQQe/arInj8FI9wrPlgMTK8dhTunG',NULL,'super_admin',NULL,NULL,0,NULL,NULL,'2026-07-03 11:19:05.913','2026-07-03 11:19:05.913',0,'10%'),('c01fa286-8bad-45e0-aa50-46cfe96526bd','test2','test2@gmail.com','$2b$10$lOsaaWJPltuakh1Q9fDpbuQ/m/AkQonIc23KjB8/ThVq2BKthOREO','1234','finance','[\"English\"]','[\"British\"]',10,'','{\"enabled\":false,\"menus\":[],\"cards\":[]}','2026-07-04 05:21:42.344','2026-07-04 05:21:42.344',0,'10%'),('e81233e7-7166-45d3-9d3a-aa28eba58ae7','Agent User','agent@aaaconsultancy.com','$2b$10$iIDusvPHLk7V4dqgcrW2JuzHsm7iGVa0FQ671zhX2becnEWyObPd2',NULL,'consultant',NULL,NULL,0,NULL,NULL,'2026-07-04 03:52:28.992','2026-07-04 03:52:28.992',0,'10%');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `visa_services`
--

DROP TABLE IF EXISTS `visa_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `visa_services` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `category` varchar(191) NOT NULL,
  `basePrice` double NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `visa_services`
--

LOCK TABLES `visa_services` WRITE;
/*!40000 ALTER TABLE `visa_services` DISABLE KEYS */;
/*!40000 ALTER TABLE `visa_services` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-04 12:10:51
