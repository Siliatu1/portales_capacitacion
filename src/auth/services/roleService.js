// Servicio simple de permisos. En producción consultar DB.

const rolePermissions = {
  SuperAdmin: ['*'],
  Admin: ['users:view','restaurants:manage','analytics:view','settings:update'],
  RestaurantOwner: ['restaurant:update','menu:manage','orders:view','staff:manage'],
  Manager: ['orders:manage','menu:edit','reports:view'],
  Staff: ['orders:process','orders:view','profile:update'],
  Customer: ['orders:create','orders:view','reviews:create'],
  Guest: ['restaurants:publicView','auth:register']
};

const hasPermission = async (roles, permission) => {
  if (!roles || roles.length === 0) return false;
  if (roles.includes('SuperAdmin')) return true;

  for (const role of roles) {
    const perms = rolePermissions[role] || [];
    if (perms.includes('*')) return true;
    if (perms.includes(permission)) return true;
  }

  return false;
};

const getPermissions = (role) => rolePermissions[role] || [];

module.exports = { hasPermission, getPermissions };
