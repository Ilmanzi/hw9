const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader // && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized user'});
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Unauthorized user'})
    }
};

module.exports = authenticate;