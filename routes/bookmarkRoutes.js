const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const bookmarkController = require('../controllers/bookmarkController');

/**
 * @swagger
 * tags:
 *   name: Bookmarks
 *   description: Save / unsave jobs
 */

/**
 * @swagger
 * /api/bookmarks:
 *   get:
 *     summary: Get all bookmarked jobs (populated)
 *     tags: [Bookmarks]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of bookmarked jobs
 */
router.get('/', protect, bookmarkController.getBookmarks);

/**
 * @swagger
 * /api/bookmarks/ids:
 *   get:
 *     summary: Get bookmark job IDs only
 *     tags: [Bookmarks]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Array of job IDs
 */
router.get('/ids', protect, bookmarkController.getBookmarkIds);

/**
 * @swagger
 * /api/bookmarks/{jobId}:
 *   post:
 *     summary: Toggle bookmark on a job
 *     tags: [Bookmarks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Bookmark toggled
 */
router.post('/:jobId', protect, bookmarkController.toggleBookmark);

module.exports = router;
