export const yourRole = (...roles) => (req, res, next) => {
    if (!req.user) {
        return res.status(500).json({
            msg: 'No token in the request'
        });
    }

    if (!roles.includes(req.user.role)) {
        return res.status(401).json({
            msg: `You cannot do this action because your role is ${req.user.role},
                 only these roles can do this action: ${roles}`
        });
    }

    next();
};
