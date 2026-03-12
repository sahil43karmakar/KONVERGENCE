const Bookmark = require('../models/Bookmark');
const Job = require('../models/Job');

// ── Toggle Bookmark ─────────────────────────────
exports.toggleBookmark = async (req, res, next) => {
    try {
        const { jobId } = req.params;
        const userId = req.user._id;

        const existing = await Bookmark.findOne({ user: userId, job: jobId });

        if (existing) {
            await Bookmark.findByIdAndDelete(existing._id);
            const ids = await Bookmark.find({ user: userId }).distinct('job');
            return res.json({ success: true, bookmarked: false, bookmarkIds: ids });
        }

        // Verify job exists
        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

        await Bookmark.create({ user: userId, job: jobId });
        const ids = await Bookmark.find({ user: userId }).distinct('job');
        res.json({ success: true, bookmarked: true, bookmarkIds: ids });
    } catch (error) {
        next(error);
    }
};

// ── Get Bookmarked Jobs ─────────────────────────
exports.getBookmarks = async (req, res, next) => {
    try {
        const bookmarks = await Bookmark.find({ user: req.user._id }).populate('job');
        const jobs = bookmarks.map(b => b.job).filter(Boolean);
        res.json({ success: true, data: jobs });
    } catch (error) {
        next(error);
    }
};

// ── Get Bookmark IDs (lightweight) ──────────────
exports.getBookmarkIds = async (req, res, next) => {
    try {
        const ids = await Bookmark.find({ user: req.user._id }).distinct('job');
        res.json({ success: true, data: ids });
    } catch (error) {
        next(error);
    }
};
