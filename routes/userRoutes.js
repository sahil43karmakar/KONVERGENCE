const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile management
 */

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 */
router.get('/profile', protect, userController.getProfile);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update user profile (student or recruiter fields)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               firstName: { type: string }
 *               middleName: { type: string }
 *               lastName: { type: string }
 *               location: { type: string }
 *               skills: { type: array, items: { type: string } }
 *               bio: { type: string }
 *               expectedSalary: { type: string }
 *               photoUrl: { type: string }
 *               companyName: { type: string }
 *               position: { type: string }
 *               companyWebsite: { type: string }
 *               hiringFor: { type: array, items: { type: string } }
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.put('/profile', protect, userController.updateProfile);

module.exports = router;
