-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 19, 2023 at 02:18 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `adsfasd`
--

-- --------------------------------------------------------

--
-- Table structure for table `provider_preferences`
--

CREATE TABLE `provider_preferences` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `situation` enum('Alleenstaand','Met partner','Met huisgenoot','Met kinderen','Anders') NOT NULL,
  `house` tinyint(1) NOT NULL,
  `found` text NOT NULL,
  `motivation` text NOT NULL,
  `housePicture` mediumblob DEFAULT NULL,
  `period` enum('1','2','3','4','5','6','7','8','9','\r\n\r\n10','11') NOT NULL,
  `nights` enum('1','2','3','4','5','6','7') NOT NULL,
  `roomType` text NOT NULL,
  `roomSize` int(11) NOT NULL,
  `furniture` tinyint(1) NOT NULL,
  `furnitureDescription` text DEFAULT NULL,
  `price` int(11) NOT NULL,
  `offer` text NOT NULL,
  `importantNote` text NOT NULL,
  `volunteer` tinyint(1) NOT NULL,
  `volunteerDescription` text DEFAULT NULL,
  `work` tinyint(1) NOT NULL,
  `workDescription` text DEFAULT NULL,
  `describe` text NOT NULL,
  `hobby` text NOT NULL,
  `pet` tinyint(1) NOT NULL,
  `petDescription` text DEFAULT NULL,
  `religion` text DEFAULT NULL,
  `comment` text DEFAULT NULL,
  `overallcomment` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `provider_preferences`
--

