/**
 * Express middleware for JWT authentication.
 * Verifies token and attaches userId to the request object.
 */

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = decoded.userId; 
            next(); 
        } catch (err) {
            res.status(403).json({ message: 'Token expired or invalid' });
        }
    }
    else {
        res.status(401).send('Not authenticated');
    }
};