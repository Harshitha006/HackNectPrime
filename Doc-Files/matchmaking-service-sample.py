"""
MATCHMAKING SERVICE - AI-Powered Team Matching
Uses vector embeddings and cosine similarity for intelligent team formation
"""

from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import asyncpg
from redis import asyncio as aioredis
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import json
import os
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ===== CONFIGURATION =====

DATABASE_URL = os.getenv("DATABASE_URL")
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Use local embeddings if API keys not available
USE_LOCAL_EMBEDDINGS = not OPENAI_API_KEY
EMBEDDING_MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"

# ===== MODELS =====

class UserProfile(BaseModel):
    user_id: str
    skills: List[str]
    interests: List[str]
    experience_level: str
    bio: Optional[str] = None
    preferred_role: Optional[str] = None

class TeamProfile(BaseModel):
    team_id: str
    name: str
    description: str
    project_idea: Optional[str] = None
    required_skills: List[str]
    tech_stack: List[str]
    domains: List[str]
    current_members_count: int
    max_members: int
    open_roles: List[Dict[str, Any]]

class MatchRequest(BaseModel):
    user_id: str
    event_id: Optional[str] = None
    filters: Optional[Dict[str, Any]] = None

class TeamMatchRequest(BaseModel):
    team_id: str
    filters: Optional[Dict[str, Any]] = None

class MatchResult(BaseModel):
    id: str
    name: str
    score: float
    reasons: List[str]
    metadata: Dict[str, Any]

class MatchResponse(BaseModel):
    matches: List[MatchResult]
    total_count: int
    timestamp: str

# ===== DATABASE =====

class Database:
    def __init__(self):
        self.pool: Optional[asyncpg.Pool] = None
    
    async def connect(self):
        self.pool = await asyncpg.create_pool(
            DATABASE_URL,
            min_size=5,
            max_size=20
        )
        logger.info("✅ PostgreSQL connected")
    
    async def disconnect(self):
        if self.pool:
            await self.pool.close()
    
    async def get_user_profile(self, user_id: str) -> Optional[UserProfile]:
        async with self.pool.acquire() as conn:
            # Get user
            user = await conn.fetchrow(
                "SELECT * FROM users WHERE id = $1", user_id
            )
            if not user:
                return None
            
            # Get skills
            skills = await conn.fetch(
                "SELECT skill_name FROM user_skills WHERE user_id = $1",
                user_id
            )
            
            # Get interests
            interests = await conn.fetch(
                "SELECT interest_category FROM user_interests WHERE user_id = $1",
                user_id
            )
            
            return UserProfile(
                user_id=user['id'],
                skills=[s['skill_name'] for s in skills],
                interests=[i['interest_category'] for i in interests],
                experience_level=user['experience_level'] or 'beginner',
                bio=user['bio'],
                preferred_role=user['preferred_role']
            )
    
    async def get_available_teams(
        self,
        event_id: Optional[str] = None,
        limit: int = 100
    ) -> List[TeamProfile]:
        async with self.pool.acquire() as conn:
            query = """
                SELECT t.*, 
                       ARRAY_AGG(DISTINCT or.role_title) as roles,
                       ARRAY_AGG(DISTINCT or.required_skills) as all_skills
                FROM teams t
                LEFT JOIN open_roles or ON t.id = or.team_id
                WHERE t.looking_for_members = true
                  AND t.current_members < t.max_members
            """
            
            params = []
            if event_id:
                query += " AND t.event_id = $1"
                params.append(event_id)
            
            query += """
                GROUP BY t.id
                ORDER BY t.created_at DESC
                LIMIT $""" + str(len(params) + 1)
            params.append(limit)
            
            teams = await conn.fetch(query, *params)
            
            result = []
            for team in teams:
                # Get open roles
                roles = await conn.fetch(
                    """
                    SELECT role_title, required_skills, description
                    FROM open_roles
                    WHERE team_id = $1 AND is_filled = false
                    """,
                    team['id']
                )
                
                # Flatten required skills
                required_skills = []
                for role in roles:
                    if role['required_skills']:
                        required_skills.extend(role['required_skills'])
                
                result.append(TeamProfile(
                    team_id=team['id'],
                    name=team['name'],
                    description=team['description'] or '',
                    project_idea=team['project_idea'],
                    required_skills=list(set(required_skills)),
                    tech_stack=team['tech_stack'] or [],
                    domains=[],  # TODO: extract from project_idea
                    current_members_count=team['current_members'],
                    max_members=team['max_members'],
                    open_roles=[
                        {
                            'title': r['role_title'],
                            'skills': r['required_skills'],
                            'description': r['description']
                        }
                        for r in roles
                    ]
                ))
            
            return result
    
    async def save_match_score(
        self,
        user_id: str,
        team_id: str,
        score: float,
        reasons: List[str]
    ):
        async with self.pool.acquire() as conn:
            await conn.execute(
                """
                INSERT INTO match_scores (user_id, team_id, compatibility_score, match_reasons)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (user_id, team_id) 
                DO UPDATE SET 
                    compatibility_score = $3,
                    match_reasons = $4,
                    calculated_at = NOW()
                """,
                user_id, team_id, score, json.dumps(reasons)
            )

