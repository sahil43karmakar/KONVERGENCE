const User = require('../models/User');

// ── Upload Resume ───────────────────────────────
exports.uploadResume = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const user = await User.findById(req.user._id);
        user.resumeUrl = req.file.path; // Cloudinary URL
        await user.save();

        res.json({
            success: true,
            message: 'Resume uploaded successfully',
            data: { resumeUrl: user.resumeUrl },
        });
    } catch (error) {
        next(error);
    }
};

// ── Upload Profile Photo ────────────────────────
exports.uploadPhoto = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const user = await User.findById(req.user._id);
        user.photoUrl = req.file.path; // Cloudinary URL
        await user.save();

        res.json({
            success: true,
            message: 'Photo uploaded successfully',
            data: { photoUrl: user.photoUrl },
        });
    } catch (error) {
        next(error);
    }
};
