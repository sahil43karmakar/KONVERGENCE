const User = require('../models/User');

// ── Update Profile (student or recruiter) ───────
exports.updateProfile = async (req, res, next) => {
    try {
        // Whitelist allowed fields
        const allowedFields = [
            'name', 'firstName', 'middleName', 'lastName',
            'location', 'skills', 'bio', 'expectedSalary', 'photoUrl',
            'companyName', 'position', 'companyWebsite', 'hiringFor',
        ];

        const updates = {};
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) updates[field] = req.body[field];
        });

        const user = await User.findByIdAndUpdate(req.user._id, updates, {
            new: true,
            runValidators: true,
        });

        res.json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

// ── Get Profile ─────────────────────────────────
exports.getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        res.json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};