db = Database()

# ===== CACHE =====

class Cache:
    def __init__(self):
        self.redis = None
    
    async def connect(self):
        self.redis = await aioredis.from_url(REDIS_URL)
        logger.info("✅ Redis connected")
    
    async def disconnect(self):
        if self.redis:
            await self.redis.close()
    
    async def get(self, key: str) -> Optional[str]:
        return await self.redis.get(key)
    
    async def set(self, key: str, value: str, ttl: int = 3600):
        await self.redis.setex(key, ttl, value)
    
    async def delete(self, key: str):
        await self.redis.delete(key)

cache = Cache()

# ===== AI MATCHING ENGINE =====

class MatchingEngine:
    def __init__(self):
        self.model = None
        if USE_LOCAL_EMBEDDINGS:
            logger.info(f"Loading embedding model: {EMBEDDING_MODEL_NAME}")
            self.model = SentenceTransformer(EMBEDDING_MODEL_NAME)
            logger.info("✅ Embedding model loaded")
    
    def generate_embedding(self, text: str) -> np.ndarray:
        """Generate embedding vector for text"""
        if USE_LOCAL_EMBEDDINGS:
            return self.model.encode(text, convert_to_numpy=True)
        else:
            # TODO: Use OpenAI API for embeddings
            import openai
            openai.api_key = OPENAI_API_KEY
            response = openai.Embedding.create(
                input=text,
                model="text-embedding-ada-002"
            )
            return np.array(response['data'][0]['embedding'])
    
    def calculate_skill_match(
        self,
        user_skills: List[str],
        required_skills: List[str]
    ) -> float:
        """Calculate skill matching score using embeddings"""
        if not user_skills or not required_skills:
            return 0.0
        
        # Generate embeddings
        user_text = " ".join(user_skills)
        team_text = " ".join(required_skills)
        
        user_embedding = self.generate_embedding(user_text)
        team_embedding = self.generate_embedding(team_text)
        
        # Calculate cosine similarity
        similarity = cosine_similarity(
            user_embedding.reshape(1, -1),
            team_embedding.reshape(1, -1)
        )[0][0]
        
        # Normalize to 0-1 range
        return float((similarity + 1) / 2)
    
    def calculate_experience_match(
        self,
        user_level: str,
        team_needs: str = "intermediate"
    ) -> float:
        """Calculate experience level compatibility"""
        levels = {
            'beginner': 1,
            'intermediate': 2,
            'advanced': 3,
            'expert': 4
        }
        
        user_score = levels.get(user_level.lower(), 2)
        team_score = levels.get(team_needs.lower(), 2)
        
        # Perfect match = 1.0, adjacent levels = 0.8, 2 levels apart = 0.5
        diff = abs(user_score - team_score)
        if diff == 0:
            return 1.0
        elif diff == 1:
            return 0.8
        elif diff == 2:
            return 0.5
        else:
            return 0.3
    
    def calculate_interest_match(
        self,
        user_interests: List[str],
        team_domains: List[str]
    ) -> float:
        """Calculate interest/domain overlap"""
        if not user_interests or not team_domains:
            return 0.5  # neutral
        
        # Jaccard similarity
        user_set = set([i.lower() for i in user_interests])
        team_set = set([d.lower() for d in team_domains])
        
        intersection = len(user_set & team_set)
        union = len(user_set | team_set)
        
        if union == 0:
            return 0.5
        
        return intersection / union
    
    def generate_match_reasons(
        self,
        user: UserProfile,
        team: TeamProfile,
        skill_score: float,
        exp_score: float,
        interest_score: float
    ) -> List[str]:
        """Generate human-readable reasons for the match"""
        reasons = []
        
        # Skill match reasons
        matching_skills = set(
            [s.lower() for s in user.skills]
        ) & set(
            [s.lower() for s in team.required_skills]
        )
        
        if matching_skills:
            skills_str = ", ".join(list(matching_skills)[:3])
            reasons.append(f"You have {len(matching_skills)} matching skills: {skills_str}")
        
        if skill_score > 0.8:
            reasons.append("Strong skill alignment with team needs")
        elif skill_score > 0.6:
            reasons.append("Good skill match for this team")
        
        # Experience match reasons
        if exp_score > 0.9:
            reasons.append("Your experience level is perfect for this team")
        elif exp_score > 0.7:
            reasons.append("Your experience level aligns well")
        
        # Interest match reasons
        if interest_score > 0.7:
            reasons.append("Shared interests in project domain")
        
        # Role match
        if user.preferred_role:
            for role in team.open_roles:
                if user.preferred_role.lower() in role['title'].lower():
                    reasons.append(f"Perfect fit for {role['title']} role")
                    break
        
        # Team composition
        spots_left = team.max_members - team.current_members_count
        if spots_left == 1:
            reasons.append("⚠️ Last spot available!")
        elif spots_left <= 3:
            reasons.append(f"Only {spots_left} spots left")
        
        return reasons
    
    async def match_user_to_teams(
        self,
        user_id: str,
        event_id: Optional[str] = None,
        threshold: float = 0.6
    ) -> List[MatchResult]:
        """Find best matching teams for a user"""
        # Get user profile
        user = await db.get_user_profile(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Get available teams
        teams = await db.get_available_teams(event_id=event_id)
        
        matches = []
        for team in teams:
            # Calculate individual scores
            skill_match = self.calculate_skill_match(
                user.skills,
                team.required_skills
            )
            
            exp_match = self.calculate_experience_match(
                user.experience_level
            )
            
            interest_match = self.calculate_interest_match(
                user.interests,
                team.domains
            )
            
            # Weighted final score
            final_score = (
                skill_match * 0.40 +
                exp_match * 0.25 +
                interest_match * 0.20 +
                0.15  # Availability placeholder
            )
            
            # Only include matches above threshold
            if final_score >= threshold:
                reasons = self.generate_match_reasons(
                    user, team,
                    skill_match, exp_match, interest_match
                )
                
                matches.append(MatchResult(
                    id=team.team_id,
                    name=team.name,
                    score=round(final_score, 2),
                    reasons=reasons,
                    metadata={
                        'description': team.description,
                        'project_idea': team.project_idea,
                        'tech_stack': team.tech_stack,
                        'open_roles': team.open_roles,
                        'spots_left': team.max_members - team.current_members_count,
                        'breakdown': {
                            'skill_match': round(skill_match, 2),
                            'experience_match': round(exp_match, 2),
                            'interest_match': round(interest_match, 2)
                        }
                    }
                ))
                
                # Save match score to database
                await db.save_match_score(
                    user_id, team.team_id, final_score, reasons
                )
        
        # Sort by score (descending) and return top 10
        matches.sort(key=lambda x: x.score, reverse=True)
        return matches[:10]

matching_engine = MatchingEngine()

# ===== FASTAPI APP =====

app = FastAPI(
    title="HackNect Matchmaking Service",
    description="AI-powered team matching using vector embeddings",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===== EVENTS =====

@app.on_event("startup")
async def startup():
    await db.connect()
    await cache.connect()
    logger.info("🚀 Matchmaking Service started")

@app.on_event("shutdown")
async def shutdown():
    await db.disconnect()
    await cache.disconnect()
    logger.info("👋 Matchmaking Service stopped")

# ===== ROUTES =====

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "matchmaking-service",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.post("/api/match/user-to-teams", response_model=MatchResponse)
async def match_user_to_teams(request: MatchRequest):
    """Find matching teams for a user"""
    try:
        # Check cache
        cache_key = f"matches:user:{request.user_id}:event:{request.event_id or 'all'}"
        cached = await cache.get(cache_key)
        
        if cached:
            logger.info(f"Cache hit for user {request.user_id}")
            data = json.loads(cached)
            return MatchResponse(**data)
        
        # Calculate matches
        matches = await matching_engine.match_user_to_teams(
            request.user_id,
            request.event_id
        )
        
        response = MatchResponse(
            matches=matches,
            total_count=len(matches),
            timestamp=datetime.utcnow().isoformat()
        )
        
        # Cache for 30 minutes
        await cache.set(cache_key, response.json(), ttl=1800)
        
        return response
    
    except Exception as e:
        logger.error(f"Error matching user to teams: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/match/team-to-users", response_model=MatchResponse)
async def match_team_to_users(request: TeamMatchRequest):
    """Find matching users for a team"""
    # TODO: Implement reverse matching
    return MatchResponse(
        matches=[],
        total_count=0,
        timestamp=datetime.utcnow().isoformat()
    )

@app.get("/api/match/recommendations/{user_id}", response_model=MatchResponse)
async def get_recommendations(user_id: str, event_id: Optional[str] = None):
    """Get personalized team recommendations"""
    request = MatchRequest(user_id=user_id, event_id=event_id)
    return await match_user_to_teams(request)

@app.post("/api/match/calculate-compatibility")
async def calculate_compatibility(
    user_id: str,
    team_id: str
):
    """Calculate compatibility score between specific user and team"""
    # TODO: Implement specific compatibility calculation
    return {"score": 0.75, "reasons": ["Good match"]}

# ===== MAIN =====

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=int(os.getenv("PORT", 3003)),
        log_level="info"
    )
