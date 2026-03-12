const router = require('express').Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin dashboard endpoints
 */

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get admin dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats (totalUsers, totalApplications, totalJobs, activeJobs, expiredJobs, mostAppliedJob)
 *       403:
 *         description: Not authorized
 */
router.get('/stats', protect, authorize('admin', 'recruiter'), adminController.getStats);

module.exports = router;
