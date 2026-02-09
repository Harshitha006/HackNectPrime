# 🏗️ HackNect - System Architecture Documentation

## 📊 Architecture Overview

HackNect follows a **microservices-inspired architecture** with three main services working together to deliver a seamless experience.

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │        Next.js Frontend (TypeScript + Tailwind)          │   │
│  │  • React Components  • Real-time Updates  • State Mgmt  │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ↓ HTTP/WebSocket
┌─────────────────────────────────────────────────────────────────┐
│                        API LAYER                                 │
│  ┌───────────────────┐              ┌────────────────────────┐  │
│  │  Backend API      │              │  AI Matching Service   │  │
│  │  (Node.js/Express)│◄────────────►│  (Python/FastAPI)      │  │
│  │  • REST Endpoints │   HTTP       │  • TF-IDF Vectors      │  │
│  │  • Socket.io      │              │  • Cosine Similarity   │  │
│  │  • Auth & Validation│            │  • Skill Gap Analysis  │  │
│  └───────────────────┘              └────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                  │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐                  │
│  │PostgreSQL│    │ MongoDB  │    │  Redis   │                  │
│  │          │    │          │    │          │                  │
│  │• Users   │    │• Messages│    │• Sessions│                  │
│  │• Teams   │    │• Notifs  │    │• Cache   │                  │
│  │• Events  │    │• Logs    │    │• Queues  │                  │
│  │• Matches │    │          │    │          │                  │
│  └──────────┘    └──────────┘    └──────────┘                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Core Components

### 1. Frontend (Next.js 14 + TypeScript)

**Technology Stack:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Socket.io Client
- Framer Motion (animations)

**Key Features:**
- Server-side rendering (SSR) for SEO
- Client-side routing for SPA feel
- Real-time updates via WebSockets
- Responsive design (mobile-first)
- Dark mode support

**Directory Structure:**
```
frontend/
├── app/
│   ├── (auth)/           # Auth pages
│   ├── (dashboard)/      # Protected pages
│   ├── api/             # API routes (if needed)
│   └── layout.tsx       # Root layout
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── teams/           # Team-specific components
│   ├── events/          # Event components
│   └── analytics/       # Analytics visualizations
├── lib/
│   ├── api.ts           # API client
│   ├── socket.ts        # Socket.io client
│   └── firebase.ts      # Firebase config
└── hooks/               # Custom React hooks
```

### 2. Backend API (Node.js + Express + TypeScript)

**Technology Stack:**
- Node.js 18+
- Express.js
- TypeScript
- Socket.io (WebSockets)
- PostgreSQL (pg library)
- MongoDB (mongoose)
- Redis (ioredis)
- JWT authentication

**Responsibilities:**
- User authentication & authorization
- CRUD operations for users, teams, events
- Request handling (join requests, invitations)
- Real-time chat via Socket.io
- Notification management
- Integration with AI service

**API Structure:**
```
/api
├── /auth
│   ├── POST /register
│   ├── POST /login
│   ├── POST /google
│   └── GET  /me
├── /users
│   ├── GET    /:id
│   ├── PUT    /:id
│   ├── GET    /search
│   ├── POST   /skills
│   └── GET    /matches
├── /teams
│   ├── POST   /
│   ├── GET    /:id
│   ├── PUT    /:id
│   ├── GET    /feed
│   ├── POST   /:id/members
│   ├── POST   /:id/roles
│   └── GET    /:id/analytics
├── /events
│   ├── GET    /
│   ├── GET    /:id
│   ├── POST   /:id/register
│   └── GET    /upcoming
├── /requests
│   ├── POST   /join
│   ├── POST   /invite
│   ├── PUT    /:id/approve
│   └── PUT    /:id/reject
├── /notifications
│   ├── GET    /
│   ├── PUT    /:id/read
│   └── DELETE /:id
└── /chat
    ├── GET    /:teamId/messages
    └── POST   /:teamId/messages
```

### 3. AI Matching Service (Python + FastAPI)

**Technology Stack:**
- Python 3.9+
- FastAPI
- scikit-learn (TF-IDF, cosine similarity)
- NumPy, Pandas
- PostgreSQL (async with asyncpg)
- Redis for caching
- FAISS (optional, for vector search)

