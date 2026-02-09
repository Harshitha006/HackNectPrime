-- =============================================
-- HackNect Database Schema (PostgreSQL 14+)
-- Complete schema for AI-powered hackathon matching
-- =============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy text search

-- =============================================
-- USERS & AUTHENTICATION
-- =============================================

CREATE TYPE user_type_enum AS ENUM ('participant', 'mentor', 'startup');
CREATE TYPE experience_level_enum AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');
CREATE TYPE proficiency_level_enum AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  firebase_uid VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  user_type user_type_enum NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  experience_level experience_level_enum,
  major VARCHAR(100),
  graduation_year INTEGER,
  school VARCHAR(255),
  github_url VARCHAR(255),
  linkedin_url VARCHAR(255),
  portfolio_url VARCHAR(255),
  is_available BOOLEAN DEFAULT TRUE,
  is_prime BOOLEAN DEFAULT FALSE,
  location VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  skill_name VARCHAR(100) NOT NULL,
  proficiency_level proficiency_level_enum DEFAULT 'intermediate',
  years_experience DECIMAL(3,1),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_interests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  interest_category VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE mentor_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  expertise_areas TEXT[],
  availability_hours VARCHAR(100),
  max_teams INTEGER DEFAULT 3,
  current_teams INTEGER DEFAULT 0,
  is_floating_mentor BOOLEAN DEFAULT FALSE,
  mentoring_style TEXT,
  rating DECIMAL(2,1) DEFAULT 0.0,
  total_teams_mentored INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- EVENTS & HACKATHONS
-- =============================================

CREATE TYPE event_type_enum AS ENUM ('global', 'national', 'university', 'virtual', 'hybrid');
CREATE TYPE event_status_enum AS ENUM ('upcoming', 'ongoing', 'completed', 'cancelled');

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  event_type event_type_enum NOT NULL,
  domain VARCHAR(100),
  theme VARCHAR(255),
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  registration_deadline TIMESTAMP,
  location VARCHAR(255),
  is_virtual BOOLEAN DEFAULT FALSE,
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  organizer_name VARCHAR(255),
  organizer_email VARCHAR(255),
  event_url TEXT,
  logo_url TEXT,
  prize_pool VARCHAR(100),
  status event_status_enum DEFAULT 'upcoming',
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE event_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  team_id UUID,
  opt_in_notifications BOOLEAN DEFAULT TRUE,
  registered_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- =============================================
-- TEAMS & COLLABORATION
-- =============================================

CREATE TYPE team_status_enum AS ENUM ('forming', 'active', 'completed', 'disbanded');

CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  project_idea TEXT,
  event_id UUID REFERENCES events(id),
  leader_id UUID REFERENCES users(id),
  max_members INTEGER DEFAULT 5,
  current_members INTEGER DEFAULT 1,
  needs_mentor BOOLEAN DEFAULT TRUE,
  has_mentor BOOLEAN DEFAULT FALSE,
  tech_stack TEXT[],
  team_avatar_url TEXT,
  github_repo_url VARCHAR(255),
  status team_status_enum DEFAULT 'forming',
  project_domain VARCHAR(100),
  looking_for_members BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(100),
  joined_at TIMESTAMP DEFAULT NOW(),
  is_leader BOOLEAN DEFAULT FALSE,
  contribution_score DECIMAL(3,2) DEFAULT 0.00,
  UNIQUE(team_id, user_id)
);

CREATE TABLE open_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  role_title VARCHAR(100) NOT NULL,
  required_skills TEXT[],
  description TEXT,
  is_filled BOOLEAN DEFAULT FALSE,
  priority VARCHAR(20) DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE mentor_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id UUID REFERENCES users(id),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'active',
  rating DECIMAL(2,1),
  feedback TEXT,
  UNIQUE(mentor_id, team_id)
);

-- =============================================
-- REQUESTS & INVITATIONS
-- =============================================

CREATE TYPE request_type_enum AS ENUM ('user_to_team', 'team_to_user', 'mentor_to_team', 'team_to_mentor');
CREATE TYPE request_status_enum AS ENUM ('pending', 'approved', 'rejected', 'cancelled');

CREATE TABLE join_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  team_id UUID REFERENCES teams(id),
  request_type request_type_enum NOT NULL,
  message TEXT,
  pitch TEXT,
  status request_status_enum DEFAULT 'pending',
  requested_at TIMESTAMP DEFAULT NOW(),
  responded_at TIMESTAMP,
  responder_id UUID REFERENCES users(id),
  expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '7 days')
);

-- =============================================
-- AI MATCHMAKING & ANALYTICS
-- =============================================

