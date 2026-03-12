const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

// ── Admin Stats ─────────────────────────────────
exports.getStats = async (req, res, next) => {
    try {
        const now = new Date();

        const [totalUsers, totalApplications, totalJobs, activeJobs, expiredJobs] = await Promise.all([
            User.countDocuments(),
            Application.countDocuments(),
            Job.countDocuments(),
            Job.countDocuments({ deadline: { $gt: now } }),
            Job.countDocuments({ deadline: { $lte: now } }),
        ]);

        // Most applied job
        const mostApplied = await Application.aggregate([
            { $group: { _id: '$job', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 1 },
        ]);

        let mostAppliedJob = null;
        if (mostApplied.length > 0) {
            const job = await Job.findById(mostApplied[0]._id);
            if (job) {
                mostAppliedJob = { ...job.toObject(), applicationCount: mostApplied[0].count };
            }
        }

        res.json({
            success: true,
            data: {
                totalUsers,
                totalApplications,
                totalJobs,
                activeJobs,
                expiredJobs,
                mostAppliedJob,
            },
        });
    } catch (error) {
        next(error);
    }
};
