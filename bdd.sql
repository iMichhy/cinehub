CREATE database cinehub;
USE cinehub;

CREATE USER IF NOT EXISTS 'cinehub'@'%' IDENTIFIED BY 'cinehub';

GRANT SELECT,UPDATE,INSERT,DELETE ON cinehub.* TO 'cinehub'@'%';

FLUSH PRIVILEGES;

CREATE TABLE users (
us_id INT AUTO_INCREMENT PRIMARY KEY,
us_username VARCHAR(255) NOT NULL UNIQUE,
us_password TEXT NOT NULL,
us_email VARCHAR(255) NOT NULL UNIQUE,
us_role ENUM('user', 'admin') NOT NULL DEFAULT 'user'
);

CREATE TABLE films (
fi_id INT AUTO_INCREMENT PRIMARY KEY,
fi_title VARCHAR(255) NOT NULL,
fi_description TEXT,
fi_duration INT NOT NULL,
fi_genre VARCHAR(100),
fi_release_date DATE,
fi_is_showing TINYINT(1) NOT NULL DEFAULT 1
);

CREATE TABLE rooms (
ro_id INT AUTO_INCREMENT PRIMARY KEY,
ro_name VARCHAR(100) NOT NULL UNIQUE,
ro_capacity INT NOT NULL
);

CREATE TABLE screenings (
sc_id INT AUTO_INCREMENT PRIMARY KEY,
sc_film INT NOT NULL,
sc_room INT NOT NULL,
sc_datetime DATETIME NOT NULL,
sc_price DECIMAL(6,2) NOT NULL,
CONSTRAINT fk_screenings_film FOREIGN KEY (sc_film) REFERENCES films(fi_id),
CONSTRAINT fk_screenings_room FOREIGN KEY (sc_room) REFERENCES rooms(ro_id)
);

CREATE TABLE reservations (
re_id INT AUTO_INCREMENT PRIMARY KEY,
re_user INT NOT NULL,
re_screening INT NOT NULL,
re_seats INT NOT NULL DEFAULT 1,
re_created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT fk_reservations_user FOREIGN KEY (re_user) REFERENCES users(us_id),
CONSTRAINT fk_reservations_screening FOREIGN KEY (re_screening) REFERENCES screenings(sc_id),
CONSTRAINT uq_user_screening UNIQUE (re_user, re_screening)
);

INSERT INTO users (us_username, us_password, us_email, us_role) VALUES
('admin', '$2b$10$w19i6J2DssDNbIG6nlqrk.BGl28AZJATzUHhSZhqzWpg9t1mNcL7i', 'admin@cinehub.fr', 'admin');

INSERT INTO films (fi_title, fi_description, fi_duration, fi_genre, fi_release_date, fi_is_showing) VALUES
('Inception', 'Un voleur s''infiltre dans les rêves.', 148, 'Science-fiction', '2010-07-21', 1),
('Shutter Island', 'En 1954, un marshal enquête sur la disparition d''une patiente dans un hôpital psychiatrique isolé.', 138, 'Thriller', '2010-02-24', 1),
('Avengers : Endgame', 'Les Avengers tentent de réparer les dégâts causés par Thanos.', 181, 'Action', '2019-04-24', 1),
('Bienvenue chez les Ch''tis', 'Un directeur de poste est muté dans le Nord et y découvre une région pleine de surprises.', 106, 'Comédie', '2008-02-27', 0);

INSERT INTO rooms (ro_name, ro_capacity) VALUES
('Salle 1', 120),
('Salle 2', 80),
('Salle 3', 40);

INSERT INTO screenings (sc_film, sc_room, sc_datetime, sc_price) VALUES
(1, 1, '2026-12-01 20:30:00', 9.50),
(1, 2, '2026-12-02 18:00:00', 8.00),
(2, 1, '2026-12-03 21:00:00', 10.00),
(2, 3, '2026-12-04 17:30:00', 7.50),
(3, 2, '2026-12-05 20:00:00', 12.5);