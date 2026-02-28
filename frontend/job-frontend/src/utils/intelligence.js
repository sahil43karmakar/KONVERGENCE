/* ── Centralized Intelligence Scoring ──
   All scoring formulas live here. Mock API and (later) backend use these. */

/**
 * Skill Match — compares user skills against job requirements
 * Handles edge cases: zero job skills → 100%, zero user skills → 0% with flag
 */
export function calcSkillMatch(userSkills = [], jobSkills = []) {
    if (!jobSkills || jobSkills.length === 0) {
        return { matchPercentage: 100, matchedSkills: [], missingSkills: [], needsSkills: false };
    }

    const normalizedUser = userSkills.map(s => s.toLowerCase().trim());

    if (normalizedUser.length === 0) {
        return {
            matchPercentage: 0,
            matchedSkills: [],
            missingSkills: [...jobSkills],
            needsSkills: true
        };
    }

    const matchedSkills = jobSkills.filter(s => normalizedUser.includes(s.toLowerCase().trim()));
    const missingSkills = jobSkills.filter(s => !normalizedUser.includes(s.toLowerCase().trim()));
    const matchPercentage = Math.round((matchedSkills.length / jobSkills.length) * 100);

    return { matchPercentage, matchedSkills, missingSkills, needsSkills: false };
}

/**
 * Opportunity Priority Score — continuous range avoids ties
 * Range: 0–22+ (matchPercentage * 0.1 breaks integer ties)
 */
export function calcOpportunityScore(job, userSkills = [], salaryThreshold = 30000) {
    const { matchPercentage } = calcSkillMatch(userSkills, job.skillsRequired);
    let score = matchPercentage * 0.1; // 0–10 continuous

    if (matchPercentage > 60) score += 5;
    if (job.salary >= salaryThreshold) score += 3;
    if (job.type === 'remote') score += 2;

    const daysLeft = Math.ceil((new Date(job.deadline) - new Date()) / (1000 * 60 * 60 * 24));
    if (daysLeft > 7) score += 2;

    return Math.round(score * 100) / 100;
}

/**
 * Placement Readiness Score — normalized 0–100
 * Each component scaled to 0-100, then weighted average
 */
export function calcReadinessScore(user, applications = [], bookmarks = []) {
    const userSkills = user?.skills || [];

    // Average match across bookmarked/saved jobs (0–100)
    let avgMatch = 0;
    if (bookmarks.length > 0) {
        const totalMatch = bookmarks.reduce((sum, job) => {
            return sum + calcSkillMatch(userSkills, job.skillsRequired).matchPercentage;
        }, 0);
        avgMatch = totalMatch / bookmarks.length;
    }

    // Application activity (0–100): each app = 10pts, capped at 100
    const appScore = Math.min(applications.length * 10, 100);

    // Interview progress (0–100): each interview = 20pts, capped at 100
    const interviewCount = applications.filter(a => a.status === 'interview' || a.status === 'selected').length;
    const interviewScore = Math.min(interviewCount * 20, 100);

    // Resume bonus
    const resumeBonus = user?.resumeUrl ? 10 : 0;

    const rawScore = (avgMatch * 0.35) + (appScore * 0.25) + (interviewScore * 0.30) + resumeBonus;
    return Math.min(Math.round(rawScore), 100);
}

/**
 * Application Strategy — analyzes application quality
 */
export function calcStrategyMetrics(applications = [], userSkills = [], jobs = []) {
    if (applications.length === 0) {
        return {
            total: 0,
            highMatch: 0,
            lowMatch: 0,
            highMatchPercent: 0,
            suggestion: 'Start applying to opportunities to track your strategy.',
            rating: 'none'
        };
    }

    const jobMap = {};
    jobs.forEach(j => { jobMap[j.id] = j; });

    let highMatch = 0;
    let lowMatch = 0;

    applications.forEach(app => {
        const job = jobMap[app.jobId];
        if (job) {
            const { matchPercentage } = calcSkillMatch(userSkills, job.skillsRequired);
            if (matchPercentage >= 60) highMatch++;
            else lowMatch++;
        }
    });

    const highMatchPercent = Math.round((highMatch / applications.length) * 100);
    let suggestion, rating;

    if (highMatchPercent >= 70) {
        suggestion = 'Excellent strategy! You\'re focusing on high-match roles.';
        rating = 'excellent';
    } else if (highMatchPercent >= 40) {
        suggestion = 'Good balance. Try to increase high-match applications for better results.';
        rating = 'good';
    } else {
        suggestion = 'You\'re applying mostly to low-match roles. Focus on 60%+ match jobs for better outcomes.';
        rating = 'needs-improvement';
    }

    return { total: applications.length, highMatch, lowMatch, highMatchPercent, suggestion, rating };
}

/**
 * Missed Opportunities — high-match jobs user didn't apply to that have expired
 */
export function getMissedOpportunities(jobs = [], applications = [], userSkills = []) {
    const appliedJobIds = new Set(applications.map(a => a.jobId));
    const now = new Date();

    return jobs
        .filter(job => {
            const { matchPercentage } = calcSkillMatch(userSkills, job.skillsRequired);
            const isExpired = new Date(job.deadline) < now;
            const notApplied = !appliedJobIds.has(job.id);
            return matchPercentage >= 60 && isExpired && notApplied;
        })
        .map(job => ({
            ...job,
            ...calcSkillMatch(userSkills, job.skillsRequired)
        }));
}

/**
 * Trend indicator — compares current to previous readiness
 */
export function calcTrendIndicator(currentScore, previousScore) {
    const diff = currentScore - previousScore;
    if (diff > 0) return { direction: 'up', value: `+${diff}%`, color: 'var(--success)' };
    if (diff < 0) return { direction: 'down', value: `${diff}%`, color: 'var(--danger)' };
    return { direction: 'neutral', value: '0%', color: 'var(--text-muted)' };
}
