const router = require('express').Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const jobController = require('../controllers/jobController');

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Job listings, search, filters, and CRUD
 */

/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: Get jobs with search, filters, sorting, and pagination
 *     tags: [Jobs]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Keyword search (company or role)
 *       - in: query
 *         name: location
 *         schema: { type: string }
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [full-time, internship, remote] }
 *       - in: query
 *         name: skills
 *         schema: { type: string }
 *         description: Comma-separated skills
 *       - in: query
 *         name: salaryMin
 *         schema: { type: number }
 *       - in: query
 *         name: salaryMax
 *         schema: { type: number }
 *       - in: query
 *         name: deadlineBefore
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, enum: [newest, salary, deadline] }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 6 }
 *     responses:
 *       200:
 *         description: Paginated job results
 */
router.get('/', jobController.getJobs);

/**
 * @swagger
 * /api/jobs/personalized:
 *   get:
 *     summary: Get personalized job feed based on user skills
 *     tags: [Jobs]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Top 5 matched jobs
 */
router.get('/personalized', protect, jobController.getPersonalizedFeed);

/**
 * @swagger
 * /api/jobs/{id}:
 *   get:
 *     summary: Get a single job by ID
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Job details
 *       404:
 *         description: Job not found
 */
router.get('/:id', jobController.getJobById);

/**
 * @swagger
 * /api/jobs:
 *   post:
 *     summary: Create a new job (admin/recruiter only)
 *     tags: [Jobs]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [company, role, location, type, salary, deadline]
 *             properties:
 *               company: { type: string }
 *               role: { type: string }
 *               location: { type: string }
 *               type: { type: string, enum: [full-time, internship, remote] }
 *               salary: { type: number }
 *               deadline: { type: string, format: date }
 *               skillsRequired: { type: array, items: { type: string } }
 *               description: { type: string }
 *               applyLink: { type: string }
 *     responses:
 *       201:
 *         description: Job created
 */
router.post('/', protect, authorize('admin', 'recruiter'), jobController.createJob);

/**
 * @swagger
 * /api/jobs/{id}:
 *   put:
 *     summary: Update a job (admin/recruiter only)
 *     tags: [Jobs]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Job updated
 */
router.put('/:id', protect, authorize('admin', 'recruiter'), jobController.updateJob);

/**
 * @swagger
 * /api/jobs/{id}:
 *   delete:
 *     summary: Delete a job (admin/recruiter only)
 *     tags: [Jobs]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Job deleted
 */
router.delete('/:id', protect, authorize('admin', 'recruiter'), jobController.deleteJob);

module.exports = router;
