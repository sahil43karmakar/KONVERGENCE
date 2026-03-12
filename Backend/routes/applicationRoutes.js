const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const appController = require('../controllers/applicationController');

/**
 * @swagger
 * tags:
 *   name: Applications
 *   description: Job application tracking (Opportunity Tracker)
 */

/**
 * @swagger
 * /api/applications:
 *   get:
 *     summary: Get all my applications (with populated job data)
 *     tags: [Applications]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of applications
 */
router.get('/', protect, appController.getMyApplications);

/**
 * @swagger
 * /api/applications/{jobId}/apply:
 *   post:
 *     summary: Apply to a job
 *     tags: [Applications]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       201:
 *         description: Application created
 *       409:
 *         description: Already applied
 */
router.post('/:jobId/apply', protect, appController.applyToJob);

/**
 * @swagger
 * /api/applications/{jobId}/check:
 *   get:
 *     summary: Check if user has applied to a job
 *     tags: [Applications]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Applied status
 */
router.get('/:jobId/check', protect, appController.hasApplied);

/**
 * @swagger
 * /api/applications/{id}/status:
 *   patch:
 *     summary: Update application status (for Kanban drag)
 *     tags: [Applications]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [applied, interview, selected, rejected]
 *     responses:
 *       200:
 *         description: Status updated
 */
router.patch('/:id/status', protect, appController.updateStatus);

/**
 * @swagger
 * /api/applications/{id}:
 *   delete:
 *     summary: Remove an application
 *     tags: [Applications]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Application removed
 */
router.delete('/:id', protect, appController.removeApplication);

module.exports = router;
