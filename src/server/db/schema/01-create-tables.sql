-- /db/schema/01_create_tables.sql

CREATE TABLE devices (
  id INT PRIMARY KEY AUTO_INCREMENT,
  deviceName VARCHAR(255) NOT NULL,
  deviceType VARCHAR(255) NOT NULL,
  ownerName VARCHAR(255) NOT NULL,
  batteryStatus: INT NOT NULL,
);