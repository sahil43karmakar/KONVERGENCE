/**
 * Seed script — populates MongoDB with the 18 mock jobs from the frontend
 * and creates a default admin user.
 *
 * Usage:  node utils/seed.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const Job = require('../models/Job');
const User = require('../models/User');

const mockJobs = [
    { company: 'TechNova', role: 'Frontend Developer', location: 'Bangalore', type: 'full-time', salary: 45000, deadline: '2026-04-15', skillsRequired: ['React', 'JavaScript', 'CSS', 'TypeScript', 'Git'], description: 'We are looking for a passionate Frontend Developer to join our product team.', applyLink: 'https://technova.careers/frontend', createdAt: '2026-02-01' },
    { company: 'DataWave', role: 'Data Analyst Intern', location: 'Remote', type: 'internship', salary: 15000, deadline: '2026-03-20', skillsRequired: ['Python', 'SQL', 'Excel', 'Tableau'], description: 'Join our analytics team as a Data Analyst Intern.', applyLink: 'https://datawave.io/internship', createdAt: '2026-02-05' },
    { company: 'CloudPeak', role: 'Full Stack Developer', location: 'Hyderabad', type: 'full-time', salary: 55000, deadline: '2026-04-01', skillsRequired: ['React', 'Node.js', 'MongoDB', 'Express', 'JavaScript', 'Docker'], description: 'CloudPeak is hiring a Full Stack Developer to build and maintain our cloud platform.', applyLink: 'https://cloudpeak.dev/careers', createdAt: '2026-02-10' },
    { company: 'DesignLab', role: 'UI/UX Designer', location: 'Mumbai', type: 'full-time', salary: 40000, deadline: '2026-03-25', skillsRequired: ['Figma', 'Adobe XD', 'CSS', 'User Research', 'Prototyping'], description: 'DesignLab is seeking a creative UI/UX Designer.', applyLink: 'https://designlab.co/jobs', createdAt: '2026-02-08' },
    { company: 'SecureNet', role: 'Cybersecurity Intern', location: 'Delhi', type: 'internship', salary: 12000, deadline: '2026-03-10', skillsRequired: ['Networking', 'Linux', 'Python', 'Wireshark'], description: 'Learn cybersecurity fundamentals while working on real security challenges.', applyLink: 'https://securenet.in/internship', createdAt: '2026-02-03' },
    { company: 'AIForge', role: 'ML Engineer', location: 'Remote', type: 'full-time', salary: 70000, deadline: '2026-04-20', skillsRequired: ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning', 'Mathematics'], description: 'AIForge is looking for an ML Engineer to develop models at scale.', applyLink: 'https://aiforge.ai/careers', createdAt: '2026-02-15' },
    { company: 'GreenTech', role: 'Backend Developer', location: 'Pune', type: 'full-time', salary: 48000, deadline: '2026-03-30', skillsRequired: ['Node.js', 'Express', 'MongoDB', 'Redis', 'Docker', 'AWS'], description: 'Build robust backend systems for our sustainability platform.', applyLink: 'https://greentech.co/backend', createdAt: '2026-02-12' },
    { company: 'PixelPerfect', role: 'React Developer', location: 'Remote', type: 'remote', salary: 50000, deadline: '2026-04-10', skillsRequired: ['React', 'JavaScript', 'TypeScript', 'Redux', 'Jest'], description: 'PixelPerfect is a fully remote company building design tools.', applyLink: 'https://pixelperfect.dev/react', createdAt: '2026-02-14' },
    { company: 'EduLearn', role: 'Content Developer Intern', location: 'Kolkata', type: 'internship', salary: 10000, deadline: '2026-03-15', skillsRequired: ['Technical Writing', 'Research', 'Communication'], description: 'Help create educational content for our learning platform.', applyLink: 'https://edulearn.com/intern', createdAt: '2026-02-06' },
    { company: 'FinEdge', role: 'Software Engineer', location: 'Chennai', type: 'full-time', salary: 52000, deadline: '2026-04-05', skillsRequired: ['Java', 'Spring Boot', 'SQL', 'Microservices', 'REST API'], description: 'FinEdge is a fintech startup building scalable payment systems.', applyLink: 'https://finedge.io/careers', createdAt: '2026-02-11' },
    { company: 'GameVerse', role: 'Game Developer Intern', location: 'Bangalore', type: 'internship', salary: 18000, deadline: '2026-03-28', skillsRequired: ['Unity', 'C#', 'Game Design', '3D Modeling'], description: 'Intern with our game development team to build AR/VR experiences.', applyLink: 'https://gameverse.studio/intern', createdAt: '2026-02-09' },
    { company: 'DevOps Pro', role: 'DevOps Engineer', location: 'Remote', type: 'remote', salary: 62000, deadline: '2026-04-18', skillsRequired: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux', 'Terraform'], description: 'Manage and scale cloud infrastructure across multiple environments.', applyLink: 'https://devopspro.com/engineer', createdAt: '2026-02-16' },
    { company: 'MobiCraft', role: 'Mobile App Developer', location: 'Noida', type: 'full-time', salary: 46000, deadline: '2026-03-22', skillsRequired: ['React Native', 'JavaScript', 'Firebase', 'REST API'], description: 'Build cross-platform mobile apps for our e-commerce clients.', applyLink: 'https://mobicraft.in/mobile', createdAt: '2026-02-07' },
    { company: 'TechNova', role: 'QA Automation Intern', location: 'Bangalore', type: 'internship', salary: 14000, deadline: '2026-02-20', skillsRequired: ['Selenium', 'Python', 'Testing', 'JIRA'], description: 'Learn test automation in a fast-paced environment.', applyLink: 'https://technova.careers/qa-intern', createdAt: '2026-01-25' },
    { company: 'DataWave', role: 'Backend Engineer', location: 'Hyderabad', type: 'full-time', salary: 58000, deadline: '2026-04-12', skillsRequired: ['Python', 'Django', 'PostgreSQL', 'Redis', 'Docker'], description: 'Build and maintain high-traffic data pipelines and APIs.', applyLink: 'https://datawave.io/backend', createdAt: '2026-02-18' },
    { company: 'CloudPeak', role: 'Cloud Architect Intern', location: 'Remote', type: 'internship', salary: 20000, deadline: '2026-02-25', skillsRequired: ['AWS', 'Cloud Computing', 'Networking', 'Linux'], description: 'Get hands-on cloud architecture experience.', applyLink: 'https://cloudpeak.dev/intern', createdAt: '2026-01-20' },
    { company: 'PixelPerfect', role: 'Technical Writer', location: 'Remote', type: 'remote', salary: 35000, deadline: '2026-04-08', skillsRequired: ['Technical Writing', 'Markdown', 'Git', 'Documentation'], description: 'Write clear and concise technical documentation.', applyLink: 'https://pixelperfect.dev/writer', createdAt: '2026-02-13' },
    { company: 'AIForge', role: 'Research Intern', location: 'Bangalore', type: 'internship', salary: 22000, deadline: '2026-03-18', skillsRequired: ['Python', 'Machine Learning', 'Research', 'Mathematics', 'Statistics'], description: 'Work alongside researchers on cutting-edge AI projects.', applyLink: 'https://aiforge.ai/research-intern', createdAt: '2026-02-04' },
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await Job.deleteMany({});
        await User.deleteMany({ role: 'admin' });
        console.log('🗑️  Cleared old jobs & admin');

        // Seed jobs
        const jobs = await Job.insertMany(mockJobs);
        console.log(`📦 Seeded ${jobs.length} jobs`);

        // Create default admin (model pre-save hook handles hashing)
        await User.create({
            name: 'Admin',
            email: 'admin@skillsync.com',
            password: 'admin123',
            role: 'admin',
        });
        console.log('👤 Created admin: admin@skillsync.com / admin123');

        // Create test recruiter
        await User.create({
            name: 'Test Recruiter',
            email: 'recruiter@test.com',
            password: 'test123',
            role: 'recruiter',
            companyName: 'TechNova',
            position: 'HR Manager',
        });
        console.log('👤 Created recruiter: recruiter@test.com / test123');

        console.log('\n🎉 Seed complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error.message);
        process.exit(1);
    }
}

seed();
