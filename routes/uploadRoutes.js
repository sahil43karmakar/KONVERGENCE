const router = require('express').Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { upload, photoUpload } = require('../config/cloudinary');
const uploadController = require('../controllers/uploadController');

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: File upload endpoints
 */

/**
 * @swagger
 * /api/upload/resume:
 *   post:
 *     summary: Upload a resume (job seekers only)
 *     tags: [Upload]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               resume:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Resume uploaded successfully
 *       400:
 *         description: No file uploaded
 */
router.post(
    '/resume',
    protect,
    authorize('jobseeker'),
    upload.single('resume'),
    uploadController.uploadResume
);

/**
 * @swagger
 * /api/upload/photo:
 *   post:
 *     summary: Upload a profile photo
 *     tags: [Upload]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Photo uploaded successfully
 *       400:
 *         description: No file uploaded
 */
router.post(
    '/photo',
    protect,
    photoUpload.single('photo'),
    uploadController.uploadPhoto
);

module.exports = router;