**Responsibilities:**
- User-to-team matching
- Team-to-user matching
- Mentor-to-team matching
- Startup-to-talent matching
- Skill gap analysis
- Mentor radar (struggle detection)

**AI Algorithms:**

#### A. TF-IDF + Cosine Similarity Matching

```python
# 1. Vectorization
from sklearn.feature_extraction.text import TfidfVectorizer

def create_profile_vector(user_data):
    """Convert user profile to TF-IDF vector"""
    # Combine skills, interests, bio
    text = ' '.join(user_data['skills'] + 
                    user_data['interests'] + 
                    [user_data['bio']])
    
    vectorizer = TfidfVectorizer(max_features=1000)
    vector = vectorizer.fit_transform([text])
    return vector

# 2. Similarity Calculation
from sklearn.metrics.pairwise import cosine_similarity

def calculate_match_score(user_vector, team_vector):
    """Calculate cosine similarity between vectors"""
    similarity = cosine_similarity(user_vector, team_vector)[0][0]
    return similarity

# 3. Multi-factor Scoring
def compute_final_score(user, team):
    """Combine multiple factors for final score"""
    
    # Factor 1: Skill match (40%)
    skill_score = calculate_skill_match(user.skills, team.required_skills)
    
    # Factor 2: Experience match (25%)
    exp_score = calculate_experience_match(user.experience, team.required_exp)
    
    # Factor 3: Interest match (20%)
    interest_score = calculate_interest_match(user.interests, team.domain)
    
    # Factor 4: Availability (15%)
    availability_score = check_availability(user, team)
    
    # Weighted combination
    final_score = (
        skill_score * 0.40 +
        exp_score * 0.25 +
        interest_score * 0.20 +
        availability_score * 0.15
    )
    
    return final_score
```

#### B. Skill Gap Analysis Algorithm

```python
def analyze_skill_gaps(team_id):
    """Generate skill gap heatmap for a team"""
    
    # 1. Extract required skills from project
    team = get_team(team_id)
    required_skills = extract_skills_from_text(team.project_idea)
    
    # 2. Get current team skills
    members = get_team_members(team_id)
    current_skills = {}
    
    for member in members:
        for skill in member.skills:
            current_skills[skill.name] = current_skills.get(skill.name, 0) + 1
    
    # 3. Calculate coverage for each skill
    heatmap = {}
    for skill in required_skills:
        coverage = current_skills.get(skill, 0) / len(members)
        
        # Assign color based on coverage
        if coverage >= 0.7:
            color = 'green'  # Strong
        elif coverage >= 0.4:
            color = 'yellow'  # Moderate
        else:
            color = 'red'  # Gap
        
        heatmap[skill] = {
            'coverage': coverage,
            'color': color,
            'member_count': current_skills.get(skill, 0)
        }
    
    # 4. Calculate overall readiness
    readiness = sum(h['coverage'] for h in heatmap.values()) / len(heatmap)
    
    return {
        'team_id': team_id,
        'heatmap': heatmap,
        'readiness_score': readiness,
        'critical_gaps': [k for k, v in heatmap.items() if v['color'] == 'red']
    }
```

#### C. Mentor Radar Algorithm