CREATE TABLE match_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  team_id UUID REFERENCES teams(id),
  compatibility_score DECIMAL(4,3) CHECK (compatibility_score >= 0 AND compatibility_score <= 1),
  skill_match_score DECIMAL(4,3),
  experience_match_score DECIMAL(4,3),
  interest_match_score DECIMAL(4,3),
  availability_match_score DECIMAL(4,3),
  match_reasons JSONB,
  calculated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, team_id)
);

CREATE TABLE skill_gap_analysis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE UNIQUE,
  required_skills JSONB,
  current_skills JSONB,
  gaps JSONB,
  overall_readiness DECIMAL(4,3),
  recommendations TEXT[],
  calculated_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE mentor_radar_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  struggle_score DECIMAL(4,3),
  struggle_indicators JSONB,
  suggested_mentors UUID[],
  alert_triggered BOOLEAN DEFAULT FALSE,
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- REVERSE HACKATHON
-- =============================================

CREATE TYPE project_status_enum AS ENUM ('open', 'team_forming', 'closed');
CREATE TYPE application_status_enum AS ENUM ('pending', 'accepted', 'rejected');

CREATE TABLE reverse_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  creator_id UUID REFERENCES users(id),
  event_id UUID REFERENCES events(id),
  required_skills TEXT[],
  team_size INTEGER DEFAULT 4,
  current_applicants INTEGER DEFAULT 0,
  status project_status_enum DEFAULT 'open',
  project_domain VARCHAR(100),
  tech_stack TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE project_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES reverse_projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  cover_letter TEXT,
  status application_status_enum DEFAULT 'pending',
  applied_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- =============================================
-- PRIME FEATURES (STARTUPS)
-- =============================================

CREATE TYPE job_type_enum AS ENUM ('internship', 'full-time', 'part-time', 'contract', 'freelance');

CREATE TABLE startups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  company_name VARCHAR(255) NOT NULL,
  description TEXT,
  industry VARCHAR(100),
  website VARCHAR(255),
  logo_url TEXT,
  company_size VARCHAR(50),
  founded_year INTEGER,
  location VARCHAR(255),
  is_verified BOOLEAN DEFAULT FALSE,
  subscription_tier VARCHAR(50) DEFAULT 'prime',
  subscription_expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE job_postings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  startup_id UUID REFERENCES startups(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  required_skills TEXT[],
  job_type job_type_enum NOT NULL,
  location VARCHAR(255),
  is_remote BOOLEAN DEFAULT FALSE,
  salary_range VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  views INTEGER DEFAULT 0,
  applications_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES job_postings(id) ON DELETE CASCADE,
  applicant_id UUID REFERENCES users(id),
  applicant_type VARCHAR(20) CHECK (applicant_type IN ('individual', 'team')),
  team_id UUID REFERENCES teams(id),
  cover_letter TEXT,
  resume_url TEXT,
  status application_status_enum DEFAULT 'pending',
  applied_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(job_id, applicant_id)
);

