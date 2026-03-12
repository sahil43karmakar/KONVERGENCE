const User = require('../models/User');
const generateTokens = require('../utils/generateToken');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// ── Register ────────────────────────────────────
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        // Prevent self-assigning admin role
        const allowedRoles = ['jobseeker', 'recruiter'];
        const userRole = allowedRoles.includes(role) ? role : 'jobseeker';

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'Email already registered' });
        }

        const user = await User.create({ name, email, password, role: userRole });

        const { accessToken, refreshToken } = generateTokens(user);

        // Persist refresh token
        user.refreshToken = refreshToken;
        await user.save();

        res.status(201).json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            accessToken,
            refreshToken,
        });
    } catch (error) {
        next(error);
    }
};

// ── Login ───────────────────────────────────────
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        if (!user.password) {
            return res
                .status(401)
                .json({ success: false, message: 'Account uses Google sign-in. Please login with Google.' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const { accessToken, refreshToken } = generateTokens(user);
        user.refreshToken = refreshToken;
        await user.save();

        res.json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            accessToken,
            refreshToken,
        });
    } catch (error) {
        next(error);
    }
};

// ── Admin Login ─────────────────────────────────
exports.adminLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email, role: 'admin' }).select('+password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
        }

        const { accessToken, refreshToken } = generateTokens(user);
        user.refreshToken = refreshToken;
        await user.save();

        res.json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            accessToken,
            refreshToken,
        });
    } catch (error) {
        next(error);
    }
};

// ── Google OAuth callback ───────────────────────
exports.googleCallback = async (req, res, next) => {
    try {
        const user = req.user; // set by passport
        const { accessToken, refreshToken } = generateTokens(user);

        user.refreshToken = refreshToken;
        await user.save();

        // Redirect to frontend with tokens as query params
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
        res.redirect(
            `${clientUrl}/oauth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`
        );
    } catch (error) {
        next(error);
    }
};

// ── Refresh Token ───────────────────────────────
exports.refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ success: false, message: 'Refresh token is required' });
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        const user = await User.findById(decoded.id).select('+refreshToken');
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({ success: false, message: 'Invalid refresh token' });
        }

        const tokens = generateTokens(user);
        user.refreshToken = tokens.refreshToken;
        await user.save();

        res.json({
            success: true,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        });
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Refresh token expired or invalid' });
    }
};

// ── Logout ──────────────────────────────────────
exports.logout = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select('+refreshToken');
        if (user) {
            user.refreshToken = null;
            await user.save();
        }

        res.json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        next(error);
    }
};

// ── Get Current User ────────────────────────────
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        res.json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

// ── Forgot Password ─────────────────────────────
exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'Start by signing up with this email' });
        }

        if (!user.password && user.googleId) {
            return res.status(400).json({ success: false, message: 'You logged in via Google. Please use Google to sign in.' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Hash token and set to user model
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour

        await user.save({ validateBeforeSave: false });

        // In a real app, send an email here.
        // For development, we return it in the response and log it.
        const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
        console.log(`\n\n[DEV] Reset Password URL generated:\n${resetUrl}\n\n`);

        res.status(200).json({
            success: true,
            message: 'Reset link sent to your email (in dev mode: check console or response)',
            data: { resetUrl } // DEV MODE ONLY
        });
    } catch (error) {
        next(error);
    }
};

// ── Reset Password ──────────────────────────────
exports.resetPassword = async (req, res, next) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({ success: false, message: 'Token and new password required' });
        }

        // Reconstruct the hashed token
        const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

        // Find user by token and ensure token has not expired
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
        }

        // Update password and clear reset fields
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({ success: true, message: 'Password reset successful. Please login with your new password.' });
    } catch (error) {
        next(error);
    }
};
