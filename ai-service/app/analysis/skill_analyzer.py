from typing import List, Dict

class SkillAnalyzer:
    def analyze_gaps(self, current_skills: List[str], required_skills: List[str]) -> Dict:
        """Analyze missing skills and generate a gap report"""
        
        current_set = set(s.lower() for s in current_skills)
        needed_set = set(s.lower() for s in required_skills)
        
        missing = [param for param in needed_set if param not in current_set]
        covered = [param for param in needed_set if param in current_set]
        coverage_percent = (len(covered) / len(needed_set)) * 100 if needed_set else 100
        
        heatmap = {}
        for skill in required_skills:
            if skill.lower() in current_set:
                heatmap[skill] = "green"  # Strong
            else:
                heatmap[skill] = "red"    # Missing
        
        return {
            "missing_skills": missing,
            "coverage_percent": round(coverage_percent, 1),
            "heatmap": heatmap,
            "status": "strong" if coverage_percent >= 80 else "needs_improvement" if coverage_percent >= 50 else "critical"
        }