```python
import re
from datetime import datetime, timedelta

def analyze_team_struggle(team_id, hours=24):
    """Detect if team is struggling and needs mentor"""
    
    # 1. Get recent chat messages
    cutoff = datetime.now() - timedelta(hours=hours)
    messages = get_chat_messages(team_id, after=cutoff)
    
    # 2. Define struggle indicators
    struggle_keywords = [
        'stuck', 'help', 'blocked', 'confused', 
        'not working', 'error', 'issue', 'problem',
        'don\'t know', 'how to', 'need help'
    ]
    
    # 3. Analyze message content
    struggle_count = 0
    for msg in messages:
        text = msg['message'].lower()
        for keyword in struggle_keywords:
            if keyword in text:
                struggle_count += 1
                break
    
    # 4. Calculate message gaps
    gaps = []
    for i in range(1, len(messages)):
        gap = (messages[i]['created_at'] - messages[i-1]['created_at']).total_seconds() / 3600
        gaps.append(gap)
    
    avg_gap = sum(gaps) / len(gaps) if gaps else 0
    
    # 5. Compute struggle score
    struggle_score = 0
    
    # Low activity indicator (< 10 messages in 24h)
    if len(messages) < 10:
        struggle_score += 0.3
    
    # High struggle keywords (> 20% of messages)
    if len(messages) > 0 and (struggle_count / len(messages)) > 0.2:
        struggle_score += 0.4
    
    # Long message gaps (avg > 4 hours)
    if avg_gap > 4:
        struggle_score += 0.3
    
    # 6. Determine if mentor needed
    if struggle_score > 0.6:
        # Find matching mentors
        team = get_team(team_id)
        mentors = find_mentors_by_skills(team.tech_stack)
        
        return {
            'needs_mentor': True,
            'struggle_score': struggle_score,
            'indicators': {
                'low_activity': len(messages) < 10,
                'struggle_keywords': struggle_count,
                'long_gaps': avg_gap > 4
            },
            'suggested_mentors': mentors[:5]
        }
    
    return {'needs_mentor': False}
```

---

## 🗄️ Database Architecture

### PostgreSQL Schema Design

**Primary Tables:**

1. **users** - Core user information
   - Stores: profile, contact, preferences
   - Relations: skills, interests, teams, requests

2. **teams** - Team information
   - Stores: project details, status, settings
   - Relations: members, roles, mentors, matches

3. **events** - Hackathon events
   - Stores: event details, dates, prizes
   - Relations: registrations, teams

4. **join_requests** - All request types
   - Supports: user↔team, mentor↔team, startup↔talent
   - Bidirectional notification system

5. **match_scores** - AI-generated matches
   - Stores: compatibility scores, match reasons
   - Indexed for fast retrieval

**Indexing Strategy:**
- B-tree indexes on foreign keys
- GIN indexes for array columns (skills, tech_stack)
- Partial indexes on status columns
- Text search indexes for fuzzy matching

### MongoDB Collections

**1. messages**
```javascript
{
  team_id: String,
  user_id: String,
  user_name: String,
  message: String,
  attachments: Array,
  reactions: Array,
  created_at: Date
}
```

**2. notifications**
```javascript
{
  user_id: String,
  type: String,  // match_found, request_received, etc.
  title: String,
  message: String,
  link: String,
  is_read: Boolean,
  priority: String,
  metadata: Object,
  created_at: Date
}
```

### Redis Data Structures

1. **Session Storage**
   ```
   KEY: session:{userId}
   TYPE: String
   VALUE: JWT token
   TTL: 7 days
   ```

2. **Online Presence**
   ```
   KEY: online:{teamId}
   TYPE: Set
   MEMBERS: [userId1, userId2, ...]
   ```

3. **Match Cache**
   ```
   KEY: matches:user:{userId}
   TYPE: List
   VALUE: [teamId1, teamId2, ...]
   TTL: 1 hour
   ```

4. **Notification Queue**
   ```
   KEY: notifications:pending
   TYPE: List
   VALUE: Notification objects
   ```

---

## 🔄 Data Flow Diagrams

### 1. User Registration & Onboarding Flow

```
User
  │
  ├─► Frontend: Fill registration form
  │
  ├─► Backend: POST /api/auth/register
  │    │
  │    ├─► Firebase Auth: Create user
  │    │
  │    ├─► PostgreSQL: Insert user record
  │    │
  │    └─► Response: JWT token + user data
  │
  ├─► Frontend: Redirect to onboarding
  │
  ├─► Fill profile (skills, interests, bio)
  │
  ├─► Backend: PUT /api/users/:id
  │    │
  │    ├─► PostgreSQL: Insert skills, interests
  │    │
  │    ├─► AI Service: Generate user vector
  │    │
  │    └─► Response: Updated profile
  │
  └─► Frontend: Redirect to dashboard
```

### 2. Team Matching Flow

