const managerMiddleware = (req, res, next) => {
   

    if (req.user && req.user.role === 'manager') { 
        return next(); 
    }

    return res.status(403).json({ error: 'Access denied' });
};

module.exports = managerMiddleware;