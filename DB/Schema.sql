USE bo0qdeicu7wycnbnek7j;


CREATE TABLE IF NOT EXISTS roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(60) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- hashed password
    role_id INT NOT NULL,
    FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS vacancies (
    vacancy_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    salary DECIMAL(10,2),
    status ENUM('open','closed','paused') DEFAULT 'closed',
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS candidates (
    candidate_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150),
    email VARCHAR(255) UNIQUE,
    date_of_birth DATE,
    occupation VARCHAR(100),
    summary TEXT,
    experience JSON,
    skills JSON,
    languages JSON,
    education JSON,
    notes TEXT
);

CREATE TABLE IF NOT EXISTS applications (
    application_id INT AUTO_INCREMENT PRIMARY KEY,
    application_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending','interview','offered','accepted','rejected') DEFAULT 'rejected',
    ai_reason TEXT,
    candidate_id INT,
    vacancy_id INT,
    FOREIGN KEY (candidate_id) REFERENCES candidates(candidate_id) ON DELETE SET NULL,
    FOREIGN KEY (vacancy_id) REFERENCES vacancies(vacancy_id) ON DELETE SET NULL,
    UNIQUE (candidate_id, vacancy_id)
);

CREATE TABLE IF NOT EXISTS candidate_shares (
    share_id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT,
    sender_id INT,
    receiver_id INT,
    application_id INT,
    vacancy_id INT,
    status ENUM('pending','accepted','rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (candidate_id) REFERENCES candidates(candidate_id) ON DELETE SET NULL,
    FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (receiver_id) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (application_id) REFERENCES applications(application_id) ON DELETE SET NULL,
    FOREIGN KEY (vacancy_id) REFERENCES vacancies(vacancy_id) ON DELETE SET NULL,
    UNIQUE (candidate_id, sender_id, receiver_id, application_id, vacancy_id)
);
