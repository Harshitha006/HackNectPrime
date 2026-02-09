from typing import List, Dict

STRUGGLE_KEYWORDS = [
    "stuck", "error", "fail", "broken", "help", "blocked", "issue", "bug", "can't",
    "confused", "lost", "hard", "difficult", "problem", "missed", "deadline", "urgent"
]

class MentorRadar:
    def analyze_team_status(self, messages: List[str]) -> Dict:
        """Analyze team chat to detect struggle indicators"""
        
        struggle_count = 0
        total_messages = len(messages)
        
        if total_messages == 0:
            return {"struggle_score": 0, "status": "inactive"}
            
        mentions = []
        for msg in messages:
            msg_lower = msg.lower()
            found = [kw for kw in STRUGGLE_KEYWORDS if kw in msg_lower]
            if found:
                struggle_count += 1
                mentions.extend(found)
                
        struggle_ratio = struggle_count / total_messages
        
        # Determine status
        if struggle_ratio > 0.3 or struggle_count > 5:
            status = "needs_mentor"
            suggestion = "Consider requesting mentor guidance for technical issues."
        elif struggle_ratio > 0.1:
            status = "mild_struggle"
            suggestion = "Keep an eye on progress."
        else:
            status = "healthy"
            suggestion = "Team is progressing well."
            
        return {
            "struggle_score": round(struggle_ratio, 2),
            "keyword_count": struggle_count,
            "detected_keywords": list(set(mentions)),
            "status": status,
            "recommendation": suggestion
        }
