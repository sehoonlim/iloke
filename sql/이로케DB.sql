-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: iloke
-- ------------------------------------------------------
-- Server version	11.5.2-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `answer`
--

DROP TABLE IF EXISTS `answer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `answer` (
  `id` varchar(14) NOT NULL COMMENT '고유id',
  `turn` int(11) NOT NULL DEFAULT 1 COMMENT '순번',
  `comment` text NOT NULL COMMENT '답변',
  `delete_yn` tinyint(1) NOT NULL DEFAULT 0 COMMENT '삭제여부',
  `reg_id` varchar(60) NOT NULL COMMENT '등록자',
  `reg_date` datetime NOT NULL DEFAULT current_timestamp() COMMENT '등록 일시',
  `upt_id` varchar(60) DEFAULT NULL COMMENT '수정자',
  `upt_date` datetime DEFAULT NULL COMMENT '수정 일시',
  PRIMARY KEY (`id`,`turn`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `answer`
--

/*!40000 ALTER TABLE `answer` DISABLE KEYS */;
INSERT INTO `answer` VALUES ('bd202412290004',1,'ㅋㅋㅋ 그래그래',0,'admin123','2024-12-29 20:31:28','admin123','2024-12-29 20:31:28'),('bd202412290006',1,'하하하',0,'admin123','2024-12-29 20:36:26','admin123','2024-12-29 20:36:38'),('bd202412300004',1,'333',0,'admin123','2024-12-30 10:31:52','admin123','2024-12-30 10:31:52'),('bd202412300008',1,'문의답변',0,'admin123','2024-12-30 11:46:35','admin123','2024-12-30 11:46:35'),('bd202412300012',1,'답변드립니다.',0,'abcd123456','2024-12-30 15:50:28','abcd123456','2024-12-30 15:50:28');
/*!40000 ALTER TABLE `answer` ENABLE KEYS */;

--
-- Table structure for table `board`
--

DROP TABLE IF EXISTS `board`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `board` (
  `id` varchar(14) NOT NULL COMMENT 'bd + yyyyMMdd + 4자리 시퀀스',
  `code` char(2) NOT NULL COMMENT '게시판 종류별 코드',
  `title` varchar(100) NOT NULL COMMENT '게시글 제목',
  `contents` text NOT NULL COMMENT '게시글 내용',
  `img_no` varchar(14) DEFAULT NULL COMMENT '첨부 이미지 코드',
  `products_id` varchar(14) DEFAULT NULL COMMENT '상품 ID',
  `score` int(11) DEFAULT NULL COMMENT '별점',
  `delete_yn` tinyint(1) DEFAULT 0 COMMENT '삭제여부',
  `read_no` int(11) NOT NULL DEFAULT 0 COMMENT '조회수, 기본값 0',
  `start_date` datetime DEFAULT NULL COMMENT '시작 일시',
  `end_date` datetime DEFAULT NULL COMMENT '종료 일시',
  `reg_id` varchar(60) NOT NULL COMMENT '등록자',
  `reg_date` datetime NOT NULL DEFAULT current_timestamp() COMMENT '등록 일시',
  `upt_id` varchar(60) DEFAULT NULL COMMENT '수정자',
  `upt_date` datetime DEFAULT NULL COMMENT '수정 일시',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `board`
--

/*!40000 ALTER TABLE `board` DISABLE KEYS */;
INSERT INTO `board` VALUES ('bd202412290001','rv','안녕하세요','아아아아아',NULL,NULL,NULL,1,3,NULL,NULL,'user07','2024-12-29 20:18:27','user07','2024-12-29 20:20:29'),('bd202412290002','pr','ㅇㅇㅇㅇ','ㅈㅈㅈㅈㅈㅈ',NULL,NULL,NULL,0,2,NULL,NULL,'user07','2024-12-29 20:22:06','user07','2024-12-29 20:22:46'),('bd202412290003','nt','반갑습니다','저는 임세훈입니다.',NULL,NULL,NULL,1,1,NULL,NULL,'admin123','2024-12-29 20:24:40','admin123','2024-12-29 20:24:40'),('bd202412290004','pq','ㅋㅋㅋ','어쩔티비',NULL,NULL,NULL,0,2,NULL,NULL,'user07','2024-12-29 20:29:12','user07','2024-12-29 20:29:12'),('bd202412290005','fq','ㅇㅇㅇ','어쩔',NULL,NULL,NULL,0,3,NULL,NULL,'admin123','2024-12-29 20:34:13','admin123','2024-12-29 20:34:13'),('bd202412290006','ui','ㅇㅇㅇ','ㅈㅈㅈㅈㅈ',NULL,NULL,NULL,0,2,NULL,NULL,'user07','2024-12-29 20:35:18','user07','2024-12-29 20:35:18'),('bd202412300001','rv','h','ㅗ엿머거라',NULL,NULL,NULL,0,2,NULL,NULL,'user07','2024-12-30 10:29:18','user07','2024-12-30 10:29:35'),('bd202412300002','pr','사진입니다','나는사진',NULL,NULL,NULL,1,1,NULL,NULL,'user07','2024-12-30 10:30:03','user07','2024-12-30 10:30:03'),('bd202412300003','nt','나는공지다','공지1',NULL,NULL,NULL,1,1,NULL,NULL,'admin123','2024-12-30 10:30:46','admin123','2024-12-30 10:30:46'),('bd202412300004','pq','1','2',NULL,NULL,NULL,0,1,NULL,NULL,'user07','2024-12-30 10:31:26','user07','2024-12-30 10:31:26'),('bd202412300005','rv','고객의후기','고객이썻습니다야호',NULL,NULL,NULL,0,4,NULL,NULL,'user07','2024-12-30 11:43:53','user07','2024-12-30 11:44:11'),('bd202412300006','pr','사진','작성',NULL,NULL,NULL,1,2,NULL,NULL,'user07','2024-12-30 11:44:38','user07','2024-12-30 11:44:38'),('bd202412300007','nt','공지1','사항1',NULL,NULL,NULL,1,1,NULL,NULL,'admin123','2024-12-30 11:45:18','admin123','2024-12-30 11:45:18'),('bd202412300008','pq','문의1','상품문의1',NULL,NULL,NULL,0,1,NULL,NULL,'user07','2024-12-30 11:45:59','user07','2024-12-30 11:45:59'),('bd202412300009','rv','상품후기','후기입니다.안녕ㅎ세요',NULL,NULL,NULL,1,2,NULL,NULL,'user07','2024-12-30 15:47:54','user07','2024-12-30 15:48:04'),('bd202412300010','pr','사진1','사진내용1',NULL,NULL,NULL,0,2,NULL,NULL,'user07','2024-12-30 15:48:36','user07','2024-12-30 15:48:36'),('bd202412300011','nt','공지사항','첫번쨰공지',NULL,NULL,NULL,1,1,NULL,NULL,'abcd123456','2024-12-30 15:49:11','abcd123456','2024-12-30 15:49:11'),('bd202412300012','pq','문의이빈다','1버문의',NULL,NULL,NULL,0,1,NULL,NULL,'user07','2024-12-30 15:49:57','user07','2024-12-30 15:49:57');
/*!40000 ALTER TABLE `board` ENABLE KEYS */;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `cart_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '장바구니 번호',
  `product_id` varchar(14) NOT NULL COMMENT '상품 번호',
  `member_id` varchar(50) NOT NULL COMMENT '회원 ID',
  `quantity` int(11) NOT NULL COMMENT '상품 수량',
  `options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '상품 옵션 정보' CHECK (json_valid(`options`)),
  `option_unit_price` int(11) NOT NULL DEFAULT 0 COMMENT '옵션 포함 개별 상품 가격',
  `reg_id` varchar(50) NOT NULL COMMENT '작성자',
  `reg_date` datetime NOT NULL DEFAULT current_timestamp() COMMENT '작성 일시',
  `upt_id` varchar(50) DEFAULT NULL COMMENT '수정자',
  `upt_date` datetime DEFAULT NULL COMMENT '수정 일시',
  PRIMARY KEY (`cart_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (2,'K1735453892541','user06',2,'{\"color\": \"하하하\", \"leather\": \"초코초코\"}',178333,'user06','2024-12-29 15:32:16',NULL,NULL),(3,'K1735453892541','user06',2,'{\"color\": \"파파파\", \"leather\": \"나쁜짓을 하면은~\"}',128555,'user06','2024-12-29 15:32:16',NULL,NULL),(4,'K1735453892541','user06',1,'{\"color\": \"파파파\", \"leather\": \"나쁜짓을 하면은~\"}',128555,'user06','2024-12-29 17:18:48',NULL,NULL),(14,'K1735521454617','abcd1234',3,'{\"color\": \"그런듯\", \"leather\": \"누누나나\"}',140100,'abcd1234','2024-12-30 10:20:23',NULL,NULL),(15,'K1735521454617','abcd1234',1,'{\"color\": \"그런듯\", \"leather\": \"가나다라\"}',140300,'abcd1234','2024-12-30 10:20:23',NULL,NULL);
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;

