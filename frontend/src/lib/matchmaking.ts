/**
 * HACKNECT AI MATCHMAKING ENGINE
 * Implements vector-based matching using cosine similarity.
 */

export interface Skill {
    name: string;
    weight: number;
}

export interface MatchProfile {
    id: string;
    skills: string[];
    interests: string[];
    experienceLevel: number; // 1-5
}

/**
 * Calculates cosine similarity between two numeric vectors
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
    const dotProduct = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));

    if (magnitudeA === 0 || magnitudeB === 0) return 0;
    return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Creates a normalized vector from a list of skills based on a vocabulary
 */
export function createVector(skills: string[], vocabulary: string[]): number[] {
    return vocabulary.map(term =>
        skills.some(skill => skill.toLowerCase() === term.toLowerCase()) ? 1 : 0
    );
}

const GLOBAL_VOCABULARY = [
    "Python", "React", "Node.js", "Machine Learning", "Data Science",
    "UI Design", "UX Research", "Solidity", "Blockchain", "TypeScript",
    "Go", "Kubernetes", "Docker", "TensorFlow", "FastAPI", "Next.js",
    "Tailwind CSS", "Firebase", "PostgreSQL", "MongoDB", "Cybersecurity",
    "Cloud Computing", "AWS", "Figma", "DevOps"
];

/**
 * Main matching function
 */
export function calculateMatchScore(user: MatchProfile, team: MatchProfile): {
    score: number;
    reasons: string[];
} {
    // 1. Skill Match (40%)
    const userSkillVec = createVector(user.skills, GLOBAL_VOCABULARY);
    const teamSkillVec = createVector(team.skills, GLOBAL_VOCABULARY);
    const skillSimilarity = cosineSimilarity(userSkillVec, teamSkillVec);

    // 2. Interest Match (20%) - Jaccard Similarity
    const userInterests = new Set(user.interests.map(i => i.toLowerCase()));
    const teamInterests = new Set(team.interests.map(i => i.toLowerCase()));
    const intersection = new Set([...userInterests].filter(x => teamInterests.has(x)));
    const union = new Set([...userInterests, ...teamInterests]);
    const interestSimilarity = union.size > 0 ? intersection.size / union.size : 0.5;

    // 3. Experience Match (25%)
    const experienceSimilarity = 1 - Math.abs(user.experienceLevel - team.experienceLevel) / 5;

    // 4. Availability/Bonus (15%)
    const availabilityScore = 1.0;

    const finalScore = (
        skillSimilarity * 0.40 +
        interestSimilarity * 0.20 +
        experienceSimilarity * 0.25 +
        availabilityScore * 0.15
    );

    const reasons: string[] = [];
    if (skillSimilarity > 0.7) reasons.push("Exceptional skill alignment");
    if (intersection.size > 0) reasons.push(`Shared focus in ${Array.from(intersection)[0]}`);
    if (experienceSimilarity > 0.8) reasons.push("Compatible experience levels");

    return {
        score: finalScore,
        reasons
    };
}