```
User requests matches
  │
  ├─► Frontend: GET /api/users/matches
  │
  ├─► Backend: Forward to AI Service
  │
  ├─► AI Service: POST /api/match/user-teams
  │    │
  │    ├─► PostgreSQL: Get user skills, interests
  │    │
  │    ├─► PostgreSQL: Get all open teams
  │    │
  │    ├─► For each team:
  │    │    ├─► Create user vector (TF-IDF)
  │    │    ├─► Create team vector (TF-IDF)
  │    │    ├─► Calculate cosine similarity
  │    │    ├─► Calculate multi-factor score
  │    │    └─► Store in match_scores table
  │    │
  │    ├─► Filter: score >= 0.60
  │    │
  │    ├─► Sort by score DESC
  │    │
  │    └─► Return top 10 matches
  │
  ├─► Backend: Add team details
  │
  └─► Frontend: Display match cards with scores
```

### 3. Join Request Flow (Two-Way)

```
User → Team Request:

User clicks "Request to Join"
  │
  ├─► Frontend: Show pitch modal
  │
  ├─► User writes pitch
  │
  ├─► Backend: POST /api/requests/join
  │    │
  │    ├─► PostgreSQL: Insert join_request
  │    │
  │    ├─► MongoDB: Create notification for team leader
  │    │
  │    └─► Socket.io: Emit real-time notification
  │
  └─► Team Leader receives notification

Team Leader reviews:
  │
  ├─► Frontend: View request details
  │
  ├─► Leader clicks "Accept"
  │
  ├─► Backend: PUT /api/requests/:id/approve
  │    │
  │    ├─► PostgreSQL: Update request status = 'approved'
  │    │
  │    ├─► PostgreSQL: Insert team_member record
  │    │
  │    ├─► MongoDB: Notify user (accepted)
  │    │
  │    ├─► Socket.io: Update team in real-time
  │    │
  │    └─► Email: Send confirmation
  │
  └─► User receives "You're in!" notification

Team → User Invitation:

Team posts open role
  │
  ├─► AI Service: Find matching users
  │
  ├─► Backend: Notify matched users
  │
  └─► Users receive "Team X wants you!" notification
```

### 4. Real-Time Chat Flow

```
User joins team chat:

Frontend
  │
  ├─► Socket.io: connect()
  │
  ├─► Socket.io: emit('join_room', {teamId, userId})
  │
  └─► Backend Socket Handler
       │
       ├─► Join Socket.io room
       │
       ├─► MongoDB: Get last 50 messages
       │
       ├─► Redis: Set user online status
       │
       └─► Broadcast: user_joined event

User sends message:

Frontend
  │
  ├─► Socket.io: emit('send_message', {teamId, message})
  │
  └─► Backend Socket Handler
       │
       ├─► MongoDB: Insert message
       │
       ├─► Socket.io: Broadcast to room
       │
       └─► AI Service: Analyze for Mentor Radar
            │
            └─► If struggle detected:
                 └─► MongoDB: Create mentor alert notification
```

### 5. Skill Gap Analysis Flow

```
Team leader views analytics
  │
  ├─► Frontend: GET /api/teams/:id/analytics
  │
  ├─► Backend: Forward to AI Service
  │
  ├─► AI Service: GET /api/analytics/skill-gaps/:teamId
  │    │
  │    ├─► PostgreSQL: Get team project_idea
  │    │
  │    ├─► NLP: Extract required skills from text
  │    │
  │    ├─► PostgreSQL: Get current team members' skills
  │    │
  │    ├─► Calculate: coverage for each skill
  │    │
  │    ├─► Assign colors: green/yellow/red
  │    │
  │    └─► PostgreSQL: Store in skill_gap_analysis
  │
  ├─► Backend: Add recommendations
  │
  └─► Frontend: Display heatmap visualization
       │
       └─► Color-coded grid:
            🟢 Python     95%
            🟢 React      75%
            🟡 ML         60%
            🔴 DevOps     20%
            🔴 UI/UX       0%
```

---

## 🔐 Security Architecture

### Authentication & Authorization

**1. Firebase Authentication**
- Social login: Google, GitHub
- Email/password with verification
- Token refresh mechanism

**2. JWT Tokens**
- Access token (7 days)
- Refresh token (30 days)
- Stored in HTTP-only cookies

