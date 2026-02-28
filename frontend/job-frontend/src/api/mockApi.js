/* ── Mock API Service Layer ──
   Persists state in localStorage. When backend is ready, swap these for Axios calls. */

import { mockJobs, defaultApplications, defaultBookmarks } from '../data/mockData';
import { calcSkillMatch, calcOpportunityScore } from '../utils/intelligence';

const BOOKMARKS_KEY = 'skillsync-bookmarks';
const APPS_KEY = 'skillsync-applications';

// Helpers
function getBookmarks() {
    const stored = localStorage.getItem(BOOKMARKS_KEY);
    return stored ? JSON.parse(stored) : [...defaultBookmarks];
}
function saveBookmarks(bookmarks) {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
}
function getApplications() {
    const stored = localStorage.getItem(APPS_KEY);
    return stored ? JSON.parse(stored) : [...defaultApplications];
}
function saveApplications(apps) {
    localStorage.setItem(APPS_KEY, JSON.stringify(apps));
}

// Simulate async delay
const delay = (ms = 300) => new Promise(r => setTimeout(r, ms));

/* ── Job Endpoints ── */

export async function fetchJobs(filters = {}) {
    await delay();
    let results = [...mockJobs];

    // Keyword search (company or role)
    if (filters.search) {
        const q = filters.search.toLowerCase();
        results = results.filter(j =>
            j.company.toLowerCase().includes(q) || j.role.toLowerCase().includes(q)
        );
    }

    // Location filter
    if (filters.location) {
        results = results.filter(j => j.location === filters.location);
    }

    // Type filter
    if (filters.type) {
        results = results.filter(j => j.type === filters.type);
    }

    // Skills filter ($in logic)
    if (filters.skills && filters.skills.length > 0) {
        results = results.filter(j =>
            filters.skills.some(s => j.skillsRequired.map(sk => sk.toLowerCase()).includes(s.toLowerCase()))
        );
    }

    // Salary range
    if (filters.salaryMin) {
        results = results.filter(j => j.salary >= Number(filters.salaryMin));
    }
    if (filters.salaryMax) {
        results = results.filter(j => j.salary <= Number(filters.salaryMax));
    }

    // Deadline filter (only show jobs with deadline after given date)
    if (filters.deadlineBefore) {
        results = results.filter(j => new Date(j.deadline) <= new Date(filters.deadlineBefore));
    }

    // Sorting
    if (filters.sortBy === 'newest') {
        results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (filters.sortBy === 'salary') {
        results.sort((a, b) => b.salary - a.salary);
    } else if (filters.sortBy === 'deadline') {
        results.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    }

    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 6;
    const total = results.length;
    const totalPages = Math.ceil(total / limit);
    const paginated = results.slice((page - 1) * limit, page * limit);

    return { jobs: paginated, total, totalPages, currentPage: page };
}

export async function fetchJobById(id) {
    await delay(200);
    return mockJobs.find(j => j.id === id) || null;
}

/* ── Bookmark Endpoints ── */

export async function fetchBookmarks() {
    await delay(200);
    const ids = getBookmarks();
    return mockJobs.filter(j => ids.includes(j.id));
}

export async function toggleBookmark(jobId) {
    await delay(100);
    const bookmarks = getBookmarks();
    const idx = bookmarks.indexOf(jobId);
    if (idx > -1) {
        bookmarks.splice(idx, 1);
    } else {
        bookmarks.push(jobId);
    }
    saveBookmarks(bookmarks);
    return bookmarks;
}

export async function isBookmarked(jobId) {
    const bookmarks = getBookmarks();
    return bookmarks.includes(jobId);
}

export function getBookmarkIds() {
    return getBookmarks();
}

/* ── Application Endpoints ── */

export async function fetchApplications() {
    await delay(200);
    const apps = getApplications();
    return apps.map(app => {
        const job = mockJobs.find(j => j.id === app.jobId);
        return { ...app, job };
    });
}

export async function applyToJob(jobId) {
    await delay(200);
    const apps = getApplications();
    if (apps.find(a => a.jobId === jobId)) {
        throw new Error('Already applied to this job');
    }
    const newApp = {
        id: 'a' + Date.now(),
        jobId,
        status: 'applied',
        appliedAt: new Date().toISOString().split('T')[0]
    };
    apps.push(newApp);
    saveApplications(apps);
    return newApp;
}

export async function updateApplicationStatus(appId, status) {
    await delay(100);
    const apps = getApplications();
    const app = apps.find(a => a.id === appId);
    if (app) {
        app.status = status;
        saveApplications(apps);
    }
    return app;
}

export async function removeApplication(appId) {
    await delay(100);
    const apps = getApplications();
    const filtered = apps.filter(a => a.id !== appId);
    saveApplications(filtered);
    return filtered;
}

export function hasApplied(jobId) {
    const apps = getApplications();
    return apps.some(a => a.jobId === jobId);
}

/* ── Personalized Feed ── */

export async function fetchPersonalizedFeed(userSkills = []) {
    await delay(300);
    const now = new Date();
    const activeJobs = mockJobs.filter(j => new Date(j.deadline) > now);

    const scored = activeJobs.map(job => ({
        ...job,
        ...calcSkillMatch(userSkills, job.skillsRequired),
        opportunityScore: calcOpportunityScore(job, userSkills)
    }));

    scored.sort((a, b) => b.opportunityScore - a.opportunityScore);
    return scored.slice(0, 5);
}

/* ── Admin Stats ── */

export async function fetchAdminStats() {
    await delay(300);
    const apps = getApplications();
    const now = new Date();

    // Count applications per job
    const appCounts = {};
    apps.forEach(a => { appCounts[a.jobId] = (appCounts[a.jobId] || 0) + 1; });

    let mostAppliedJobId = null;
    let maxApps = 0;
    Object.entries(appCounts).forEach(([jobId, count]) => {
        if (count > maxApps) { mostAppliedJobId = jobId; maxApps = count; }
    });

    const mostAppliedJob = mockJobs.find(j => j.id === mostAppliedJobId);
    const activeJobs = mockJobs.filter(j => new Date(j.deadline) > now).length;
    const expiredJobs = mockJobs.filter(j => new Date(j.deadline) <= now).length;

    return {
        totalUsers: 156,
        totalApplications: apps.length,
        totalJobs: mockJobs.length,
        activeJobs,
        expiredJobs,
        mostAppliedJob: mostAppliedJob ? { ...mostAppliedJob, applicationCount: maxApps } : null
    };
}

export { mockJobs };
