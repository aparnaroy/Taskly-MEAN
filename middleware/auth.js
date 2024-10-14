const verifyToken = (req, res, next) => {
    if (req.session.userId) {
        next(); // User is authenticated
    } else {
        res.status(401).json({ message: 'Unauthorized' }); // User is not authenticated
    }
};

module.exports = { verifyToken };
