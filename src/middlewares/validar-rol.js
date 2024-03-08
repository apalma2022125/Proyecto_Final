export const yourRole = (...roles) => (req, res, next) => {
    if (!req.user) {
        return res.status(500).json({
            msg: 'No token in the request'
        });
    }

    if (!roles.includes(req.user.role)) {
        return res.status(401).json({
            msg: 'This action can only be done by an administrator'
        });
    }

    next();
};