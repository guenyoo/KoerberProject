CREATE DATABASE IF NOT EXISTS devices;
USE devices;

CREATE TABLE IF NOT EXISTS devices (
  id INT PRIMARY KEY AUTO_INCREMENT,
  deviceName VARCHAR(255) NOT NULL,
  deviceType VARCHAR(255) NOT NULL,
  ownerName VARCHAR(255) NOT NULL,
  batteryStatus INT NOT NULL
);
