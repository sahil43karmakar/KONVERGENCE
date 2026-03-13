const Job = require('../models/Job');

/* ── Intent keywords ─────────────────────────────── */
const JOB_KEYWORDS = ['job', 'jobs', 'opening', 'openings', 'vacancy', 'vacancies', 'position', 'positions', 'hiring', 'hire', 'work', 'career', 'opportunity', 'opportunities'];
const SEARCH_KEYWORDS = ['find', 'search', 'show', 'list', 'get', 'looking', 'want', 'need', 'any', 'available'];
const TYPE_MAP = { remote: 'remote', 'full-time': 'full-time', 'full time': 'full-time', fulltime: 'full-time', intern: 'internship', internship: 'internship' };
const GREETING_KEYWORDS = ['hi', 'hello', 'hey', 'hola', 'sup', 'yo', 'greetings', 'good morning', 'good evening', 'good afternoon'];
const HELP_KEYWORDS = ['help', 'how', 'what', 'feature', 'apply', 'about', 'skillsync', 'explain'];

/* ── Greeting responses ──────────────────────────── */
const GREETINGS = [
    "👋 Hey there! I'm the SkillSync assistant. Ask me about jobs — try \"show remote jobs\" or \"internships in Bangalore\"!",
    "Hello! 🎉 Ready to find your perfect opportunity? Ask me things like \"find python developer jobs\" or \"what internships are available?\"",
    "Hey! 👋 I can help you discover jobs on SkillSync. Try asking \"show full-time jobs\" or \"jobs with React skills\"!",
];

/* ── FAQ responses ───────────────────────────────── */
const FAQ = {
    apply: "To apply for a job, browse the Jobs page, click on a role you like, and hit the Apply button. You can also save jobs for later using the bookmark feature! 📌",
    about: "SkillSync is an Opportunity Intelligence Platform that matches you with jobs based on your skills. We analyze your profile and find the best-fit roles automatically! 🚀",
    features: "Here's what SkillSync offers:\n• 🔍 AI-powered job matching\n• 📊 Skill gap analysis\n• 📌 Bookmark & track applications\n• 🎯 Personalized job feed\n• 📄 Resume upload & parsing",
    help: "I can help you with:\n• Finding jobs (\"show remote jobs\", \"find python internships\")\n• Platform info (\"what is SkillSync?\")\n• How to apply, features, and more!\n\nJust type your question! 😊",
};

/* ── Format job results ──────────────────────────── */
function formatJobs(jobs, query) {
    if (jobs.length === 0) {
        return `😕 I couldn't find any jobs matching "${query}". Try broader terms like "remote jobs" or "internships"!\n\nBrowse all jobs on the Jobs page for the full listing.`;
    }

    let response = `🎯 Found ${jobs.length} matching job${jobs.length > 1 ? 's' : ''}:\n\n`;
    jobs.forEach((job, i) => {
        const salary = job.salary ? `₹${job.salary.toLocaleString()}` : 'Not specified';
        const deadline = job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Open';
        response += `${i + 1}. **${job.role}** at ${job.company}\n`;
        response += `   📍 ${job.location} · ${job.type} · 💰 ${salary}\n`;
        if (job.skillsRequired?.length) {
            response += `   🛠 Skills: ${job.skillsRequired.join(', ')}\n`;
        }
        response += `   ⏰ Deadline: ${deadline}\n\n`;
    });
    response += "Head to the Jobs page to apply! 🚀";
    return response;
}

