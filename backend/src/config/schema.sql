-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    user_type VARCHAR(50) DEFAULT 'participant',
    google_id VARCHAR(255),
    photo_url TEXT,
    is_onboarded BOOLEAN DEFAULT FALSE,
    bio TEXT,
    skills TEXT,
    major VARCHAR(255),
    expertise TEXT,
    availability VARCHAR(255),
    company VARCHAR(255),
    industry VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Note: Ensure pgcrypto extension is available if using gen_random_uuid()
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";
