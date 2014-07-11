# ************************************************************
# Sequel Pro SQL dump
# Version 4096
#
# http://www.sequelpro.com/
# http://code.google.com/p/sequel-pro/
#
# Host: localhost (MySQL 5.5.34)
# Database: behive2
# Generation Time: 2014-07-10 17:05:22 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table Hives
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Hives`;

CREATE TABLE `Hives` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(150) DEFAULT NULL,
  `alias` varchar(50) DEFAULT NULL,
  `description` text,
  `created_on` datetime DEFAULT NULL,
  `created_by` int(7) unsigned DEFAULT NULL,
  `modified_on` datetime DEFAULT NULL,
  `modified_by` int(7) unsigned DEFAULT NULL,
  `tenant_id` int(6) unsigned DEFAULT NULL,
  `primary_hive` tinyint(1) unsigned DEFAULT '0',
  `main_image` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `Hives` WRITE;
/*!40000 ALTER TABLE `Hives` DISABLE KEYS */;

INSERT INTO `Hives` (`id`, `title`, `alias`, `description`, `created_on`, `created_by`, `modified_on`, `modified_by`, `tenant_id`, `primary_hive`, `main_image`)
VALUES
	(1,'The Organic Agency','toa','The Organic Agency Hive','0000-00-00 00:00:00',1,'0000-00-00 00:00:00',1,1,1,NULL),
	(2,'Renshaw Baking','ren','The Renshaw Baking Hive	','0000-00-00 00:00:00',1,'0000-00-00 00:00:00',1,1,0,'/assets/images/hives/renshaw.jpg'),
	(3,'FBU','fbu',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL),
	(4,'Behive','behive',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL),
	(5,'Development Team','devs',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL),
	(6,'Marketing Team',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL);

/*!40000 ALTER TABLE `Hives` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
