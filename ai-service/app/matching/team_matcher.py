from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from typing import List, Dict

class TeamMatcher:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(
            max_features=1000,
            ngram_range=(1, 2),
            stop_words='english'
        )
    
    def match_user_to_teams(
        self, 
        user_id: str, 
        limit: int = 10
    ) -> List[Dict]:
        """Find best team matches for a user"""
        
        # 1. Get user profile
        user = self.get_user_profile(user_id)
        
        # 2. Get candidate teams
        teams = self.get_open_teams()
        
        if not teams:
            return []
        
        # 3. Create text representations
        user_text = self.create_user_text(user)
        team_texts = [self.create_team_text(team) for team in teams]
        
        # 4. Vectorize
        all_texts = [user_text] + team_texts
        vectors = self.vectorizer.fit_transform(all_texts)
        
        user_vector = vectors[0:1]
        team_vectors = vectors[1:]
        
        # 5. Calculate cosine similarities
        similarities = cosine_similarity(user_vector, team_vectors)[0]
        
        # 6. Calculate multi-factor scores
        matches = []
        for i, team in enumerate(teams):
            skill_score = similarities[i]
            exp_score = self.calculate_experience_match(user, team)
            interest_score = self.calculate_interest_match(user, team)
            availability_score = self.check_availability(user, team)
            
            # Weighted combination
            final_score = (
                skill_score * 0.40 +
                exp_score * 0.25 +
                interest_score * 0.20 +
                availability_score * 0.15
            )
            
            if final_score >= 0.6:  # 60% threshold
                matches.append({
                    'team_id': team['id'],
                    'team_name': team['name'],
                    'compatibility_score': round(final_score, 3),
                    'breakdown': {
                        'skill_match': round(skill_score, 3),
                        'experience_match': round(exp_score, 3),
                        'interest_match': round(interest_score, 3),
                        'availability': round(availability_score, 3)
                    },
                    'match_reasons': self.explain_match(user, team, final_score)
                })
        
        # 7. Sort by score and return top matches
        matches.sort(key=lambda x: x['compatibility_score'], reverse=True)
        return matches[:limit]
    
    def create_user_text(self, user: Dict) -> str:
        """Create text representation of user profile"""
        parts = []
        
        # Skills (weighted more)
        if user.get('skills'):
            skills_text = ' '.join(user['skills']) * 2  # Repeat for weight
            parts.append(skills_text)
        
        # Interests
        if user.get('interests'):
            parts.append(' '.join(user['interests']))
        
        # Bio
        if user.get('bio'):
            parts.append(user['bio'])
        
        # Experience level
        if user.get('experience_level'):
            parts.append(user['experience_level'])
        
        return ' '.join(parts)
    
    def create_team_text(self, team: Dict) -> str:
        """Create text representation of team needs"""
        parts = []
        
        # Required skills from open roles
        if team.get('open_roles'):
            for role in team['open_roles']:
                if role.get('required_skills'):
                    skills = ' '.join(role['required_skills']) * 2
                    parts.append(skills)
                if role.get('description'):
                    parts.append(role['description'])
        
        # Project idea
        if team.get('project_idea'):
            parts.append(team['project_idea'])
        
        # Tech stack
        if team.get('tech_stack'):
            parts.append(' '.join(team['tech_stack']))
        
        # Project domain
        if team.get('project_domain'):
            parts.append(team['project_domain'])
        
        return ' '.join(parts)
    
    def explain_match(
        self, 
        user: Dict, 
        team: Dict, 
        score: float
    ) -> Dict:
        """Generate explanation for why this match was made"""
        reasons = {
            'matching_skills': [],
            'matching_interests': [],
            'experience_fit': '',
            'overall': ''
        }
        
        # Find matching skills
        user_skills = set(user.get('skills', []))
        team_skills = set()
        for role in team.get('open_roles', []):
            team_skills.update(role.get('required_skills', []))
        
        matching_skills = user_skills.intersection(team_skills)
        reasons['matching_skills'] = list(matching_skills)
        
        # Find matching interests
        user_interests = set(user.get('interests', []))
        team_domain = team.get('project_domain', '')
        if team_domain in user_interests:
            reasons['matching_interests'] = [team_domain]
        
        # Experience fit
        if user.get('experience_level') == 'intermediate':
            reasons['experience_fit'] = 'Good fit for team skill requirements'
        
        # Overall explanation
        if score >= 0.8:
            reasons['overall'] = 'Excellent match! Your skills align perfectly.'
        elif score >= 0.7:
            reasons['overall'] = 'Great match! Strong alignment with team needs.'
        else:
            reasons['overall'] = 'Good match. You can contribute to this team.'
        
        return reasons