CREATE TABLE startup_outreach (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  startup_id UUID REFERENCES startups(id),
  target_id UUID,
  target_type VARCHAR(20) CHECK (target_type IN ('user', 'team')),
  request_type VARCHAR(50),
  message TEXT,
  job_id UUID REFERENCES job_postings(id),
  status request_status_enum DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- COMPREHENSIVE INDEXES
-- =============================================

-- Users
CREATE INDEX idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_users_is_available ON users(is_available);
CREATE INDEX idx_users_is_prime ON users(is_prime);
CREATE INDEX idx_users_location ON users(location);

-- Skills & Interests
CREATE INDEX idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX idx_user_skills_skill_name ON user_skills(skill_name);
CREATE INDEX idx_user_interests_user_id ON user_interests(user_id);
CREATE INDEX idx_user_interests_category ON user_interests(interest_category);

-- Text search on skills
CREATE INDEX idx_user_skills_name_trgm ON user_skills USING gin (skill_name gin_trgm_ops);

-- Events
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_event_type ON events(event_type);
CREATE INDEX idx_events_domain ON events(domain);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_location ON events(location);
CREATE INDEX idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX idx_event_registrations_user_id ON event_registrations(user_id);

-- Teams
CREATE INDEX idx_teams_event_id ON teams(event_id);
CREATE INDEX idx_teams_leader_id ON teams(leader_id);
CREATE INDEX idx_teams_status ON teams(status);
CREATE INDEX idx_teams_needs_mentor ON teams(needs_mentor);
CREATE INDEX idx_teams_looking_for_members ON teams(looking_for_members);
CREATE INDEX idx_team_members_team_id ON team_members(team_id);
CREATE INDEX idx_team_members_user_id ON team_members(user_id);
CREATE INDEX idx_open_roles_team_id ON open_roles(team_id);
CREATE INDEX idx_open_roles_is_filled ON open_roles(is_filled);

-- Requests
CREATE INDEX idx_join_requests_user_id ON join_requests(user_id);
CREATE INDEX idx_join_requests_team_id ON join_requests(team_id);
CREATE INDEX idx_join_requests_status ON join_requests(status);
CREATE INDEX idx_join_requests_type ON join_requests(request_type);

-- Matching
CREATE INDEX idx_match_scores_user_id ON match_scores(user_id);
CREATE INDEX idx_match_scores_team_id ON match_scores(team_id);
CREATE INDEX idx_match_scores_score ON match_scores(compatibility_score DESC);
CREATE INDEX idx_skill_gap_team_id ON skill_gap_analysis(team_id);

-- Prime
CREATE INDEX idx_startups_user_id ON startups(user_id);
CREATE INDEX idx_job_postings_startup_id ON job_postings(startup_id);
CREATE INDEX idx_job_postings_is_active ON job_postings(is_active);
CREATE INDEX idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX idx_job_applications_applicant_id ON job_applications(applicant_id);

-- =============================================
-- TRIGGERS & FUNCTIONS
-- =============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_postings_updated_at BEFORE UPDATE ON job_postings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-update team member count
CREATE OR REPLACE FUNCTION update_team_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE teams SET current_members = current_members + 1 WHERE id = NEW.team_id;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE teams SET current_members = current_members - 1 WHERE id = OLD.team_id;
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER team_member_count_trigger
AFTER INSERT OR DELETE ON team_members
FOR EACH ROW EXECUTE FUNCTION update_team_member_count();

-- Auto-update event participant count
CREATE OR REPLACE FUNCTION update_event_participant_count()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE events SET current_participants = current_participants + 1 WHERE id = NEW.event_id;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE events SET current_participants = current_participants - 1 WHERE id = OLD.event_id;
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER event_participant_count_trigger
AFTER INSERT OR DELETE ON event_registrations
FOR EACH ROW EXECUTE FUNCTION update_event_participant_count();

-- Auto-expire old requests
CREATE OR REPLACE FUNCTION cancel_expired_requests()
RETURNS void AS $$
BEGIN
  UPDATE join_requests
  SET status = 'cancelled'
  WHERE status = 'pending'
  AND expires_at < NOW();
END;
$$ language 'plpgsql';

-- Schedule: Run this function daily via cron or scheduled job

-- =============================================
-- SAMPLE DATA
-- =============================================

-- Insert sample events
INSERT INTO events (name, description, event_type, domain, theme, start_date, end_date, registration_deadline, location, prize_pool, tags) VALUES
('CodeFest 2025', 'India''s largest student coding championship bringing together brilliant minds', 'national', 'Software Development', 'Innovation in Technology', '2025-03-15 09:00:00', '2025-03-17 18:00:00', '2025-03-10 23:59:59', 'Mumbai, India', '$10,000', ARRAY['coding', 'web', 'mobile']),
('AI/ML Global Hackathon', 'Build AI solutions that matter. Global competition with top mentors', 'global', 'AI/ML', 'AI for Social Good', '2025-04-01 10:00:00', '2025-04-03 20:00:00', '2025-03-25 23:59:59', 'Virtual', '$25,000', ARRAY['ai', 'ml', 'nlp', 'cv']),
('HealthTech Challenge', 'Innovate healthcare with technology. Build apps that save lives', 'national', 'HealthTech', 'Digital Health Revolution', '2025-03-20 08:00:00', '2025-03-22 17:00:00', '2025-03-15 23:59:59', 'Bangalore, India', '$15,000', ARRAY['health', 'iot', 'mobile']),
('Web3 & Blockchain Summit', 'Decentralize the future. Build dApps and smart contracts', 'global', 'Web3', 'Decentralized Future', '2025-04-10 09:00:00', '2025-04-12 19:00:00', '2025-04-05 23:59:59', 'Virtual', '$30,000', ARRAY['blockchain', 'web3', 'defi']),
('EduTech Innovation Fair', 'Revolutionize education through technology', 'university', 'EdTech', 'Learning of Tomorrow', '2025-03-25 10:00:00', '2025-03-26 18:00:00', '2025-03-20 23:59:59', 'Delhi University', '$5,000', ARRAY['education', 'gamification']);

-- =============================================
-- USEFUL VIEWS
-- =============================================

-- Teams with complete information
CREATE OR REPLACE VIEW v_teams_full AS
SELECT 
  t.*,
  u.display_name as leader_name,
  u.avatar_url as leader_avatar,
  e.name as event_name,
  e.start_date as event_start,
  COUNT(DISTINCT tm.user_id) as actual_member_count,
  COUNT(DISTINCT ma.mentor_id) as mentor_count,
  ARRAY_AGG(DISTINCT or.role_title) FILTER (WHERE or.is_filled = FALSE) as open_role_titles,
  (t.max_members - t.current_members) as slots_available
FROM teams t
LEFT JOIN users u ON t.leader_id = u.id
LEFT JOIN events e ON t.event_id = e.id
LEFT JOIN team_members tm ON t.id = tm.team_id
LEFT JOIN mentor_assignments ma ON t.id = ma.team_id AND ma.status = 'active'
LEFT JOIN open_roles or ON t.id = or.team_id
GROUP BY t.id, u.display_name, u.avatar_url, e.name, e.start_date;

-- Users with their skills and interests
CREATE OR REPLACE VIEW v_users_with_profile AS
SELECT 
  u.*,
  ARRAY_AGG(DISTINCT us.skill_name) FILTER (WHERE us.skill_name IS NOT NULL) as skills,
  ARRAY_AGG(DISTINCT ui.interest_category) FILTER (WHERE ui.interest_category IS NOT NULL) as interests,
  mp.expertise_areas,
  mp.is_floating_mentor,
  mp.rating as mentor_rating
FROM users u
LEFT JOIN user_skills us ON u.id = us.user_id
LEFT JOIN user_interests ui ON u.id = ui.user_id
LEFT JOIN mentor_profiles mp ON u.id = mp.user_id
GROUP BY u.id, mp.expertise_areas, mp.is_floating_mentor, mp.rating;

-- Teams looking for members with matching data
CREATE OR REPLACE VIEW v_open_teams AS
SELECT 
  t.*,
  ARRAY_AGG(DISTINCT or.role_title) as needed_roles,
  ARRAY_AGG(DISTINCT unnest(or.required_skills)) as all_required_skills,
  (t.max_members - t.current_members) as available_slots
FROM teams t
LEFT JOIN open_roles or ON t.id = or.team_id AND or.is_filled = FALSE
WHERE t.status = 'forming'
  AND t.current_members < t.max_members
  AND t.looking_for_members = TRUE
GROUP BY t.id;

-- Active hackathons
CREATE OR REPLACE VIEW v_active_events AS
SELECT *
FROM events
WHERE status IN ('upcoming', 'ongoing')
  AND registration_deadline > NOW()
ORDER BY start_date ASC;

-- =============================================
-- HELPER FUNCTIONS FOR QUERIES
-- =============================================

-- Get user's match scores
CREATE OR REPLACE FUNCTION get_user_matches(p_user_id UUID, p_limit INTEGER DEFAULT 10)
RETURNS TABLE (
  team_id UUID,
  team_name VARCHAR,
  compatibility_score DECIMAL,
  match_reasons JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id,
    t.name,
    ms.compatibility_score,
    ms.match_reasons
  FROM match_scores ms
  JOIN teams t ON ms.team_id = t.id
  WHERE ms.user_id = p_user_id
    AND ms.compatibility_score >= 0.60
    AND t.status = 'forming'
    AND t.looking_for_members = TRUE
  ORDER BY ms.compatibility_score DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Get team's match scores
CREATE OR REPLACE FUNCTION get_team_matches(p_team_id UUID, p_limit INTEGER DEFAULT 10)
RETURNS TABLE (
  user_id UUID,
  display_name VARCHAR,
  compatibility_score DECIMAL,
  match_reasons JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.display_name,
    ms.compatibility_score,
    ms.match_reasons
  FROM match_scores ms
  JOIN users u ON ms.user_id = u.id
  WHERE ms.team_id = p_team_id
    AND ms.compatibility_score >= 0.60
    AND u.is_available = TRUE
  ORDER BY ms.compatibility_score DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Search users by skills
CREATE OR REPLACE FUNCTION search_users_by_skills(p_skills TEXT[], p_limit INTEGER DEFAULT 20)
RETURNS TABLE (
  user_id UUID,
  display_name VARCHAR,
  avatar_url TEXT,
  skills_matched INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.display_name,
    u.avatar_url,
    COUNT(DISTINCT us.skill_name)::INTEGER as skills_matched
  FROM users u
  JOIN user_skills us ON u.id = us.user_id
  WHERE us.skill_name = ANY(p_skills)
    AND u.is_available = TRUE
  GROUP BY u.id
  ORDER BY skills_matched DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;
