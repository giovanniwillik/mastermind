-- Create ENUM type for GameStatus
CREATE TYPE game_status AS ENUM ('IN_PROGRESS', 'WON', 'LOST');

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    best_score INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create games table
CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    game_code UUID NOT NULL UNIQUE,
    user_id INTEGER NOT NULL,
    expected_code VARCHAR(4) NOT NULL,
    status game_status NOT NULL DEFAULT 'IN_PROGRESS',
    final_score INTEGER NOT NULL DEFAULT 0,
    duration_seconds INTEGER NOT NULL DEFAULT 0,
    max_attempts INTEGER NOT NULL DEFAULT 10,
    current_attempt INTEGER NOT NULL DEFAULT 0,
    started_at TIMESTAMP NOT NULL,
    finished_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create attempts table
CREATE TABLE attempts (
    id SERIAL PRIMARY KEY,
    game_id INTEGER NOT NULL,
    attempt_number INTEGER NOT NULL,
    guess VARCHAR(4) NOT NULL,
    exact_matches INTEGER NOT NULL DEFAULT 0,
    partial_matches INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX idx_games_user_id ON games(user_id);
CREATE INDEX idx_games_status ON games(status);
CREATE INDEX idx_attempts_game_id ON attempts(game_id);
CREATE INDEX idx_users_username ON users(username);
