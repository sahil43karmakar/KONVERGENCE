/* ── Real API Service Layer ──────────────────────────────────────────
   Replaces the mock data layer. Every function matches the same
   signature so pages import the same names with zero changes.       */

import api from './api';

/* ── Job Endpoints ── */

export async function fetchJobs(filters = {}) {
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.location) params.location = filters.location;
    if (filters.type) params.type = filters.type;
    if (filters.skills?.length) params.skills = filters.skills.join(',');
    if (filters.salaryMin) params.salaryMin = filters.salaryMin;
    if (filters.salaryMax) params.salaryMax = filters.salaryMax;
    if (filters.deadlineBefore) params.deadlineBefore = filters.deadlineBefore;
    if (filters.sortBy) params.sortBy = filters.sortBy;
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;

    const { data } = await api.get('/jobs', { params });
    // Normalise _id → id for frontend compatibility
    const jobs = (data.jobs || []).map(j => ({ ...j, id: j._id || j.id }));
    return { jobs, total: data.total, totalPages: data.totalPages, currentPage: data.currentPage };
}

export async function fetchJobById(id) {
    const { data } = await api.get(`/jobs/${id}`);
    const job = data.data || data;
    return job ? { ...job, id: job._id || job.id } : null;
}

/* ── Bookmark Endpoints ── */

export async function fetchBookmarks() {
    const { data } = await api.get('/bookmarks');
    return (data.data || []).map(b => {
        const job = b.job || b;
        return { ...job, id: job._id || job.id };
    });
}

export async function toggleBookmark(jobId) {
    const { data } = await api.post(`/bookmarks/${jobId}`);
    return data.bookmarkIds || [];
}

export async function isBookmarked(jobId) {
    const ids = await getBookmarkIds();
    return ids.includes(jobId);
}

export async function getBookmarkIds() {
    try {
        const { data } = await api.get('/bookmarks/ids');
        return data.data || [];
    } catch {
        return [];
    }
}

/* ── Application Endpoints ── */

export async function fetchApplications() {
    const { data } = await api.get('/applications');
    return (data.data || []).map(app => ({
        id: app._id || app.id,
        jobId: app.job?._id || app.job?.id || app.job,
        status: app.status,
        appliedAt: app.appliedAt,
        job: app.job ? { ...app.job, id: app.job._id || app.job.id } : null,
    }));
}

export async function applyToJob(jobId) {
    const { data } = await api.post(`/applications/${jobId}/apply`);
    const app = data.data;
    return {
        id: app._id || app.id,
        jobId: app.job || jobId,
        status: app.status,
        appliedAt: app.appliedAt,
    };
}

export async function updateApplicationStatus(appId, status) {
    const { data } = await api.patch(`/applications/${appId}/status`, { status });
    const app = data.data;
    return app ? { id: app._id || app.id, status: app.status } : null;
}

export async function removeApplication(appId) {
    await api.delete(`/applications/${appId}`);
    return [];
}

export async function hasApplied(jobId) {
    try {
        const { data } = await api.get(`/applications/${jobId}/check`);
        return data.applied;
    } catch {
        return false;
    }
}

/* ── Personalized Feed ── */

export async function fetchPersonalizedFeed(userSkills = []) {
    try {
        const { data } = await api.get('/jobs/personalized');
        return (data.data || []).map(item => {
            // Backend returns { job: {...}, matchPercentage, matchedSkills, missingSkills, opportunityScore }
            // Flatten so the job fields are top-level (what JobCard expects)
            const job = item.job || item;
            return {
                ...job,
                id: job._id || job.id,
                matchPercentage: item.matchPercentage,
                matchedSkills: item.matchedSkills || [],
                missingSkills: item.missingSkills || [],
                opportunityScore: item.opportunityScore,
            };
        });
    } catch {
        // Fallback: return first 5 jobs
        const result = await fetchJobs({ limit: 5, sortBy: 'newest' });
        return result.jobs;
    }
}

/* ── Admin Stats ── */

export async function fetchAdminStats() {
    const { data } = await api.get('/admin/stats');
    const stats = data.data;
    if (stats.mostAppliedJob) {
        stats.mostAppliedJob = { ...stats.mostAppliedJob, id: stats.mostAppliedJob._id || stats.mostAppliedJob.id };
    }
    return stats;
}

/* ── Admin Job CRUD ── */

export async function createJob(jobData) {
    const { data } = await api.post('/jobs', jobData);
    const job = data.data;
    return { ...job, id: job._id || job.id };
}

export async function updateJob(id, jobData) {
    const { data } = await api.put(`/jobs/${id}`, jobData);
    const job = data.data;
    return { ...job, id: job._id || job.id };
}

export async function deleteJob(id) {
    await api.delete(`/jobs/${id}`);
}

/* ── File Uploads ── */

export async function uploadResume(file) {
    const formData = new FormData();
    formData.append('resume', file);
    const { data } = await api.post('/upload/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
}

export async function uploadPhoto(file) {
    const formData = new FormData();
    formData.append('photo', file);
    const { data } = await api.post('/upload/photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
}

/* ── Backward compat: re-export empty mockJobs (some pages import it) ── */
export const mockJobs = [];
