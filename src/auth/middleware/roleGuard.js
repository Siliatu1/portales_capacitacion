const jwt = require('jsonwebtoken');
const roleService = require('../services/roleService');

const requirePermission = (permission) => {
  return async (req, res, next) => {
    try {
      const auth = req.headers.authorization;
      if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'No token' });

      const token = auth.split(' ')[1];
      const secret = process.env.JWT_SECRET || 'change_this_secret';
      const payload = jwt.verify(token, secret);
      if (!payload) return res.status(401).json({ message: 'Invalid token' });
      req.user = { id: payload.sub, roles: payload.roles || [] };

      const allowed = await roleService.hasPermission(req.user.roles, permission);
      if (!allowed) return res.status(403).json({ message: 'Forbidden' });

      return next();
    } catch (err) {
      return res.status(401).json({ message: 'Unauthorized', error: err.message });
    }
  };
};

module.exports = { requirePermission };