--
-- Table structure for table `deliveries`
--

DROP TABLE IF EXISTS `deliveries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `deliveries` (
  `delivery_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '배송 번호',
  `order_id` int(11) NOT NULL COMMENT '주문 번호(FK)',
  `member_id` varchar(50) NOT NULL COMMENT '회원 ID(FK)',
  `order_status` enum('배송준비','배송중','배송완료','취소요청','취소완료','반품요청','반품완료') DEFAULT '배송준비' COMMENT '주문 상태',
  `prep_date` datetime DEFAULT NULL COMMENT '배송 준비 날짜',
  `start_date` datetime DEFAULT NULL COMMENT '배송 시작 날짜',
  `done_date` datetime DEFAULT NULL COMMENT '배송 완료 날짜',
  `cancel_req_date` datetime DEFAULT NULL COMMENT '취소 요청 날짜',
  `cancel_done_date` datetime DEFAULT NULL COMMENT '취소 완료 날짜',
  `return_req_date` datetime DEFAULT NULL COMMENT '반품 요청 날짜',
  `return_done_date` datetime DEFAULT NULL COMMENT '반품 완료 날짜',
  `req_reasons` text DEFAULT NULL COMMENT '요청 사유',
  `refuse_reasons` text DEFAULT NULL COMMENT '요청 거절 사유',
  `reg_id` varchar(50) NOT NULL COMMENT '작성자',
  `reg_date` datetime NOT NULL DEFAULT current_timestamp() COMMENT '작성일시',
  `upt_id` varchar(50) DEFAULT NULL COMMENT '수정자',
  `upt_date` datetime DEFAULT NULL COMMENT '수정일시',
  PRIMARY KEY (`delivery_id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `deliveries`
--

/*!40000 ALTER TABLE `deliveries` DISABLE KEYS */;
INSERT INTO `deliveries` VALUES (5,1,'user07','배송준비','2023-12-01 12:00:00','2023-12-02 14:00:00','2023-12-03 16:00:00',NULL,NULL,'2024-12-30 10:27:24',NULL,'상품 불량',NULL,'admin','2024-12-29 23:18:35',NULL,NULL),(6,2,'user07','배송완료','2023-12-02 13:00:00',NULL,NULL,'2024-12-30 11:41:52','2024-12-30 11:42:07',NULL,NULL,'단순 변심',NULL,'admin','2024-12-29 23:18:35',NULL,'2024-12-30 11:42:07'),(7,3,'user07','배송완료','2023-12-03 10:00:00','2023-12-04 11:00:00','2023-12-05 14:00:00',NULL,NULL,NULL,NULL,NULL,NULL,'admin','2024-12-29 23:18:35',NULL,NULL),(8,4,'user07','취소요청','2023-12-04 14:00:00','2023-12-05 10:00:00',NULL,'2024-12-31 16:21:18',NULL,NULL,NULL,'단순 변심',NULL,'admin','2024-12-29 23:18:35',NULL,NULL),(9,5,'user07','배송완료','2023-12-05 13:00:00','2023-12-06 15:00:00','2023-12-07 17:00:00',NULL,NULL,NULL,NULL,NULL,NULL,'admin','2024-12-29 23:18:35',NULL,NULL),(10,6,'user07','취소완료','2023-12-06 12:00:00',NULL,NULL,'2023-12-06 14:00:00','2023-12-07 10:00:00',NULL,NULL,'단순 변심',NULL,'admin','2024-12-29 23:18:35',NULL,NULL),(11,7,'user07','배송완료','2023-12-07 11:00:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'admin','2024-12-29 23:18:35',NULL,NULL),(12,8,'user07','반품완료','2023-12-08 10:00:00','2023-12-09 13:00:00',NULL,'2023-12-10 14:00:00',NULL,'2023-12-11 12:00:00','2023-12-12 16:00:00','상품 파손',NULL,'admin','2024-12-29 23:18:35',NULL,NULL),(13,9,'user07','배송중','2023-12-09 15:00:00','2023-12-10 17:00:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'admin','2024-12-29 23:18:35',NULL,NULL),(14,10,'user07','반품요청','2023-12-10 12:00:00','2023-12-11 14:00:00','2023-12-12 18:00:00',NULL,NULL,'2024-12-30 11:42:41',NULL,'단순 변심','재고 부족','admin','2024-12-29 23:18:35',NULL,'2024-12-30 11:42:56'),(15,11,'user07','배송완료','2023-12-11 10:30:00','2023-12-12 11:30:00','2023-12-13 12:30:00',NULL,NULL,NULL,NULL,NULL,NULL,'admin','2024-12-29 23:18:35',NULL,NULL),(16,12,'user07','배송준비','2023-12-12 11:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'admin','2024-12-29 23:18:35',NULL,NULL),(17,13,'user06','배송완료','2023-12-13 12:30:00','2023-12-14 13:30:00','2023-12-15 14:30:00',NULL,NULL,NULL,NULL,NULL,NULL,'admin','2024-12-29 23:18:35',NULL,NULL),(18,14,'user06','취소완료','2023-12-14 13:30:00',NULL,NULL,'2023-12-14 14:30:00','2023-12-15 15:30:00',NULL,NULL,'상품 품절',NULL,'admin','2024-12-29 23:18:35',NULL,NULL),(19,15,'user06','배송중','2023-12-15 14:30:00','2023-12-16 15:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'admin','2024-12-29 23:18:35',NULL,NULL),(20,16,'user06','반품요청','2023-12-16 15:30:00','2023-12-17 16:30:00',NULL,NULL,NULL,'2023-12-18 17:30:00',NULL,'잘못된 상품','재고 부족','admin','2024-12-29 23:18:35',NULL,'2024-12-31 14:55:08'),(21,17,'user06','배송완료','2023-12-17 16:30:00','2023-12-18 17:30:00','2023-12-19 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,'admin','2024-12-29 23:18:35',NULL,NULL),(22,18,'user06','배송준비','2023-12-18 17:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'admin','2024-12-29 23:18:35',NULL,NULL),(23,19,'user06','배송완료','2023-12-19 18:30:00','2023-12-20 19:30:00','2023-12-21 20:30:00',NULL,NULL,NULL,NULL,NULL,NULL,'admin','2024-12-29 23:18:35',NULL,NULL),(24,20,'user06','배송중','2023-12-20 19:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'admin','2024-12-29 23:18:35',NULL,NULL),(25,26,'user07','반품요청',NULL,NULL,NULL,'2024-12-30 10:26:13','2024-12-30 10:26:39','2024-12-30 15:47:18',NULL,'단순 변심','상품 손상','user07','2024-12-30 03:23:19',NULL,'2024-12-30 15:47:30'),(26,27,'user07','배송완료',NULL,'2024-12-30 10:25:15','2024-12-30 10:25:28',NULL,NULL,NULL,NULL,NULL,NULL,'user07','2024-12-30 10:23:23',NULL,NULL),(27,28,'user07','취소완료',NULL,'2024-12-30 11:41:00','2024-12-30 11:41:10','2024-12-30 15:46:35','2024-12-30 15:46:48',NULL,NULL,'단순 변심',NULL,'user07','2024-12-30 11:39:49',NULL,'2024-12-30 15:46:48'),(28,29,'user07','배송완료',NULL,'2024-12-30 15:45:43','2024-12-30 15:45:54',NULL,NULL,NULL,NULL,NULL,NULL,'user07','2024-12-30 15:44:39',NULL,NULL),(29,30,'user07','배송준비',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'user07','2024-12-31 17:20:14',NULL,NULL);
/*!40000 ALTER TABLE `deliveries` ENABLE KEYS */;

--
-- Table structure for table `file_manage`
--

DROP TABLE IF EXISTS `file_manage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `file_manage` (
  `id` varchar(14) NOT NULL COMMENT '고유 id',
  `turn` int(11) NOT NULL COMMENT '순서',
  `api_url` varchar(50) DEFAULT NULL COMMENT '요청 url',
  `org_name` varchar(100) NOT NULL COMMENT '원본 파일명',
  `new_name` varchar(255) NOT NULL COMMENT '변경 파일명',
  `ext` varchar(10) DEFAULT NULL COMMENT '확장자명',
  `path` varchar(255) DEFAULT NULL COMMENT '파일 저장 경로',
  `size` bigint(20) DEFAULT NULL COMMENT '파일 크기',
  `dsct` text DEFAULT NULL COMMENT '설명',
  `reg_id` varchar(60) NOT NULL COMMENT '등록자',
  `reg_date` datetime NOT NULL DEFAULT current_timestamp() COMMENT '등록 일시',
  `upt_id` varchar(60) DEFAULT NULL COMMENT '수정자',
  `upt_date` datetime DEFAULT NULL COMMENT '수정 일시',
  PRIMARY KEY (`id`,`turn`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `file_manage`
--

/*!40000 ALTER TABLE `file_manage` DISABLE KEYS */;
INSERT INTO `file_manage` VALUES ('bd202412290002',1,'/mall/boards/registration/image','1.png','11735471326177.png','.png','image',53854,'','1','2024-12-29 20:22:06','1','2024-12-29 20:22:06'),('bd202412300002',1,'/mall/boards/registration/image','ìµëí¸.jfif','최두호1735522203942.jfif','.jfif','image',7591,'','1','2024-12-30 10:30:03','1','2024-12-30 10:30:03'),('bd202412300006',1,'/mall/boards/registration/image','ìµëí¸.jfif','최두호1735526678190.jfif','.jfif','image',7591,'','1','2024-12-30 11:44:38','1','2024-12-30 11:44:38'),('bd202412300010',1,'/mall/boards/registration/image','ìµëí¸.jfif','최두호1735541316344.jfif','.jfif','image',7591,'','1','2024-12-30 15:48:36','1','2024-12-30 15:48:36'),('K1735452945165',1,'/api/products/add/K1735452945165','1.png','11735452945170.png','.png','image',53854,'비고란','dc4638','2024-12-29 15:15:45','dc4638','2024-12-29 15:15:45'),('K1735452945165',2,'/api/products/add/K1735452945165','1.png','11735452945172.png','.png','image',53854,'비고란','dc4638','2024-12-29 15:15:45','dc4638','2024-12-29 15:15:45'),('K1735453892541',1,'/api/products/add/K1735453892541','1.png','11735453892547.png','.png','image',53854,'비고란','dc4638','2024-12-29 15:31:32','dc4638','2024-12-29 15:31:32'),('K1735453892541',2,'/api/products/add/K1735453892541','1.png','11735453892550.png','.png','image',53854,'비고란','dc4638','2024-12-29 15:31:32','dc4638','2024-12-29 15:31:32'),('K1735464804164',1,'/api/products/add/K1735464804164','1.png','11735464804165.png','.png','image',53854,'비고란','dc4638','2024-12-29 18:33:24','dc4638','2024-12-29 18:33:24'),('K1735464804164',2,'/api/products/add/K1735464804164','1.png','11735464804166.png','.png','image',53854,'비고란','dc4638','2024-12-29 18:33:24','dc4638','2024-12-29 18:33:24'),('K1735465782107',1,'/api/products/add/K1735465782107','1.png','11735465782109.png','.png','image',53854,'비고란','dc4638','2024-12-29 18:49:42','dc4638','2024-12-29 18:49:42'),('K1735465782107',2,'/api/products/add/K1735465782107','1.png','11735465782110.png','.png','image',53854,'비고란','dc4638','2024-12-29 18:49:42','dc4638','2024-12-29 18:49:42'),('K1735521454617',1,'/api/products/add/K1735521454617','ìµì¤ì.jfif','최준서1735521454628.jfif','.jfif','image',7821,'비고란','dc4638','2024-12-30 10:17:34','dc4638','2024-12-30 10:17:34'),('K1735521454617',2,'/api/products/add/K1735521454617','ìµì¤ì.jfif','최준서1735521454631.jfif','.jfif','image',7821,'비고란','dc4638','2024-12-30 10:17:34','dc4638','2024-12-30 10:17:34'),('K1735526239117',1,'/api/products/add/K1735526239117','ìµëí¸.jfif','최두호1735526239119.jfif','.jfif','image',7591,'비고란','dc4638','2024-12-30 11:37:19','dc4638','2024-12-30 11:37:19'),('K1735526239117',2,'/api/products/add/K1735526239117','ìµëí¸.jfif','최두호1735526239120.jfif','.jfif','image',7591,'비고란','dc4638','2024-12-30 11:37:19','dc4638','2024-12-30 11:37:19'),('K1735540952174',1,'/api/products/add/K1735540952174','ìµëí¸.jfif','최두호1735540952176.jfif','.jfif','image',7591,'비고란','dc4638','2024-12-30 15:42:32','dc4638','2024-12-30 15:42:32'),('K1735540952174',2,'/api/products/add/K1735540952174','ìµëí¸.jfif','최두호1735540952176.jfif','.jfif','image',7591,'비고란','dc4638','2024-12-30 15:42:32','dc4638','2024-12-30 15:42:32');
/*!40000 ALTER TABLE `file_manage` ENABLE KEYS */;

--
-- Table structure for table `mem_info`
--

DROP TABLE IF EXISTS `mem_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mem_info` (
  `id` varchar(50) NOT NULL COMMENT '회원 아이디',
  `pw` varchar(255) NOT NULL COMMENT '비밀번호',
  `name` varchar(100) NOT NULL COMMENT '회원명',
  `nick` varchar(50) DEFAULT NULL COMMENT '닉네임',
  `birth_date` date DEFAULT NULL COMMENT '생년월일',
  `phone_num` varchar(20) DEFAULT NULL COMMENT '휴대전화',
  `email` varchar(100) DEFAULT NULL COMMENT '이메일',
  `addr` varchar(255) DEFAULT NULL COMMENT '주소',
  `role` enum('관리자','회원','비회원','탈퇴회원') DEFAULT '회원' COMMENT '접근 권한',
  `type` enum('일반','블랙리스트','휴면계정') DEFAULT '일반' COMMENT '회원 구분',
  `level` enum('브론즈','실버','골드','VIP') DEFAULT '브론즈' COMMENT '회원 등급',
  `join_date` datetime DEFAULT current_timestamp() COMMENT '가입일시',
  `last_date` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '최근접속일',
  `m_remain` int(11) DEFAULT 0 COMMENT '잔여 마일리지',
  `reg_id` varchar(60) NOT NULL COMMENT '작성자',
  `reg_date` datetime NOT NULL DEFAULT current_timestamp() COMMENT '작성일시',
  `upt_id` varchar(60) DEFAULT NULL COMMENT '수정자',
  `upt_date` datetime DEFAULT NULL COMMENT '수정일시',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mem_info`
--

/*!40000 ALTER TABLE `mem_info` DISABLE KEYS */;
INSERT INTO `mem_info` VALUES ('abcd1234','Password777','임세훈','쏘니',NULL,'010-1234-5678','user_name@domain.org','서울특별시 서초구 강남대로 331','회원','일반','브론즈','2024-12-30 15:39:42','2024-12-30 06:40:42',0,'abcd1234','2024-12-30 15:39:42',NULL,NULL),('abcd123456','password6','정성윤','아루',NULL,'010-2222-4334','rkdcjftkrhk123@gmail.com','인천시 남동구1','관리자','일반','브론즈','2024-12-30 11:51:37','2024-12-30 06:55:39',0,'관리자','2024-12-30 11:51:37',NULL,NULL),('admin123','qwer123','사용자1','닉네임1','1990-01-01','010-1111-1111','user01@example.com','서울시 강남구','관리자','일반','브론즈','2024-12-29 15:00:24','2024-12-30 05:01:28',0,'admin','2024-12-29 15:00:24',NULL,NULL),('user02','password2','삭제용계정','지워라','1991-02-02','010-2222-2222','user02@example.com','서울시 강북구','회원','일반','실버','2024-12-29 15:00:24','2024-12-30 01:36:41',0,'admin','2024-12-29 15:00:24',NULL,NULL),('user03','password3','이신협','네모박사','1992-03-03','010-3333-3333','user03@example.com','서울시 서초구','회원','블랙리스트','골드','2024-12-29 15:00:24','2024-12-29 14:24:27',0,'admin','2024-12-29 15:00:24',NULL,NULL),('user04','password4','김수훈','완벽','1993-04-04','010-4444-4444','user04@example.com','서울시 송파구','회원','일반','VIP','2024-12-29 15:00:24','2024-12-30 02:50:39',0,'admin','2024-12-29 15:00:24','',NULL),('user05','password5','정성윤','술고래','1994-05-05','010-5555-5555','user05@example.com','서울시 중구','회원','일반','브론즈','2024-12-29 15:00:24','2024-12-30 05:01:55',0,'admin','2024-12-29 15:00:24',NULL,NULL),('user07','password7','임세훈','임세바리','1996-07-07','010-7777-7777','user07@example.com','서울시 영등포구임','회원','일반','골드','2024-12-29 15:00:24','2024-12-31 08:20:14',9926040,'admin','2024-12-29 15:00:24',NULL,NULL),('user08','password8','한수연','쿼카녀석','1997-08-08','010-8888-8888','user08@example.com','서울시 노원구','회원','일반','VIP','2024-12-29 15:00:24','2024-12-30 01:36:27',0,'admin','2024-12-29 15:00:24','',NULL),('user09','password9','손주혜','천사','1998-09-09','010-8888-8888','user079@example.com','서울시 성동구8','관리자','일반','VIP','2024-12-29 15:00:24','2024-12-29 14:24:27',0,'admin','2024-12-29 15:00:24','',NULL),('user10','password10','이아람','다현','1999-10-10','010-1010-1010','user10@example.com','서울시 은평구','회원','일반','실버','2024-12-29 15:00:24','2024-12-29 14:24:27',0,'admin','2024-12-29 15:00:24',NULL,NULL),('user66','pasword66','정성윤','아루','2024-12-30','010-2222-4334','rkdcjftkrhk1234@gmail.com','인천시 남동구1','관리자','일반','브론즈','2024-12-30 15:55:34','2024-12-30 06:55:42',0,'관리자','2024-12-30 15:55:34',NULL,NULL);
/*!40000 ALTER TABLE `mem_info` ENABLE KEYS */;

--
-- Table structure for table `mileage`
--

DROP TABLE IF EXISTS `mileage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mileage` (
  `turn` int(11) NOT NULL AUTO_INCREMENT COMMENT '순서',
  `id` varchar(50) NOT NULL COMMENT '회원 아이디',
  `earn_date` datetime DEFAULT current_timestamp() COMMENT '적립 날짜',
  `description` text DEFAULT NULL COMMENT '적립 내용',
  `valid_date` date DEFAULT NULL COMMENT '유효 날짜',
  `change_val` int(11) NOT NULL COMMENT '변동 내역',
  `reg_id` varchar(60) DEFAULT NULL COMMENT '작성자',
  `reg_date` datetime DEFAULT current_timestamp() COMMENT '작성 일시',
  `upt_id` varchar(60) DEFAULT NULL COMMENT '수정자',
  `upt_date` datetime DEFAULT NULL COMMENT '수정 일시',
  PRIMARY KEY (`turn`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mileage`
--

/*!40000 ALTER TABLE `mileage` DISABLE KEYS */;
INSERT INTO `mileage` VALUES (1,'user07','2024-12-29 20:09:08','구매확정 마일리지 적립','2024-12-29',76773,'user07','2024-12-29 20:09:08',NULL,NULL),(2,'user07','2024-12-29 20:17:43','구매확정 마일리지 적립','2024-12-29',76773,'user07','2024-12-29 20:17:43',NULL,NULL),(3,'user07','2024-12-30 03:23:19','상품 구매 마일리지 사용','2024-12-30',-1800,'user07','2024-12-30 03:23:19',NULL,NULL),(4,'user01','2024-12-30 03:23:19','구매확정 마일리지 적립','2024-12-30',1000,'user01','2024-12-30 03:23:19',NULL,NULL),(5,'user02','2024-12-30 03:23:19','구매확정 마일리지 적립','2024-12-30',1000,'user02','2024-12-30 03:23:19',NULL,NULL),(6,'user03','2024-12-30 03:23:19','구매확정 마일리지 적립','2024-12-30',1000,'user03','2024-12-30 03:23:19',NULL,NULL),(7,'user04','2024-12-30 03:23:19','구매확정 마일리지 적립','2024-12-30',1000,'user04','2024-12-30 03:23:19',NULL,NULL),(8,'user05','2024-12-30 03:23:19','구매확정 마일리지 적립','2024-12-30',1000,'user05','2024-12-30 03:23:19',NULL,NULL),(9,'user06','2024-12-30 03:23:19','구매확정 마일리지 적립','2024-12-30',1000,'user06','2024-12-30 03:23:19',NULL,NULL),(10,'user08','2024-12-30 03:23:19','구매확정 마일리지 적립','2024-12-30',1000,'user08','2024-12-30 03:23:19',NULL,NULL),(11,'user09','2024-12-30 03:23:19','구매확정 마일리지 적립','2024-12-30',1000,'user09','2024-12-30 03:23:19',NULL,NULL),(12,'user10','2024-12-30 03:23:19','구매확정 마일리지 적립','2024-12-30',1000,'user10','2024-12-30 03:23:19',NULL,NULL),(13,'user07','2024-12-30 10:23:23','상품 구매 마일리지 사용','2024-12-30',-1000,'user07','2024-12-30 10:23:23',NULL,NULL),(14,'user07','2024-12-30 10:25:39','구매확정 마일리지 적립','2024-12-30',28060,'user07','2024-12-30 10:25:39',NULL,NULL),(15,'user07','2024-12-30 10:26:39','주문 취소로 인한 마일리지 반환','2024-12-30',1800,'system','2024-12-30 10:26:39',NULL,NULL),(16,'user07','2024-12-30 11:39:49','상품 구매 마일리지 사용','2024-12-30',-20000,'user07','2024-12-30 11:39:49',NULL,NULL),(17,'user07','2024-12-30 11:41:23','구매확정 마일리지 적립','2024-12-30',30400,'user07','2024-12-30 11:41:23',NULL,NULL),(18,'user07','2024-12-30 11:42:07','주문 취소로 인한 마일리지 반환','2024-12-30',3000,'system','2024-12-30 11:42:07',NULL,NULL),(19,'user07','2024-12-30 15:44:39','상품 구매 마일리지 사용','2024-12-30',-50000,'user07','2024-12-30 15:44:39',NULL,NULL),(20,'user07','2024-12-30 15:46:07','구매확정 마일리지 적립','2024-12-30',15580,'user07','2024-12-30 15:46:07',NULL,NULL),(21,'user07','2024-12-30 15:46:48','주문 취소로 인한 마일리지 반환','2024-12-30',20000,'system','2024-12-30 15:46:48',NULL,NULL),(22,'user07','2024-12-31 17:20:14','상품 구매 마일리지 사용','2024-12-31',-99999,'user07','2024-12-31 17:20:14',NULL,NULL);
/*!40000 ALTER TABLE `mileage` ENABLE KEYS */;

--
-- Table structure for table `opkey_value`
--

DROP TABLE IF EXISTS `opkey_value`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `opkey_value` (
  `main_code` int(11) NOT NULL COMMENT '상위 항목 고유 코드',
  `code` int(11) NOT NULL COMMENT '하위 값 고유 코드',
  `type` tinyint(1) NOT NULL COMMENT '옵션or키워드 구분',
  `name` varchar(100) NOT NULL COMMENT '값 명칭',
  `price` int(11) NOT NULL COMMENT '값 가격',
  `status` tinyint(1) NOT NULL COMMENT '사용 여부',
  `reg_id` varchar(60) NOT NULL COMMENT '등록자',
  `reg_date` datetime NOT NULL DEFAULT current_timestamp() COMMENT '등록 일시',
  `upt_id` varchar(60) DEFAULT NULL COMMENT '수정자',
  `upt_date` datetime DEFAULT NULL COMMENT '수정 일시',
  PRIMARY KEY (`main_code`,`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `opkey_value`
--

/*!40000 ALTER TABLE `opkey_value` DISABLE KEYS */;
INSERT INTO `opkey_value` VALUES (7,1,1,'초코초코',20000,1,'dc4638','2024-12-30 12:19:43','dc4638','2024-12-30 12:19:43'),(7,2,1,'나쁜짓을하면은~',45800,1,'dc4638','2024-12-30 12:19:56','dc4638','2024-12-30 12:19:56'),(8,1,0,'초록',10000,1,'dc4638','2024-12-30 15:41:48','dc4638','2024-12-30 15:41:48'),(8,2,0,'노랑',20000,1,'dc4638','2024-12-30 15:41:54','dc4638','2024-12-30 15:41:54');
/*!40000 ALTER TABLE `opkey_value` ENABLE KEYS */;

--
-- Table structure for table `option_keyword`
--

DROP TABLE IF EXISTS `option_keyword`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `option_keyword` (
  `code` int(11) NOT NULL AUTO_INCREMENT COMMENT '고유 코드 자동생성',
  `type` tinyint(1) NOT NULL COMMENT '옵션or키워드 구분',
  `name` varchar(100) NOT NULL COMMENT '명칭',
  `req` tinyint(1) NOT NULL COMMENT '필수 선택 여부',
  `status` tinyint(1) NOT NULL COMMENT '사용 여부',
  `reg_id` varchar(60) NOT NULL COMMENT '등록자',
  `reg_date` datetime NOT NULL DEFAULT current_timestamp() COMMENT '등록 일시',
  `upt_id` varchar(60) DEFAULT NULL COMMENT '수정자',
  `upt_date` datetime DEFAULT NULL COMMENT '수정 일시',
  PRIMARY KEY (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `option_keyword`
--

/*!40000 ALTER TABLE `option_keyword` DISABLE KEYS */;
INSERT INTO `option_keyword` VALUES (7,1,'치키차카',1,1,'wsj','2024-12-30 12:19:31','wsj','2024-12-30 14:04:07'),(8,0,'컬러',0,1,'wsj','2024-12-30 15:41:38','wsj','2024-12-30 15:41:38');
/*!40000 ALTER TABLE `option_keyword` ENABLE KEYS */;

--
-- Table structure for table `order`
--

DROP TABLE IF EXISTS `order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order` (
  `order_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '주문 번호',
  `member_id` varchar(50) NOT NULL COMMENT '회원 ID (FK)',
  `order_date` datetime NOT NULL DEFAULT current_timestamp() COMMENT '주문 일자',
  `pay_method` enum('휴대폰','신용카드') NOT NULL COMMENT '결제 수단',
  `mileage_used` int(11) DEFAULT 0 COMMENT '사용 마일리지',
  `mileage_id` int(11) DEFAULT NULL COMMENT '마일리지 ID',
  `is_confirmed` char(1) DEFAULT 'N' COMMENT '구매 확정 여부 (Y/N)',
  `total_price` int(11) NOT NULL COMMENT '총 금액',
  `receiver_name` varchar(50) NOT NULL COMMENT '수령자 이름',
  `receiver_phone` varchar(20) NOT NULL COMMENT '수령자 전화번호',
  `receiver_address` varchar(255) NOT NULL COMMENT '수령자 주소',
  `reg_id` varchar(50) NOT NULL COMMENT '작성자',
  `reg_date` datetime NOT NULL DEFAULT current_timestamp() COMMENT '작성일시',
  `upt_id` varchar(50) DEFAULT NULL COMMENT '수정자',
  `upt_date` datetime DEFAULT NULL COMMENT '수정일시',
  PRIMARY KEY (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order`
--

/*!40000 ALTER TABLE `order` DISABLE KEYS */;
INSERT INTO `order` VALUES (1,'user07','2024-12-29 15:18:45','신용카드',3000,NULL,'N',202224,'임세훈가','02-579-6262','어딘가임','user07','2024-12-29 15:18:45',NULL,NULL),(2,'user07','2024-12-29 18:26:25','신용카드',3000,NULL,'N',128333,'임세훈','02-579-6269','어딘가','user07','2024-12-29 18:26:25',NULL,NULL),(3,'user07','2024-12-29 19:59:41','신용카드',3000,NULL,'Y',767730,'임세훈','02-579-6269','어딘가','user07','2024-12-29 19:59:41',NULL,NULL),(4,'user07','2024-12-29 22:55:47','신용카드',3000,NULL,'N',2639100,'임세훈','02-579-6269','어딘가','abcd1234','2024-12-29 22:55:47',NULL,NULL),(5,'user07','2023-12-01 10:00:00','신용카드',1000,1,'Y',50000,'홍길동','010-1234-5678','서울특별시 강남구 123-45','admin','2024-12-29 23:18:21',NULL,NULL),(6,'user07','2023-10-02 11:00:00','휴대폰',500,2,'N',30000,'김철수','010-9876-5432','부산광역시 해운대구 456-78','admin','2024-12-29 23:18:21',NULL,NULL),(7,'user07','2023-12-03 12:00:00','신용카드',2000,3,'N',100000,'이영희','010-1357-2468','대구광역시 달서구 789-12','admin','2024-12-29 23:18:21',NULL,NULL),(8,'user07','2023-11-04 13:00:00','휴대폰',3000,NULL,'N',45000,'박수진','010-2468-1357','인천광역시 남동구 345-67','admin','2024-12-29 23:18:21',NULL,NULL),(9,'user07','2023-09-05 14:00:00','신용카드',1500,4,'Y',75000,'최영수','010-1122-3344','대전광역시 서구 567-89','admin','2024-12-29 23:18:21',NULL,NULL),(10,'user07','2022-12-06 15:00:00','휴대폰',1000,5,'N',60000,'오혜진','010-5566-7788','광주광역시 북구 901-23','admin','2024-12-29 23:18:21',NULL,NULL),(11,'user07','2023-12-07 16:00:00','신용카드',2000,6,'Y',120000,'강민호','010-8899-1122','울산광역시 중구 345-12','admin','2024-12-29 23:18:21',NULL,NULL),(12,'user07','2021-12-08 17:00:00','휴대폰',500,NULL,'N',25000,'김혜수','010-2233-4455','경기도 성남시 분당구 567-34','admin','2024-12-29 23:18:21',NULL,NULL),(13,'user06','2023-12-09 18:00:00','신용카드',3000,7,'Y',95000,'정은지','010-6677-8899','경기도 수원시 영통구 123-45','admin','2024-12-29 23:18:21',NULL,NULL),(14,'user06','2023-12-10 19:00:00','휴대폰',1000,8,'N',40000,'이진호','010-7788-9911','충청북도 청주시 상당구 234-56','admin','2024-12-29 23:18:21',NULL,NULL),(15,'user06','2023-12-11 10:30:00','신용카드',2500,9,'Y',85000,'홍수정','010-9988-7766','경상남도 창원시 의창구 789-12','admin','2024-12-29 23:18:21',NULL,NULL),(16,'user06','2023-12-12 11:30:00','휴대폰',3000,NULL,'N',32000,'박민지','010-3344-5566','경상북도 포항시 북구 456-78','admin','2024-12-29 23:18:21',NULL,NULL),(17,'user06','2023-12-13 12:30:00','신용카드',3000,10,'Y',105000,'오준석','010-6655-7788','전라남도 목포시 상동 123-45','admin','2024-12-29 23:18:21',NULL,NULL),(18,'user06','2023-12-14 13:30:00','휴대폰',500,NULL,'N',28000,'최서영','010-9900-1122','전라북도 전주시 덕진구 567-89','admin','2024-12-29 23:18:21',NULL,NULL),(19,'user06','2023-12-15 14:30:00','신용카드',1000,11,'Y',48000,'강지훈','010-8811-2233','제주특별자치도 제주시 901-23','admin','2024-12-29 23:18:21',NULL,NULL),(20,'user06','2023-12-16 15:30:00','휴대폰',3000,NULL,'N',31000,'윤하나','010-4455-6677','서울특별시 서초구 789-34','admin','2024-12-29 23:18:21',NULL,NULL),(21,'user06','2023-12-17 16:30:00','신용카드',4000,12,'Y',140000,'이성호','010-5566-7788','부산광역시 수영구 345-67','admin','2024-12-29 23:18:21',NULL,NULL),(22,'user06','2023-12-18 17:30:00','휴대폰',2000,NULL,'N',70000,'박서현','010-6677-8899','대구광역시 북구 123-12','admin','2024-12-29 23:18:21',NULL,NULL),(23,'user06','2023-12-19 18:30:00','신용카드',3000,NULL,'Y',45000,'김도훈','010-7788-9911','인천광역시 계양구 234-56','admin','2024-12-29 23:18:21',NULL,NULL),(24,'user06','2023-12-20 19:30:00','휴대폰',3000,13,'Y',95000,'강은주','010-1122-3344','경기도 용인시 수지구 345-78','admin','2024-12-29 23:18:21',NULL,NULL),(26,'user07','2024-12-30 03:23:19','신용카드',1800,NULL,'N',534000,'임세훈','02-579-6269','어딘가','user07','2024-12-30 03:23:19',NULL,NULL),(27,'user07','2024-12-30 10:23:23','신용카드',1000,NULL,'Y',280600,'임세훈','02-579-6269','어딘가','user07','2024-12-30 10:23:23',NULL,NULL),(28,'user07','2024-12-30 11:39:49','신용카드',20000,NULL,'Y',304000,'정성윤','02-579-6261','지구안에','user07','2024-12-30 11:39:49',NULL,NULL),(29,'user07','2024-12-30 15:44:39','신용카드',50000,NULL,'Y',155800,'정성윤','02-579-6261','우리집','user07','2024-12-30 15:44:39',NULL,NULL),(30,'user07','2024-12-31 17:20:14','신용카드',99999,NULL,'N',877400,'임세훈','02-579-6269','어딘가','user07','2024-12-31 17:20:14',NULL,NULL);
/*!40000 ALTER TABLE `order` ENABLE KEYS */;

--
-- Table structure for table `order_product`
--

DROP TABLE IF EXISTS `order_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_product` (
  `order_product_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '주문상품 ID',
  `order_id` int(11) NOT NULL COMMENT '주문번호',
  `product_id` varchar(14) NOT NULL COMMENT '상품 ID',
  `quantity` int(11) NOT NULL COMMENT '수량',
  `unit_price` int(11) NOT NULL COMMENT '낱개 금액',
  `options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '상품 옵션 정보' CHECK (json_valid(`options`)),
  `reg_id` varchar(50) NOT NULL COMMENT '작성자',
  `reg_date` datetime NOT NULL DEFAULT current_timestamp() COMMENT '작성 일시',
  `upt_id` varchar(50) DEFAULT NULL COMMENT '수정자',
  `upt_date` datetime DEFAULT NULL COMMENT '수정 일시',
  PRIMARY KEY (`order_product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_product`
--

/*!40000 ALTER TABLE `order_product` DISABLE KEYS */;
INSERT INTO `order_product` VALUES (2,2,'K1735452945165',2,101112,NULL,'user07','2024-12-29 15:18:45',NULL,NULL),(3,3,'K1735453892541',1,128333,NULL,'user07','2024-12-29 18:26:25',NULL,NULL),(4,4,'K1735465782107',3,255910,NULL,'user07','2024-12-29 19:59:41',NULL,NULL),(5,5,'K1735465782107',3,250910,NULL,'abcd1234','2024-12-29 22:55:47',NULL,NULL),(6,5,'K1735465782107',2,255910,NULL,'abcd1234','2024-12-29 22:55:47',NULL,NULL),(7,5,'K1735465782107',1,250910,NULL,'abcd1234','2024-12-29 22:55:47',NULL,NULL),(8,5,'K1735465782107',2,255910,NULL,'abcd1234','2024-12-29 22:55:47',NULL,NULL),(9,5,'K1735465782107',2,305910,NULL,'abcd1234','2024-12-29 22:55:47',NULL,NULL),(10,6,'K1735465782107',2,150000,NULL,'user07','2024-12-29 22:55:47',NULL,NULL),(11,7,'K1735465782107',1,150000,NULL,'user07','2024-12-29 22:55:47',NULL,NULL),(13,8,'K1735465782107',3,245000,NULL,'user07','2024-12-29 22:55:47',NULL,NULL),(14,9,'K1735465782107',2,245000,NULL,'user07','2024-12-29 22:55:47',NULL,NULL),(15,10,'K1735465782107',1,245000,NULL,'user07','2024-12-29 22:55:47',NULL,NULL),(16,11,'K1735465782107',3,245000,NULL,'user07','2024-12-29 22:55:47',NULL,NULL),(17,12,'K1735465782107',2,245000,NULL,'user07','2024-12-29 22:55:47',NULL,NULL),(18,13,'K1735465782107',1,245000,NULL,'user07','2024-12-29 22:55:47',NULL,NULL),(19,14,'K1735465782107',3,245000,NULL,'user07','2024-12-29 22:55:47',NULL,NULL),(20,15,'K1735465782107',2,369000,NULL,'user07','2024-12-29 22:55:47',NULL,NULL),(21,16,'K1735465782107',1,369000,NULL,'user07','2024-12-29 22:55:47',NULL,NULL),(22,17,'K1735465782107',2,369000,NULL,'user07','2024-12-29 22:55:47',NULL,NULL),(23,18,'K1735465782107',1,369000,NULL,'user07','2024-12-29 22:55:47',NULL,NULL),(24,19,'K1735465782107',3,489000,NULL,'user07','2024-12-29 22:55:47',NULL,NULL),(25,20,'K1735465782107',3,489000,NULL,'user07','2024-12-29 22:55:47',NULL,NULL),(26,21,'K1735465782107',2,489000,NULL,'user07','2024-12-29 22:55:47',NULL,NULL),(27,22,'K1735465782107',4,489000,NULL,'user07','2024-12-29 22:55:47',NULL,NULL),(28,26,'K1735464804164',3,178000,NULL,'user07','2024-12-30 03:23:19',NULL,NULL),(29,27,'K1735521454617',2,140300,NULL,'user07','2024-12-30 10:23:23',NULL,NULL),(30,28,'K1735526239117',2,152000,NULL,'user07','2024-12-30 11:39:49',NULL,NULL),(31,29,'K1735540952174',1,155800,NULL,'user07','2024-12-30 15:44:39',NULL,NULL),(32,30,'K1735540952174',3,130000,NULL,'user07','2024-12-31 17:20:14',NULL,NULL),(33,30,'K1735540952174',2,165800,NULL,'user07','2024-12-31 17:20:14',NULL,NULL),(34,30,'K1735540952174',1,155800,NULL,'user07','2024-12-31 17:20:14',NULL,NULL);
/*!40000 ALTER TABLE `order_product` ENABLE KEYS */;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` varchar(14) NOT NULL COMMENT '고유 id',
  `name` varchar(100) NOT NULL COMMENT '상품명',
  `price` int(11) NOT NULL COMMENT '상품 가격',
  `discount` int(11) DEFAULT NULL COMMENT '할인율',
  `detail_exist` tinyint(1) NOT NULL COMMENT '상세 이미지 유무',
  `quan` int(11) NOT NULL COMMENT '등록 재고 수량',
  `status` tinyint(1) NOT NULL COMMENT '사용 여부',
  `benefit` text DEFAULT NULL COMMENT '혜택',
  `reg_id` varchar(60) NOT NULL COMMENT '등록자',
  `reg_date` datetime NOT NULL DEFAULT current_timestamp() COMMENT '등록 일시',
  `upt_id` varchar(60) DEFAULT NULL COMMENT '수정자',
  `upt_date` datetime DEFAULT NULL COMMENT '수정 일시',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES ('K1735540952174','상품1번',100000,0,0,100,1,'','admin','2024-12-30 15:42:32',NULL,NULL);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;

--
-- Table structure for table `product_detail`
--

DROP TABLE IF EXISTS `product_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_detail` (
  `main_code` int(11) NOT NULL COMMENT '상위 option_keyword 코드',
  `code` int(11) NOT NULL COMMENT 'opkey_value 고유 코드',
  `id` varchar(14) NOT NULL COMMENT '고유 products id',
  `turn` int(11) NOT NULL COMMENT '순서',
  `type` char(1) NOT NULL COMMENT '옵션or키워드 구분',
  `reg_id` varchar(60) NOT NULL COMMENT '등록자',
  `reg_date` datetime NOT NULL DEFAULT current_timestamp() COMMENT '등록 일시',
  `upt_id` varchar(60) DEFAULT NULL COMMENT '수정자',
  `upt_date` datetime DEFAULT NULL COMMENT '수정 일시',
  PRIMARY KEY (`main_code`,`code`,`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_detail`
--

/*!40000 ALTER TABLE `product_detail` DISABLE KEYS */;
INSERT INTO `product_detail` VALUES (1,1,'111',1,'C','user07','2024-12-29 15:16:39',NULL,NULL),(1,1,'K1735452945165',2,'1','admin','2024-12-29 15:15:45',NULL,NULL),(1,2,'K1735452945165',1,'1','admin','2024-12-29 15:15:45',NULL,NULL),(1,2,'하하하',2,'L','user07','2024-12-29 15:16:39',NULL,NULL),(2,1,'K1735452945165',3,'0','admin','2024-12-29 15:15:45',NULL,NULL),(2,1,'K1735453892541',3,'0','admin','2024-12-29 15:31:32',NULL,NULL),(2,1,'하하하',1,'C','user06','2024-12-29 15:32:16',NULL,NULL),(2,2,'K1735453892541',4,'0','admin','2024-12-29 15:31:32',NULL,NULL),(2,2,'초코초코',2,'L','user06','2024-12-29 15:32:16',NULL,NULL),(3,1,'K1735453892541',1,'1','admin','2024-12-29 15:31:32',NULL,NULL),(3,1,'K1735464804164',1,'1','admin','2024-12-29 18:33:24',NULL,NULL),(3,1,'K1735465782107',1,'1','admin','2024-12-29 18:49:42',NULL,NULL),(3,1,'파파파',1,'C','user06','2024-12-29 15:32:16',NULL,NULL),(3,2,'K1735453892541',2,'1','admin','2024-12-29 15:31:32',NULL,NULL),(3,2,'K1735464804164',2,'1','admin','2024-12-29 18:33:24',NULL,NULL),(3,2,'K1735465782107',2,'1','admin','2024-12-29 18:49:42',NULL,NULL),(3,2,'나쁜짓을 하면은~',2,'L','user06','2024-12-29 15:32:16',NULL,NULL),(4,1,'K1735464804164',3,'0','admin','2024-12-29 18:33:24',NULL,NULL),(4,1,'K1735465782107',3,'0','admin','2024-12-29 18:49:42',NULL,NULL),(4,1,'K1735521454617',3,'0','admin','2024-12-30 10:17:34',NULL,NULL),(4,1,'K1735526239117',3,'0','admin','2024-12-30 11:37:19',NULL,NULL),(4,1,'파파파',1,'C','user06','2024-12-29 17:18:48',NULL,NULL),(4,2,'K1735464804164',4,'0','admin','2024-12-29 18:33:24',NULL,NULL),(4,2,'K1735465782107',4,'0','admin','2024-12-29 18:49:42',NULL,NULL),(4,2,'K1735521454617',4,'0','admin','2024-12-30 10:17:34',NULL,NULL),(4,2,'K1735526239117',4,'0','admin','2024-12-30 11:37:19',NULL,NULL),(4,2,'나쁜짓을 하면은~',2,'L','user06','2024-12-29 17:18:48',NULL,NULL),(5,1,'K1735521454617',2,'1','admin','2024-12-30 10:17:34',NULL,NULL),(5,1,'하하하',1,'C','user07','2024-12-29 18:26:18',NULL,NULL),(5,2,'K1735521454617',1,'1','admin','2024-12-30 10:17:34',NULL,NULL),(5,2,'나쁜짓을 하면은~',2,'L','user07','2024-12-29 18:26:18',NULL,NULL),(6,1,'K1735526239117',1,'1','admin','2024-12-30 11:37:19',NULL,NULL),(6,1,'나쁜짓을 하면은~',1,'C','user07','2024-12-29 19:53:30',NULL,NULL),(6,2,'K1735526239117',2,'1','admin','2024-12-30 11:37:19',NULL,NULL),(6,2,'아닌듯',2,'L','user07','2024-12-29 19:53:30',NULL,NULL),(7,1,'K1735540952174',3,'0','admin','2024-12-30 15:42:32',NULL,NULL),(7,1,'나쁜짓을 하면은~',1,'C','user07','2024-12-29 19:53:30',NULL,NULL),(7,2,'K1735540952174',4,'0','admin','2024-12-30 15:42:32',NULL,NULL),(7,2,'그런듯',2,'L','user07','2024-12-29 19:53:30',NULL,NULL),(8,1,'K1735540952174',1,'1','admin','2024-12-30 15:42:32',NULL,NULL),(8,1,'나쁜짓을 하면은~',1,'C','abcd1234','2024-12-29 22:43:46',NULL,NULL),(8,2,'K1735540952174',2,'1','admin','2024-12-30 15:42:32',NULL,NULL),(8,2,'아닌듯',2,'L','abcd1234','2024-12-29 22:43:46',NULL,NULL),(9,1,'나쁜짓을 하면은~',1,'C','abcd1234','2024-12-29 22:43:46',NULL,NULL),(9,2,'그런듯',2,'L','abcd1234','2024-12-29 22:43:46',NULL,NULL),(10,1,'나쁜짓을 하면은~',1,'C','abcd1234','2024-12-29 22:51:40',NULL,NULL),(10,2,'아닌듯',2,'L','abcd1234','2024-12-29 22:51:40',NULL,NULL),(11,1,'나쁜짓을 하면은~',1,'C','abcd1234','2024-12-29 22:55:34',NULL,NULL),(11,2,'그런듯',2,'L','abcd1234','2024-12-29 22:55:34',NULL,NULL),(12,1,'초코초코',1,'C','abcd1234','2024-12-29 22:55:34',NULL,NULL),(12,2,'그런듯',2,'L','abcd1234','2024-12-29 22:55:34',NULL,NULL),(13,1,'나쁜짓을 하면은~',1,'C','user07','2024-12-30 03:23:08',NULL,NULL),(13,2,'그런듯',2,'L','user07','2024-12-30 03:23:08',NULL,NULL),(14,1,'그런듯',1,'C','abcd1234','2024-12-30 10:20:23',NULL,NULL),(14,2,'누누나나',2,'L','abcd1234','2024-12-30 10:20:23',NULL,NULL),(15,1,'그런듯',1,'C','abcd1234','2024-12-30 10:20:23',NULL,NULL),(15,2,'가나다라',2,'L','abcd1234','2024-12-30 10:20:23',NULL,NULL),(16,1,'그런듯',1,'C','user07','2024-12-30 10:22:37',NULL,NULL),(16,2,'누누나나',2,'L','user07','2024-12-30 10:22:37',NULL,NULL),(17,1,'그런듯',1,'C','user07','2024-12-30 10:22:37',NULL,NULL),(17,2,'가나다라',2,'L','user07','2024-12-30 10:22:37',NULL,NULL),(18,1,'그런듯',1,'C','user07','2024-12-30 10:24:32',NULL,NULL),(18,2,'누누나나',2,'L','user07','2024-12-30 10:24:32',NULL,NULL),(19,1,'그런듯',1,'C','user07','2024-12-30 11:38:40',NULL,NULL),(19,2,'그만보라고',2,'L','user07','2024-12-30 11:38:40',NULL,NULL),(20,1,'그런듯',1,'C','user07','2024-12-30 11:38:40',NULL,NULL),(20,2,'뒤에거기',2,'L','user07','2024-12-30 11:38:40',NULL,NULL),(21,1,'초코초코',1,'C','user07','2024-12-30 15:43:45',NULL,NULL),(21,2,'노랑',2,'L','user07','2024-12-30 15:43:45',NULL,NULL),(22,1,'나쁜짓을하면은~',1,'C','user07','2024-12-30 15:43:45',NULL,NULL),(22,2,'초록',2,'L','user07','2024-12-30 15:43:45',NULL,NULL),(23,1,'초코초코',1,'C','user07','2024-12-31 16:38:42',NULL,NULL),(23,2,'초록',2,'L','user07','2024-12-31 16:38:42',NULL,NULL),(24,1,'나쁜짓을하면은~',1,'C','user07','2024-12-31 16:38:42',NULL,NULL),(24,2,'노랑',2,'L','user07','2024-12-31 16:38:42',NULL,NULL),(25,1,'나쁜짓을하면은~',1,'C','user07','2024-12-31 16:38:42',NULL,NULL),(25,2,'초록',2,'L','user07','2024-12-31 16:38:42',NULL,NULL);
/*!40000 ALTER TABLE `product_detail` ENABLE KEYS */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-01-06 14:34:33


INSERT INTO mem_info (
  id, pw, name, nick, email, role, type, level, reg_id
) VALUES (
  'kakao_12345678', -- 카카오 고유 ID를 활용한 회원 ID
  '',               -- 비밀번호는 공백 또는 더미 값으로 처리
  '홍길동',           -- 카카오 사용자 이름
  '길동',            -- 카카오 사용자 닉네임
  'hong@example.com', -- 카카오 사용자 이메일
  '회원',            -- 기본 회원 역할
  '일반',            -- 기본 회원 구분
  '브론즈',          -- 기본 회원 등급
  'system'          -- 작성자는 시스템으로 설정
);

CREATE TABLE showrooms (
    id INT AUTO_INCREMENT PRIMARY KEY,       -- 고유 ID, 자동 증가
    name VARCHAR(255) NOT NULL,             -- 쇼룸 이름
    address VARCHAR(255) NOT NULL,          -- 주소
    phone VARCHAR(20),                      -- 전화번호
    hours VARCHAR(50),                      -- 영업 시간
    image VARCHAR(255),                     -- 이미지 경로 또는 URL
    lat DECIMAL(10, 8) NOT NULL,            -- 위도
    lng DECIMAL(11, 8) NOT NULL             -- 경도
);
INSERT INTO showrooms (name, address, phone, hours, image, lat, lng)
VALUES
('인천하늘점', '인천광역시 남동구 하늘로 10', '032-111-1234', '09:00-21:00', 'https://example.com/images/sky.jpg', 37.445687, 126.704544),
('인천공룡점', '인천광역시 남동구 공룡로 20', '032-222-1234', '10:00-22:00', 'https://example.com/images/dino.jpg', 37.448923, 126.707456),
('인천바다점', '인천광역시 남동구 바다로 30', '032-333-1234', '08:00-20:00', 'https://example.com/images/sea.jpg', 37.442876, 126.710234),
('인천별점', '인천광역시 남동구 별로 40', '032-444-1234', '09:30-22:30', 'https://example.com/images/star.jpg', 37.450123, 126.702345),
('인천숲점', '인천광역시 남동구 숲로 50', '032-555-1234', '09:00-19:00', 'https://example.com/images/forest.jpg', 37.447654, 126.705678),
('인천꽃점', '인천광역시 남동구 꽃로 60', '032-666-1234', '10:00-20:00', 'https://example.com/images/flower.jpg', 37.446789, 126.709876),
('인천해변점', '인천광역시 남동구 해변로 70', '032-777-1234', '08:00-21:00', 'https://example.com/images/beach.jpg', 37.449876, 126.706543),
('인천산점', '인천광역시 남동구 산로 80', '032-888-1234', '09:00-18:00', 'https://example.com/images/mountain.jpg', 37.451234, 126.703212),
('인천호수점', '인천광역시 남동구 호수로 90', '032-999-1234', '10:00-22:00', 'https://example.com/images/lake.jpg', 37.443987, 126.708976),
('인천구름점', '인천광역시 남동구 구름로 100', '032-101-1234', '09:00-20:30', 'https://example.com/images/cloud.jpg', 37.444321, 126.707654);