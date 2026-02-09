from fastapi import FastAPI, HTTPException, Body
from typing import List, Optional, Dict
from pydantic import BaseModel
import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.matching.team_matcher import TeamMatcher
from app.analysis.skill_analyzer import SkillAnalyzer
from app.analysis.mentor_radar import MentorRadar

app = FastAPI(title="HackNect AI Service")
matcher = TeamMatcher()
skill_analyzer = SkillAnalyzer()
mentor_radar = MentorRadar()

class UserProfile(BaseModel):
    id: str
    skills: List[str]
    interests: List[str]
    experience_level: str
    bio: Optional[str] = None

class TeamProfile(BaseModel):
    id: str
    name: str
    description: str
    project_idea: str
    project_domain: Optional[str] = None
    tech_stack: List[str] = []
    open_roles: List[Dict] = []

class MatchRequest(BaseModel):
    user: UserProfile
    teams: List[TeamProfile]

class SkillGapRequest(BaseModel):
    current_skills: List[str]
    required_skills: List[str]

class RadarRequest(BaseModel):
    messages: List[str]

@app.get("/")
def read_root():
    return {"message": "HackNect AI Service Running"}

@app.post("/match/user-to-teams")
def match_user_to_teams(request: MatchRequest):
    try:
        user = request.user.dict()
        teams = [t.dict() for t in request.teams]
        if not teams: return []
        user_text = matcher.create_user_text(user)
        team_texts = [matcher.create_team_text(team) for team in teams]
        all_texts = [user_text] + team_texts
        vectors = matcher.vectorizer.fit_transform(all_texts)
        user_vector = vectors[0:1]
        team_vectors = vectors[1:]
        from sklearn.metrics.pairwise import cosine_similarity
        similarities = cosine_similarity(user_vector, team_vectors)[0]
        matches = []
        for i, team in enumerate(teams):
            skill_score = float(similarities[i])
            if skill_score >= 0.1:
                 matches.append({
                    'team_id': team['id'],
                    'team_name': team['name'],
                    'compatibility_score': round(skill_score, 3),
                    'match_reasons': matcher.explain_match(user, team, skill_score)
                })
        matches.sort(key=lambda x: x['compatibility_score'], reverse=True)
        return matches
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/skills")
def analyze_skills(request: SkillGapRequest):
    try:
        return skill_analyzer.analyze_gaps(request.current_skills, request.required_skills)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/radar")
def analyze_radar(request: RadarRequest):
    try:
        return mentor_radar.analyze_team_status(request.messages)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
