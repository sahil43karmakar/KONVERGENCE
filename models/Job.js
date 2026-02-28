const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
    {
        company: {
            type: String,
            required: [true, 'Company name is required'],
            trim: true,
        },
        role: {
            type: String,
            required: [true, 'Role is required'],
            trim: true,
        },
        location: {
            type: String,
            required: [true, 'Location is required'],
            trim: true,
        },
        type: {
            type: String,
            enum: ['full-time', 'internship', 'remote'],
            required: [true, 'Job type is required'],
        },
        salary: {
            type: Number,
            required: [true, 'Salary is required'],
            min: 0,
        },
        deadline: {
            type: Date,
            required: [true, 'Deadline is required'],
        },
        skillsRequired: {
            type: [String],
            default: [],
        },
        description: {
            type: String,
            default: '',
        },
        applyLink: {
            type: String,
            default: '',
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
    },
    { timestamps: true }
);

// Text index for keyword search on company & role
jobSchema.index({ company: 'text', role: 'text' });

module.exports = mongoose.model('Job', jobSchema);
