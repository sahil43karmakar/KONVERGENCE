const router = require('express').Router();
const passport = require('passport');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/authMiddleware');
const authController = require('../controllers/authController');

// ── Validation rules ────────────────────────────
const registerRules = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
    body('role')
        .optional()
        .isIn(['jobseeker', 'recruiter'])
        .withMessage('Role must be jobseeker or recruiter'),
];

const loginRules = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
];

// ──────────────────────────────────────────────────
// Swagger Tags
// ──────────────────────────────────────────────────

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication & authorization
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AuthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             name:
 *               type: string
 *             email:
 *               type: string
 *             role:
 *               type: string
 *               enum: [jobseeker, recruiter, admin]
 *         accessToken:
 *           type: string
 *         refreshToken:
 *           type: string
 */

// ──────────────────────────────────────────────────
// Routes
// ──────────────────────────────────────────────────

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user (jobseeker or recruiter)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 minLength: 6
 *               role:
 *                 type: string
 *                 enum: [jobseeker, recruiter]
 *                 default: jobseeker
 *     responses:
 *       201:
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       409:
 *         description: Email already registered
 *       422:
 *         description: Validation error
 */
router.post('/register', registerRules, validate, authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login with email & password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', loginRules, validate, authController.login);

/**
 * @swagger
 * /api/auth/admin/login:
 *   post:
 *     summary: Admin-only login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Admin login successful
 *       401:
 *         description: Invalid admin credentials
 */
router.post('/admin/login', loginRules, validate, authController.adminLogin);

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Redirect to Google OAuth consent screen
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirects to Google
 */
router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Google OAuth callback (handled automatically)
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirects to frontend with tokens
 */
router.get(
    '/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/api/auth/google' }),
    authController.googleCallback
);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Rotate access token using refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: New token pair returned
 *       401:
 *         description: Invalid or expired refresh token
 */
router.post('/refresh', authController.refreshToken);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout (clear refresh token)
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out
 *       401:
 *         description: Not authenticated
 */
router.post('/logout', protect, authController.logout);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get currently authenticated user
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Current user data
 *       401:
 *         description: Not authenticated
 */
router.get('/me', protect, authController.getMe);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request password reset link
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reset link generated
 */
router.post('/forgot-password', authController.forgotPassword);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password using token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, password]
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password successfully updated
 */
router.post('/reset-password', authController.resetPassword);

module.exports = router;