/* ── Detect intent & build DB filter ─────────────── */
function parseIntent(message) {
    const lower = message.toLowerCase().trim();
    const words = lower.split(/\s+/);

    // Greeting
    if (GREETING_KEYWORDS.some(g => lower.includes(g)) && words.length <= 4) {
        return { type: 'greeting' };
    }

    // FAQ / Help
    if (HELP_KEYWORDS.some(h => lower.includes(h)) && !JOB_KEYWORDS.some(j => lower.includes(j))) {
        if (lower.includes('apply')) return { type: 'faq', key: 'apply' };
        if (lower.includes('skillsync') || lower.includes('about') || lower.includes('what is')) return { type: 'faq', key: 'about' };
        if (lower.includes('feature')) return { type: 'faq', key: 'features' };
        return { type: 'faq', key: 'help' };
    }

    // Job search
    const isJobRelated = JOB_KEYWORDS.some(k => lower.includes(k)) || SEARCH_KEYWORDS.some(k => lower.includes(k));
    if (isJobRelated) {
        const filter = {};

        // Detect job type
        for (const [keyword, type] of Object.entries(TYPE_MAP)) {
            if (lower.includes(keyword)) {
                filter.type = type;
                break;
            }
        }

        // Extract potential skill names (common tech skills)
        const techSkills = ['javascript', 'python', 'react', 'node', 'nodejs', 'java', 'c++', 'typescript',
            'html', 'css', 'sql', 'mongodb', 'aws', 'docker', 'kubernetes', 'flutter', 'dart',
            'angular', 'vue', 'django', 'flask', 'express', 'spring', 'rust', 'go', 'swift',
            'kotlin', 'php', 'ruby', 'rails', 'graphql', 'redis', 'postgresql', 'mysql',
            'figma', 'ui', 'ux', 'data science', 'machine learning', 'ml', 'ai', 'devops'];
        const matchedSkills = techSkills.filter(s => lower.includes(s));
        if (matchedSkills.length > 0) {
            filter.skillsRequired = {
                $elemMatch: { $in: matchedSkills.map(s => new RegExp(s, 'i')) }
            };
        }

        // Extract location hints (remove common words)
        const stopWords = [...JOB_KEYWORDS, ...SEARCH_KEYWORDS, ...Object.keys(TYPE_MAP), ...techSkills,
            'in', 'at', 'for', 'with', 'and', 'or', 'the', 'a', 'an', 'me', 'my', 'i', 'please',
            'can', 'you', 'some', 'do', 'have', 'is', 'are', 'there'];
        const remaining = words.filter(w => !stopWords.includes(w) && w.length > 2);
        if (remaining.length > 0 && !filter.type && matchedSkills.length === 0) {
            // Use remaining words as search terms across company / role / location
            const searchRegex = new RegExp(remaining.join('|'), 'i');
            filter.$or = [{ company: searchRegex }, { role: searchRegex }, { location: searchRegex }];
        } else if (remaining.length > 0) {
            // Could be a location
            const locRegex = new RegExp(remaining.join('|'), 'i');
            filter.location = locRegex;
        }

        return { type: 'job_search', filter, query: message };
    }

    // Default: try treating entire message as a search
    return {
        type: 'job_search', filter: {
            $or: [
                { company: new RegExp(lower, 'i') },
                { role: new RegExp(lower, 'i') },
                { location: new RegExp(lower, 'i') },
                { skillsRequired: { $elemMatch: { $regex: new RegExp(lower, 'i') } } },
            ]
        }, query: message
    };
}

/* ── Main chat handler ───────────────────────────── */
exports.chat = async (req, res, next) => {
    try {
        const { message } = req.body;
        if (!message || typeof message !== 'string' || message.trim().length === 0) {
            return res.status(400).json({ success: false, message: 'Message is required' });
        }

        const intent = parseIntent(message);

        let reply;
        switch (intent.type) {
            case 'greeting':
                reply = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
                break;
            case 'faq':
                reply = FAQ[intent.key] || FAQ.help;
                break;
            case 'job_search': {
                const jobs = await Job.find(intent.filter).sort({ createdAt: -1 }).limit(5);
                reply = formatJobs(jobs, intent.query);
                break;
            }
            default:
                reply = FAQ.help;
        }

        res.json({ success: true, reply });
    } catch (error) {
        next(error);
    }
};