INSERT INTO `provider_preferences` (`id`, `userId`, `situation`, `house`, `found`, `motivation`, `housePicture`, `period`, `nights`, `roomType`, `roomSize`, `furniture`, `furnitureDescription`, `price`, `offer`, `importantNote`, `volunteer`, `volunteerDescription`, `work`, `workDescription`, `describe`, `hobby`, `pet`, `petDescription`, `religion`, `comment`, `overallcomment`) VALUES
(2, 11, 'Alleenstaand', 1, 'Internet', 'Ik zoek een gezellige huisgenoot, die af an toe kan helpen met dingen.', NULL, '6', '3', 'Enkele kamer', 15, 1, 'Kast, bureau en stoel zijn beschikbaar.', 500, 'Ik kook elke avond het eten', 'Geen speciale opmerkingen.', 1, NULL, 0, NULL, 'Ik ben een rustig persoon en houd van een schone en opgeruimde omgeving.', 'Lezen, wandelen, tuinieren', 0, NULL, 'Geen specifieke religie', NULL, NULL),
(3, 12, 'Alleenstaand', 1, 'Bij toeval gevonden', 'Ik zoek een gezellige huisgenoot, die af an toe kan helpen met dingen.', NULL, '6', '7', 'Gedeelde kamer', 12, 1, 'Beschikbaar meubilair aanwezig.', 500, 'Inclusief nutsvoorzieningen', 'Geen speciale opmerkingen', 0, NULL, 0, NULL, 'Ik ben een rustig en net persoon.', 'Muziek luisteren, wandelen', 0, NULL, NULL, NULL, NULL),
(4, 13, 'Alleenstaand', 1, 'ITExplained.nl', 'Ik zoek een gezellige huisgenoot, die af an toe kan helpen met dingen.', NULL, '6', '7', 'Appartement', 50, 1, 'Basic meubilair beschikbaar', 800, 'Ik ben bereid om een aanbieding te overwegen.', 'Geen speciale opmerkingen', 1, 'Ik werk vrijwillig bij de kerk', 0, NULL, 'Ik werk als oudere werknemer specialist.', 'Mijn hobby\'s zijn lezen en tuinieren.', 0, NULL, 'Ik ben katholiek', NULL, NULL),
(5, 14, 'Alleenstaand', 1, 'Internet', 'Ik zoek een gezellige huisgenoot, die af an toe kan helpen met dingen.', NULL, '6', '7', 'Studio', 25, 1, 'Basic meubilair beschikbaar', 800, 'Ik kan helpen bij een eventuele studie', 'Geen speciale opmerkingen', 0, NULL, 1, 'Ik ben een professionele fotograaf.', 'Ik houd van reizen en fotograferen.', 'Fotografie', 0, NULL, NULL, NULL, NULL),
(6, 15, 'Alleenstaand', 1, 'CarUtilities.nl', 'Ik ben op zoek naar een huis om te huren omdat ik net verhuisd ben naar Utrecht.Ik zoek een gezellige huisgenoot, die af an toe kan helpen met dingen.', NULL, '6', '7', '1-persoonskamer', 12, 0, NULL, 500, 'Ik bied een extra kamer aan voor als er iemand anders tijdelijk bij in moet komen', 'Geen speciale opmerkingen', 0, '', 1, 'Ik werk als payrollcoördinator bij Schaak Electronics.', 'Ik ben een rustig en netjes persoon.', 'Ik hou van schaken en lezen.', 0, NULL, 'Ik ben niet religieus.', NULL, NULL),
(7, 16, 'Alleenstaand', 1, 'HumorVids.nl', 'Ik ben op zoek naar een comfortabele en gezellige plek om te wonen.Ik zoek een gezellige huisgenoot, die af an toe kan helpen met dingen.', NULL, '3', '5', 'Eenpersoonskamer', 12, 0, NULL, 500, 'Ik ben bereid om te spreken over de prijs', 'Roken en huisdieren zijn niet toegestaan.', 0, NULL, 1, 'Ik werk parttime als vrijwilliger in een plaatselijk bejaardentehuis.', 'Ik ben een rustige en nette persoon.', 'Ik hou van wandelen en lezen.', 0, NULL, NULL, NULL, NULL),
(8, 17, 'Anders', 1, 'MemberVerification.nl', 'Ik zoek een gezellige huisgenoot, die af an toe kan helpen met dingen.', NULL, '6', '7', 'Eenpersoonskamer', 15, 1, 'Standaard meubilair', 500, 'Ik bied een schone en vriendelijke omgeving.', 'Belangrijk: roken en huisdieren zijn niet toegestaan.', 0, NULL, 0, NULL, 'Ik ben een rustige en verantwoordelijke huurder.', 'Lezen en tuinieren', 0, NULL, NULL, NULL, NULL),
(9, 18, 'Alleenstaand', 1, 'GolfByZip.nl', 'Ik zoek een gezellige huisgenoot, die af an toe kan helpen met dingen.', NULL, '6', '7', 'Gedeelde kamer', 12, 0, NULL, 500, 'Ik kan 24/7 oppassen op een huisdier', 'Ik ben hoog sensitief', 1, 'Ik ben bereid om vrijwilligerswerk te doen in de buurt.', 1, 'Ik werk als vrijwilliger bij een lokale organisatie.', 'Ik ben een rustige en vriendelijke persoon.', 'Mijn hobby\'s zijn tuinieren en schilderen.', 0, NULL, 'Ik ben niet religieus.', NULL, NULL),
(11, 19, 'Alleenstaand', 1, 'MetaTerm.nl', 'Ik zoek een gezellige huisgenoot, die af an toe kan helpen met dingen.', NULL, '1', '7', 'Eigen kamer', 15, 1, 'Basic meubilair beschikbaar', 500, 'Ik leef in een fijne buurt', 'Geen speciale opmerkingen.', 0, NULL, 1, 'Ik werk vanuit huis.', 'Ik ben een vriendelijke en verantwoordelijke huurder.', 'Lezen, wandelen, koken', 0, NULL, 'Ik heb geen specifieke religie.', 'Bedankt voor de gelegenheid om mijn voorkeuren te delen.', 'Ik kijk uit naar uw reactie.'),
(12, 20, 'Alleenstaand', 1, 'OfficerUniform.nl', 'Ik zoek een gezellige huisgenoot, die af an toe kan helpen met dingen.', NULL, '6', '7', 'Studio', 20, 1, 'Basic meubilair beschikbaar', 500, 'Inclusief nutsvoorzieningen', 'Geen speciale opmerkingen', 0, NULL, 0, NULL, 'Ik ben een rustige en nette huurder.', 'Lezen, tuinieren', 0, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `seeker_preferences`
--

CREATE TABLE `seeker_preferences` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `seekingCity` varchar(255) NOT NULL,
  `liveWith` enum('M','V','K') DEFAULT NULL,
  `budget` int(11) NOT NULL,
  `period` enum('1','2','3','4','5','6','7','8','9','10','11') NOT NULL,
  `nights` enum('1','2','3','4','5','6','7') NOT NULL,
  `pet` tinyint(1) NOT NULL,
  `ownPet` tinyint(1) NOT NULL,
  `ownPetDescription` text DEFAULT NULL,
  `starDate` date NOT NULL,
  `endDate` date NOT NULL,
  `reason` enum('Studie','Starter','Scheiding','Anders') NOT NULL,
  `schoolFinished` text DEFAULT NULL,
  `schoolDoing` text DEFAULT NULL,
  `skill` set('EHBO','BHV','Reanimatie') DEFAULT NULL,
  `work` tinyint(1) NOT NULL,
  `workDescription` text DEFAULT NULL,
  `healthRisk` tinyint(1) NOT NULL,
  `healthRiskDescription` text DEFAULT NULL,
  `selfDescription` text NOT NULL,
  `selfWords` text NOT NULL,
  `idealSpace` text NOT NULL,
  `offer` text NOT NULL,
  `offerYou` text NOT NULL,
  `importantNote` text NOT NULL,
  `volunteer` tinyint(1) NOT NULL,
  `volunteerDescription` text DEFAULT NULL,
  `religion` text DEFAULT NULL,
  `comment` text DEFAULT NULL,
  `overallcomment` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `seeker_preferences`
--

INSERT INTO `seeker_preferences` (`id`, `userId`, `seekingCity`, `liveWith`, `budget`, `period`, `nights`, `pet`, `ownPet`, `ownPetDescription`, `starDate`, `endDate`, `reason`, `schoolFinished`, `schoolDoing`, `skill`, `work`, `workDescription`, `healthRisk`, `healthRiskDescription`, `selfDescription`, `selfWords`, `idealSpace`, `offer`, `offerYou`, `importantNote`, `volunteer`, `volunteerDescription`, `religion`, `comment`, `overallcomment`) VALUES
(1, 1, 'Den Haag', NULL, 1000, '3', '5', 0, 0, NULL, '2023-07-01', '2024-01-01', 'Studie', NULL, NULL, 'EHBO', 1, 'Verpleegkundige', 0, NULL, 'Ik ben een rustige en nette huurder.', 'vriendelijk, netjes, verantwoordelijk', 'Een kamer met een eigen badkamer en toegang tot een keuken en woonkamer.', 'Ik bied betrouwbare betaling en ben een respectvolle en rustige huisgenoot.', 'Ik ben op zoek naar een schone en rustige woonsituatie.', 'Geen belangrijke opmerkingen.', 0, NULL, NULL, NULL, NULL),
(2, 2, 'Utrecht', NULL, 1200, '6', '4', 0, 0, NULL, '2023-07-01', '2024-01-01', 'Studie', NULL, NULL, 'EHBO', 1, 'Software engineer', 0, NULL, 'Ik ben een gezellige en nette huurder.', 'vriendelijk, sociaal, betrouwbaar', 'Een ruime kamer met voldoende daglicht en een rustige werkomgeving.', 'Ik bied betaling op tijd en ben bereid om te helpen met huishoudelijke taken.', 'Ik ben op zoek naar een huis met een vriendelijke en respectvolle sfeer.', 'Geen belangrijke opmerkingen.', 0, NULL, NULL, NULL, NULL),
(3, 3, 'Wolvega', 'V', 1000, '3', '7', 1, 0, 'Geen eigen huisdieren, maar houdt van huisdieren.', '2023-08-01', '2023-10-31', 'Anders', 'HBO', 'Ik werk als webdesigner.', 'EHBO', 0, NULL, 1, 'Ik heb een voedselallergie en heb een aangepast dieet nodig.', 'Ik ben een rustig persoon en houd mijn omgeving netjes.', 'betrouwbaar, creatief, zelfstandig', 'Een kleine en gezellige kamer met veel licht.', 'Ik kan helpen met het onderhouden van de tuin.', 'Ik ben geïnteresseerd in kunst en houd van schilderen.', 'Geen belangrijke opmerkingen.', 1, 'Ik ben vrijwilliger bij de lokale dierenopvang.', NULL, NULL, NULL),
(4, 4, 'Gouda', NULL, 1000, '3', '5', 1, 0, NULL, '2023-08-01', '2023-11-01', 'Studie', NULL, NULL, 'EHBO', 0, NULL, 1, 'Ik ben gezond en heb geen specifieke risico\'s.', 'Ik ben een rustige en nette huurder.', 'betrouwbaar, georganiseerd, rustig', 'Een eigen slaapkamer met voldoende kastruimte.', 'Ik bied betaling op tijd en ben bereid om te helpen met klusjes.', 'Ik kan huur betalen op tijd en ben bereid te helpen met schoonmaken.', 'Geen belangrijke opmerkingen.', 0, NULL, NULL, NULL, NULL),
(5, 5, 'Elburg', NULL, 1000, '3', '7', 1, 0, 'Ik heb een kat genaamd Minoes.', '2023-08-01', '2023-10-31', 'Starter', NULL, NULL, 'EHBO', 0, NULL, 1, 'Ik heb last van allergieën.', 'Ik ben een rustige en nette huurder.', 'betrouwbaar, georganiseerd, respectvol', 'Een eigen slaapkamer met voldoende kastruimte.', 'Ik bied betaling op tijd en ben bereid om te helpen met klusjes.', 'Ik ben op zoek naar een schone en rustige woonsituatie.', 'Geen belangrijke opmerkingen.', 0, NULL, 'Ik ben rooms-katholiek.', NULL, 'Ik kijk uit naar een fijne samenwerking.'),
(6, 6, 'Amsterdam', NULL, 1500, '3', '5', 1, 0, 'Ik heb een kleine hond genaamd Max.', '2023-08-01', '2023-11-01', 'Studie', 'HBO Informatica', NULL, 'EHBO', 0, NULL, 1, 'Ik ben hoog sensitief', 'Ik ben een rustige en nette huurder.', 'betrouwbaar, verantwoordelijk, zelfstandig', 'Een gezellige woning met een tuin of balkon.', 'Ik bied betaling op tijd en ben bereid om te helpen met klusjes.', 'Ik ben op zoek naar een schone en rustige woonsituatie.', 'Geen opmerkingen.', 1, 'Ik ben actief als vrijwilliger bij een lokale voedselbank.', NULL, 'Ik geniet van het ontdekken van nieuwe gerechten en kook graag voor anderen.', NULL),
(7, 7, 'Vianen', NULL, 1500, '9', '7', 1, 0, 'Ik heb een kat genaamd Whiskers.', '2023-08-01', '2024-05-01', 'Studie', 'Universiteit van Amsterdam', NULL, 'EHBO', 1, 'Docent', 0, 'Geen gezondheidsrisico\'s.', 'Ik ben een rustige en nette huurder.', 'verantwoordelijk, betrouwbaar, vriendelijk', 'Een ruim appartement met een mooi uitzicht en goede voorzieningen.', 'Ik bied een stabiel inkomen en ben bereid om bij te dragen aan het huishouden.', 'Ik ben op zoek naar een schone en rustige woonsituatie.', 'Geen belangrijke opmerkingen.', 0, NULL, 'Katholiek', NULL, NULL),
(8, 8, 'Budel-Schoot', NULL, 1500, '7', '5', 1, 0, NULL, '2023-08-01', '2024-02-01', 'Anders', NULL, NULL, 'BHV', 1, 'Brandweerman', 0, NULL, 'Ik ben een rustige en georganiseerde huurder.', 'betrouwbaar, verantwoordelijk, hulpvaardig', 'Een huis met een tuin en een garage voor mijn auto.', 'Ik bied betaling op tijd en ben bereid om kleine reparaties uit te voeren.', 'Ik ben op zoek naar een schone en rustige woonsituatie.', 'Geen belangrijke opmerking', 0, NULL, 'Ik ben katholiek.', 'Geen opmerkingen.', NULL),
(14, 9, 'Beverwijk', NULL, 1500, '7', '5', 1, 0, 'Ik heb een kleine hond genaamd Max.', '2023-07-01', '2024-02-01', 'Starter', 'HAVO', NULL, 'BHV', 1, 'Lasser', 0, NULL, 'Ik ben een rustige en verantwoordelijke huurder.', 'netjes, betrouwbaar, georganiseerd', 'Een eigen slaapkamer en toegang tot gedeelde voorzieningen zoals keuken en badkamer.', 'Ik bied op tijd betaling en ben bereid te helpen met kleine klusjes.', 'Ik ben op zoek naar een schone en rustige woonsituatie.', 'Geen belangrijke opmerkingen.', 0, NULL, 'Geen religie', NULL, NULL),
(16, 10, 'Den Haag', NULL, 1500, '8', '5', 0, 0, NULL, '2023-08-01', '2024-04-01', 'Studie', NULL, NULL, 'EHBO', 0, NULL, 1, 'Ik ben allergisch voor de meeste dierenharen', 'Ik ben een rustige en nette huurder.', 'betrouwbaar, verantwoordelijk, respectvol', 'Een comfortabele kamer met voldoende opbergruimte en goede wifi-verbinding.', 'Ik bied een vriendelijke en respectvolle huurervaring.', 'Ik ben op zoek naar een schone en rustige woonsituatie.', 'Ik heb geen specifieke opmerkingen.', 1, 'Ik heb ervaring als vrijwilliger in de lokale gemeenschap.', 'Geen religie', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `emailAddress` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `dateOfBirth` date NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `middleName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) NOT NULL,
  `picture` text NOT NULL,
  `gender` enum('M','F','O') NOT NULL,
  `phoneNumber` varchar(10) NOT NULL,
  `postalCode` varchar(6) NOT NULL,
  `street` varchar(255) NOT NULL,
  `houseNumber` int(11) NOT NULL,
  `city` varchar(255) NOT NULL,
  `country` varchar(255) NOT NULL,
  `role` enum('Huurder','Verhuurder') NOT NULL,
  `isActive` tinyint(1) DEFAULT NULL,
  `phoneNumberVisible` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `emailAddress`, `password`, `dateOfBirth`, `firstName`, `middleName`, `lastName`, `picture`, `gender`, `phoneNumber`, `postalCode`, `street`, `houseNumber`, `city`, `country`, `role`, `isActive`, `phoneNumberVisible`) VALUES
(1, 'WieskevandeGroep@mail.com', '$2a$10$tH/c3mJVSH4XUHZCIsIszOxFCHVojm6gf1wmizFohOwe48wRll/9y', '1999-05-04', 'Wieske', NULL, 'van de Groep', 'https://i.ibb.co/C6DgN62/download-10.jpg', 'F', '0625286258', '2497TA', 'Rijswijkse Landingslaan', 46, 'Den Haag', 'Nederland', 'Huurder', 1, 1),
(2, 'JustinavanDoren@mail.com', '$2a$10$Kkjzuid8.V1YuoahMGaVieRNW10/zEwDSHKN7wnZ5Qg5Q2dNPbvkW', '2001-03-09', 'Justina', NULL, 'van Doren', 'https://i.ibb.co/XXdHZ7P/download-11.jpg', 'F', '0632677156', '3572BR', 'Duikerstraat', 182, 'Utrecht', 'Nederland', 'Huurder', 1, 1),
(3, 'RebekkaVerwoerd@mail.com', '$2a$10$a3fq3Bvtrd.bi/BCpaaLM.m7NO8WuTGK80zSKgMbdnJcVWIk1dvba', '1994-01-18', 'Rebekka', NULL, 'Verwoerd', 'https://i.ibb.co/x3cnw4w/download-12.jpg', 'F', '0662007274', '8471KJ', 'Berkenlaan', 40, 'Wolvega', 'Nederland', 'Huurder', 1, 1),
(4, 'CristelvanHalteren@mail.com', '$2a$10$whhkRuZ2jgII90xsF8mp/.kgWpemL0nq6UUj/RBwAm.mi3hnclVN6', '1998-09-01', 'Cristel', NULL, 'van Halteren', 'https://i.ibb.co/BtqtFYj/download-13.jpg', 'F', '0681208324', '2805AD', 'Albert Plesmanplein', 82, 'Gouda', 'Nederland', 'Huurder', 1, 1),
(5, 'JozefienvanZantvoort@mail.com', '$2a$10$QkguYOtEUiq3ALYc4Wbbzuq3xe8ZF5Opbj44doPPcHI5UZib1HmLK', '2002-11-10', 'Jozefien', NULL, 'van Zantvoort', 'https://i.ibb.co/WKsCjJ1/download-14.jpg', 'F', '0658971424', '8081XS', 'Velekenstraat', 57, 'Elburg', 'Nederland', 'Huurder', 1, 1),
(6, 'WalterPanneman@mail.com', '$2a$10$uKCKGihmLVPvO5il3vLAneifI5P67Ht4uGRBV.X9uOWgD9vWwfR2u', '2000-10-09', 'Walter', NULL, 'Panneman', 'https://i.ibb.co/CKQJDGR/download-18.jpg', 'M', '0624157811', '1053TP', 'Tweede Kostverlorenkade', 42, 'Amsterdam', 'Nederland', 'Huurder', 1, 1),
(7, 'HendryvandenBeuken@mail.com', '$2a$10$H.Y8HprBOcFyaPFzHC5rmOebtv5mcaeOGn7mZ5qJsBIo5cOQWfmcm$2a$10$KUf.Yg3mk4k.tLPJqJGx0uWnBtdPBEBGW08XMxKAHWfp0He46W1yq', '1999-11-20', 'Hendry', NULL, 'van den Beuken', 'https://i.ibb.co/64gmQck/download-19.jpg', 'M', '0686444739', '4133HK', 'Joke Smitlaan', 171, 'Vianen', 'Nederland', 'Huurder', 1, 1),
(8, 'GordonvandenEngel@mail.com', '$2a$10$3q0eC1VS.7uoJ8S0iGxAaO3SmMtl5wKBw9eXV/LG.p5Okey3bWfoG', '2001-12-26', 'Gordon', NULL, 'van den Engel', 'https://i.ibb.co/0j41Vpr/download-15.jpg', 'M', '0633795933', '6023EK', 'Poelsnip', 8, 'Budel-Schoot', 'Nederland', 'Huurder', 1, 1),
(9, 'MatthijsvanderSluis@mail.com', '$2a$10$7TYUZNhPQHeRLGxNfKH5q.gW2.qLwxMFXjY6sc0jZkaGHcywhSJ/u', '1999-07-13', 'Matthijs', NULL, 'van der Sluis', 'https://i.ibb.co/FX3tM1C/download-17.jpg', 'M', '0627718846', '1944PE', 'Toon Kokhof', 92, 'Beverwijk', 'Nederland', 'Huurder', 1, 1),
(10, 'OttoLeunissen@mail.com', '$2a$10$ixvVgWf83Vj4vDLupejLQ.FVfz/bUQcQEmzMsA/zaPfvz9XzKAvse', '1978-08-10', 'Otto', NULL, 'Leunissen', 'https://i.ibb.co/9yQ8WZM/download-16.jpg', 'M', '0699500356', '2517AZ', 'Laan van Meerdervoort', 169, 'Den Haag', 'Nederland', 'Huurder', 1, 1),
(11, 'RobertBraak@mail.com', '$2a$10$RLT8/yVSh3Vt3eswm12hguJofv7fDNueP5H060Z2M5fuig9pqNgz6', '1937-08-29', 'Robert', NULL, 'Braak', 'https://i.ibb.co/LJNDQXz/download-1.jpg', 'M', '0677872213', '4701EM', 'Burgerhoutsestraat', 30, 'Roosendaal', 'Netherlands', 'Verhuurder', 1, 1),
(12, 'BeertBrugman@mail.com', '$2a$10$VhZQpLXMhnXJWhsLJe1ipeOAA1F2attsrnJT4KVKpIVoej66.bjNS', '1935-09-09', 'Beert', NULL, 'Brugman', 'https://i.ibb.co/5LLf8pc/download-2.jpg', 'M', '0624844823', '3583TW', 'Rembrandtkade', 135, 'Utrecht', 'Netherlands', 'Verhuurder', 1, 1),
(13, 'ToonvandenBeemt@mail.com', '$2a$10$aUrUCxDth0keHk.BME/ckOQvi3UWL6ogbrbU0RCt0BPVLz1NrtK3q', '1943-06-14', 'Toon', NULL, 'van den Beemt', 'https://i.ibb.co/ykjFRzf/download.jpg', 'M', '0698928043', '4245KX', 'Weverwijk', 61, 'Leerbroek', 'Netherlands', 'Verhuurder', 1, 1),
(14, 'HilkovanRheenen@mail.com', '$2a$10$HwCRAXOokH7bRLB553Eey.GT7q6nw961N1q7eTZj2Vke4shr4/X/q', '1952-06-01', 'Hilko', NULL, 'van Rheenen', 'https://i.ibb.co/bgPHdrH/download-7.jpg', 'M', '0637023617', '7411ZM', 'Bellendonkplein', 12, 'Deventer', 'Netherlands', 'Verhuurder', 1, 1),
(15, 'FransBood@mail.com', '$2a$10$GDFkb/T8s.KgHjvRhdBVVu9MsjLAQTro1EkOd2ajUqWCSHeBlrTFm', '1923-04-25', 'Frans', NULL, 'Bood', 'https://i.ibb.co/H47M5WT/download-8.jpg', 'M', '0685715322', '3533VE', 'Dantelaan', 46, 'Utrecht', 'Nederland', 'Verhuurder', 1, 1),
(16, 'BarbaraMolenschot@mail.com', '$2a$10$39AEKwcojZDpZI7mYQZf1OnQGNzS09xElfP6Bsauo1MReTwspdFOq', '1931-02-16', 'Barbara', NULL, 'Molenschot', 'https://i.ibb.co/cL6FKCF/download.jpg', 'F', '0657668746', '2953BR', 'Blokweerweg', 64, 'Alblasserdam', 'Netherlands', 'Verhuurder', 1, 1),
(17, 'JoseHoogers@mail.com', '$2a$10$55q.TYbAyJ7Bm5.njJ09TeO.1g./.Rsx0vimPq7NysNVtIx3XeTmC', '1941-06-08', 'Jose', NULL, 'Hoogers', 'https://i.ibb.co/Jz74jjw/download-3.jpg', 'F', '0647547561', '7661RE', 'Pastoor Visserstraat', 45, 'Vasse', 'Netherlands', 'Verhuurder', 1, 1),
(18, 'WenkevantKlooster@mail.com', '$2a$10$rd6.hugaJPrJ.xcf16/N7eb6MWeMSQYphk0w4XGtEwkArjvsz7K4u', '1950-04-15', 'Wenke', '', 'van \'t Klooster', 'https://i.ibb.co/gSKsPjm/download-6.jpg', 'F', '0612345678', '8294PD', 'Nieuwe Wetering', 29, 'Mastenbroek', 'Netherlands', 'Verhuurder', 1, 1),
(19, 'RinskeEenink@mail.com', '$2a$10$rzYoyr5VqLrqES7gPFAwSOqfDD775kXto/jkYJYawZPdv3fblt9PC', '1928-01-26', 'Rinske', '', 'Eenink', 'https://i.ibb.co/ZJ8T0bN/download-5.jpg', 'F', '0688288287', '1339NH', 'Midwaystraat', 193, 'Almere', 'Netherlands', 'Verhuurder', 1, 1),
(20, 'BernadettedeKooter@mail.com', '$2a$10$XmE9u4tfCiapBYObog9EceL.jbd0ht8n.0ae1BNxNSK5BUrNBxYB2', '1950-02-08', 'Bernadette', NULL, 'de Kooter', 'https://i.ibb.co/Js3YppV/download-4.jpg', 'F', '0630720449', '2652XP', 'Parkstraat', 200, 'Berkel en Rodenrijs', 'Netherlands', 'Verhuurder', 1, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `provider_preferences`
--
ALTER TABLE `provider_preferences`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_provider_preferences_userId` (`userId`);

--
-- Indexes for table `seeker_preferences`
--
ALTER TABLE `seeker_preferences`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_seeker_preferences_userId` (`userId`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `emailAddress` (`emailAddress`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `provider_preferences`
--
ALTER TABLE `provider_preferences`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `seeker_preferences`
--
ALTER TABLE `seeker_preferences`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `provider_preferences`
--
ALTER TABLE `provider_preferences`
  ADD CONSTRAINT `FK_provider_preferences_userId` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `seeker_preferences`
--
ALTER TABLE `seeker_preferences`
  ADD CONSTRAINT `FK_seeker_preferences_userId` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