**3. Authorization Middleware**
```typescript
// Protect routes
router.get('/teams/:id', authMiddleware, getTeam);

// Role-based access
router.post('/teams/:id/members', 
  authMiddleware, 
  isTeamLeader, 
  addMember);
```

### Data Protection

1. **Input Validation**
   - Joi schemas for all inputs
   - SQL injection prevention (parameterized queries)
   - XSS protection (sanitize HTML)

2. **Rate Limiting**
   - 100 requests/minute per user
   - 1000 requests/hour per IP

3. **CORS Configuration**
   - Whitelist allowed origins
   - Credentials support

4. **HTTPS Enforcement**
   - Redirect HTTP → HTTPS
   - HSTS headers

---

## 🚀 Performance Optimizations

### 1. Caching Strategy

**Redis Caching:**
- User sessions (7-day TTL)
- Match scores (1-hour TTL)
- Event listings (5-min TTL)
- Popular team feeds (10-min TTL)

**Browser Caching:**
- Static assets (1 year)
- API responses (5 min for non-sensitive data)

### 2. Database Optimizations

**PostgreSQL:**
- Connection pooling (max 20 connections)
- Prepared statements
- Indexes on all foreign keys
- Materialized views for complex queries

**MongoDB:**
- Compound indexes for chat queries
- Capped collections for logs

### 3. Frontend Optimizations

- Code splitting (Next.js automatic)
- Image optimization (next/image)
- Lazy loading components
- Debounced search inputs
- Virtual scrolling for long lists

### 4. AI Service Optimizations

- Vector caching in Redis
- Batch processing for matches
- FAISS for fast similarity search
- Pre-computed vectors for popular profiles

---

## 📊 Monitoring & Logging

### Metrics to Track

1. **Application Metrics**
   - Request latency (p50, p95, p99)
   - Error rate
   - Active users
   - WebSocket connections

2. **Business Metrics**
   - Registrations per day
   - Teams created
   - Matches made
   - Join request acceptance rate

3. **System Metrics**
   - CPU usage
   - Memory usage
   - Database connections
   - Cache hit rate

### Logging Strategy

**Structured Logging (JSON):**
```json
{
  "timestamp": "2025-02-09T10:30:00Z",
  "level": "info",
  "service": "backend",
  "user_id": "uuid",
  "action": "team_created",
  "metadata": {
    "team_id": "uuid",
    "event_id": "uuid"
  }
}
```

**Log Levels:**
- ERROR: System failures
- WARN: Degraded performance
- INFO: User actions
- DEBUG: Development info

---

## 🔄 Deployment Architecture

### Development Environment
```
Docker Compose
├── postgres (port 5432)
├── mongodb (port 27017)
├── redis (port 6379)
├── backend (port 5000)
├── ai-service (port 8000)
└── frontend (port 3000)
```

### Production Environment
```
Cloud Provider (AWS/GCP/Azure)
├── Load Balancer
├── Frontend (Vercel/Netlify)
├── Backend (2+ instances, auto-scaling)
├── AI Service (2+ instances)
├── PostgreSQL (managed, replicas)
├── MongoDB (managed, replicas)
└── Redis (managed, cluster mode)
```

---

## 📈 Scalability Considerations

### Horizontal Scaling

1. **Stateless Services**
   - Backend & AI service are stateless
   - Can add more instances easily
   - Load balancer distributes traffic

2. **Database Scaling**
   - PostgreSQL: Read replicas
   - MongoDB: Sharding by team_id
   - Redis: Cluster mode

3. **Caching Layer**
   - CDN for static assets
   - Redis for application cache
   - Browser cache for API responses

### Future Enhancements

1. **Message Queue** (RabbitMQ/Kafka)
   - Async job processing
   - Email notifications
   - Match calculations

2. **Search Engine** (Elasticsearch)
   - Full-text search for teams, users
   - Fuzzy matching
   - Autocomplete

3. **Object Storage** (S3)
   - Profile pictures
   - Project files
   - Chat attachments

---

**This architecture is designed to be:**
- ✅ Scalable (handle 100K+ users)
- ✅ Maintainable (clear separation of concerns)
- ✅ Performant (sub-200ms API responses)
- ✅ Secure (industry-standard practices)
- ✅ Observable (comprehensive logging & monitoring)
