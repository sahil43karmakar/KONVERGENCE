const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            maxlength: 100,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            minlength: 6,
            select: false, // never returned by default
        },
        role: {
            type: String,
            enum: ['jobseeker', 'recruiter', 'admin'],
            default: 'jobseeker',
        },
        googleId: {
            type: String,
            default: null,
        },
        avatar: {
            type: String,
            default: null,
        },
        resumeUrl: {
            type: String,
            default: null,
        },
        // ── Student profile fields ──────────────────
        firstName: { type: String, default: '' },
        middleName: { type: String, default: '' },
        lastName: { type: String, default: '' },
        location: { type: String, default: '' },
        skills: { type: [String], default: [] },
        bio: { type: String, default: '' },
        expectedSalary: { type: String, default: '' },
        photoUrl: { type: String, default: null },
        // ── Recruiter profile fields ────────────────
        companyName: { type: String, default: '' },
        position: { type: String, default: '' },
        companyWebsite: { type: String, default: '' },
        hiringFor: { type: [String], default: [] },
        // ─────────────────────────────────────────────
        refreshToken: {
            type: String,
            select: false,
        },
        resetPasswordToken: {
            type: String,
            default: null,
        },
        resetPasswordExpires: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

// ── Hash password before save ───────────────────
userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) return next();
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// ── Instance method: compare password ───────────
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
