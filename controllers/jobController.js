const Job = require('../models/Job');

// ── Get Jobs (search, filter, sort, paginate) ───
exports.getJobs = async (req, res, next) => {
    try {
        const {
            search, location, type, skills,
            salaryMin, salaryMax, deadlineBefore,
            sortBy = 'newest', page = 1, limit = 6,
        } = req.query;

        const filter = {};

        // Keyword search (company or role)
        if (search) {
            const q = new RegExp(search, 'i');
            filter.$or = [{ company: q }, { role: q }];
        }

        if (location) filter.location = location;
        if (type) filter.type = type;

        // Skills filter ($in — match any)
        if (skills) {
            const skillArr = Array.isArray(skills) ? skills : skills.split(',');
            filter.skillsRequired = {
                $elemMatch: { $in: skillArr.map(s => new RegExp(`^${s.trim()}$`, 'i')) },
            };
        }

        // Salary range
        if (salaryMin || salaryMax) {
            filter.salary = {};
            if (salaryMin) filter.salary.$gte = Number(salaryMin);
            if (salaryMax) filter.salary.$lte = Number(salaryMax);
        }

        // Deadline filter
        if (deadlineBefore) {
            filter.deadline = { $lte: new Date(deadlineBefore) };
        }

        // Sorting
        let sort = {};
        if (sortBy === 'salary') sort = { salary: -1 };
        else if (sortBy === 'deadline') sort = { deadline: 1 };
        else sort = { createdAt: -1 }; // newest

        const pageNum = Math.max(1, Number(page));
        const lim = Math.max(1, Math.min(Number(limit), 50));

        const [jobs, total] = await Promise.all([
            Job.find(filter).sort(sort).skip((pageNum - 1) * lim).limit(lim),
            Job.countDocuments(filter),
        ]);

        res.json({
            success: true,
            jobs,
            total,
            totalPages: Math.ceil(total / lim),
            currentPage: pageNum,
        });
    } catch (error) {
        next(error);
    }
};

// ── Get Job By Id ───────────────────────────────
exports.getJobById = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
        res.json({ success: true, data: job });
    } catch (error) {
        next(error);
    }
};

// ── Personalized Feed ───────────────────────────
exports.getPersonalizedFeed = async (req, res, next) => {
    try {
        const userSkills = req.user?.skills || [];
        const now = new Date();

        // Only active (non-expired) jobs
        const activeJobs = await Job.find({ deadline: { $gt: now } });

        if (userSkills.length === 0) {
            return res.json({ success: true, data: activeJobs.slice(0, 5) });
        }

        const normalizedUser = userSkills.map(s => s.toLowerCase().trim());

        const scored = activeJobs.map(job => {
            const jobSkills = job.skillsRequired || [];
            if (jobSkills.length === 0) {
                return { job, matchPercentage: 100, matchedSkills: [], missingSkills: [], opportunityScore: 10 };
            }

            const matchedSkills = jobSkills.filter(s => normalizedUser.includes(s.toLowerCase().trim()));
            const missingSkills = jobSkills.filter(s => !normalizedUser.includes(s.toLowerCase().trim()));
            const matchPercentage = Math.round((matchedSkills.length / jobSkills.length) * 100);

            // Opportunity score (same logic as frontend intelligence.js)
            let score = matchPercentage * 0.1;
            if (matchPercentage > 60) score += 5;
            if (job.salary >= 30000) score += 3;
            if (job.type === 'remote') score += 2;
            const daysLeft = Math.ceil((new Date(job.deadline) - now) / (1000 * 60 * 60 * 24));
            if (daysLeft > 7) score += 2;

            return { job, matchPercentage, matchedSkills, missingSkills, opportunityScore: Math.round(score * 100) / 100 };
        });

        scored.sort((a, b) => b.opportunityScore - a.opportunityScore);

        res.json({ success: true, data: scored.slice(0, 5) });
    } catch (error) {
        next(error);
    }
};

// ── Create Job (admin/recruiter) ────────────────
exports.createJob = async (req, res, next) => {
    try {
        const { company, role, location, type, salary, deadline, skillsRequired, description, applyLink } = req.body;

        const job = await Job.create({
            company, role, location, type, salary, deadline,
            skillsRequired: skillsRequired || [],
            description, applyLink,
            createdBy: req.user._id,
        });

        res.status(201).json({ success: true, data: job });
    } catch (error) {
        next(error);
    }
};

// ── Update Job (admin/recruiter) ────────────────
exports.updateJob = async (req, res, next) => {
    try {
        const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
        res.json({ success: true, data: job });
    } catch (error) {
        next(error);
    }
};

// ── Delete Job (admin/recruiter) ────────────────
exports.deleteJob = async (req, res, next) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);
        if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
        res.json({ success: true, message: 'Job deleted' });
    } catch (error) {
        next(error);
    }
};
