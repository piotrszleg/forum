CREATE DATABASE forum;
USE forum;
CREATE TABLE posts (
    id INT NOT NULL AUTO_INCREMENT,
    parent INT,
    message CHAR(100) NOT NULL,
    PRIMARY KEY (id)
);