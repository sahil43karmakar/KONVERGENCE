const jwt = require('jsonwebtoken');

/**
 * Generate an access + refresh JWT pair for the given user.
 * @param {Object} user – Mongoose user document
 * @returns {{ accessToken: string, refreshToken: string }}
 */
const generateTokens = (user) => {
    const payload = { id: user._id, role: user.role };

    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    });

    return { accessToken, refreshToken };
};

module.exports = generateTokens;
