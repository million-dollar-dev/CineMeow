-- =============================================================================
-- Flyway Migration: V1__init_core_schema.sql
-- Description: Initial database schema for CineMeow Unified Core Services
-- Modules included: movie-service, cinema-service, profile-service,
--                   showtime-service, promotion-service
-- =============================================================================

-- Extension for UUID generation if needed
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- -----------------------------------------------------------------------------
-- 1. Movie Service Domain
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS genres (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS movies (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR(36),
    title VARCHAR(255) NOT NULL,
    rating VARCHAR(50) NOT NULL,
    backdrop_path VARCHAR(255),
    country VARCHAR(100),
    original_language VARCHAR(50),
    overview TEXT,
    poster_path VARCHAR(255),
    trailer_url VARCHAR(255),
    release_date DATE NOT NULL,
    duration INTEGER,
    status VARCHAR(50) NOT NULL,
    tagline VARCHAR(255),
    subtitle VARCHAR(255),
    director VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS movie_genres (
    movie_id VARCHAR(36) NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    genre_id INTEGER NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
    PRIMARY KEY (movie_id, genre_id)
);

CREATE TABLE IF NOT EXISTS movie_casts (
    movie_id VARCHAR(36) NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    casts VARCHAR(255)
);

-- -----------------------------------------------------------------------------
-- 2. Cinema Service Domain
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cinema_brands (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR(36),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    logo_url VARCHAR(255),
    employee_count INTEGER DEFAULT 0,
    background_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS cinemas (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR(36),
    name VARCHAR(255) NOT NULL,
    address VARCHAR(500) NOT NULL,
    city VARCHAR(100),
    brand_id VARCHAR(36) REFERENCES cinema_brands(id) ON DELETE SET NULL,
    image_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS rooms (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR(36),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50),
    status VARCHAR(50),
    cinema_id VARCHAR(36) REFERENCES cinemas(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS seats (
    id BIGSERIAL PRIMARY KEY,
    row_index INTEGER NOT NULL,
    column_index INTEGER NOT NULL,
    label VARCHAR(50),
    status VARCHAR(50),
    type VARCHAR(50),
    room_id VARCHAR(36) REFERENCES rooms(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS fnb_items (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR(36),
    cinema_brand_id VARCHAR(36) REFERENCES cinema_brands(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(255) NOT NULL,
    available BOOLEAN DEFAULT TRUE,
    price NUMERIC(15, 2),
    category VARCHAR(50) NOT NULL
);

-- -----------------------------------------------------------------------------
-- 3. Profile Service Domain
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_profiles (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR(36),
    user_id VARCHAR(36) UNIQUE,
    phone_number VARCHAR(50) UNIQUE,
    email VARCHAR(255)
);

-- -----------------------------------------------------------------------------
-- 4. Showtime Service Domain
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS show_times (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR(36),
    movie_id VARCHAR(36) NOT NULL,
    room_id VARCHAR(36) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'AVAILABLE'
);

CREATE TABLE IF NOT EXISTS showtime_seat (
    id BIGSERIAL PRIMARY KEY,
    showtime_id VARCHAR(36),
    seat_id BIGINT,
    label VARCHAR(50),
    type VARCHAR(50),
    status VARCHAR(50),
    reserved_until TIMESTAMP,
    booking_id VARCHAR(36)
);

-- -----------------------------------------------------------------------------
-- 5. Promotion Service Domain
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS promotions (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR(36),
    code VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255),
    description TEXT,
    type VARCHAR(50),
    value NUMERIC(15, 2) NOT NULL,
    min_order_value NUMERIC(15, 2),
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    status VARCHAR(50) DEFAULT 'INACTIVE',
    for_guest BOOLEAN DEFAULT FALSE,
    apply_fnb BOOLEAN DEFAULT FALSE,
    apply_ticket BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS promotion_conditions (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR(36),
    promotion_id VARCHAR(36) NOT NULL REFERENCES promotions(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    value VARCHAR(255) NOT NULL
);