const Application = require('../models/Application');
const Job = require('../models/Job');

// ── Apply to Job ────────────────────────────────
exports.applyToJob = async (req, res, next) => {
    try {
        const { jobId } = req.params;
        const userId = req.user._id;

        // Check job exists
        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

        // Check duplicate
        const existing = await Application.findOne({ user: userId, job: jobId });
        if (existing) {
            return res.status(409).json({ success: false, message: 'Already applied to this job' });
        }

        const application = await Application.create({
            user: userId,
            job: jobId,
            status: 'applied',
        });

        res.status(201).json({ success: true, data: application });
    } catch (error) {
        next(error);
    }
};

// ── Get My Applications ─────────────────────────
exports.getMyApplications = async (req, res, next) => {
    try {
        const apps = await Application.find({ user: req.user._id })
            .populate('job')
            .sort({ appliedAt: -1 });

        res.json({ success: true, data: apps });
    } catch (error) {
        next(error);
    }
};

// ── Update Application Status (Tracker drag) ───
exports.updateStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const validStatuses = ['applied', 'interview', 'selected', 'rejected'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: `Status must be one of: ${validStatuses.join(', ')}` });
        }

        const app = await Application.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { status },
            { new: true }
        );

        if (!app) return res.status(404).json({ success: false, message: 'Application not found' });
        res.json({ success: true, data: app });
    } catch (error) {
        next(error);
    }
};

// ── Remove Application ──────────────────────────
exports.removeApplication = async (req, res, next) => {
    try {
        const app = await Application.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id,
        });
        if (!app) return res.status(404).json({ success: false, message: 'Application not found' });
        res.json({ success: true, message: 'Application removed' });
    } catch (error) {
        next(error);
    }
};

// ── Check if Applied ────────────────────────────
exports.hasApplied = async (req, res, next) => {
    try {
        const exists = await Application.exists({ user: req.user._id, job: req.params.jobId });
        res.json({ success: true, applied: !!exists });
    } catch (error) {
        next(error);
    }
};
