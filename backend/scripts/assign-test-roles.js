/**
 * Repair script: Ensure test users have correct roles assigned.
 * Safe and idempotent.
 */
const path = require('path');
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const db = require('../src/config/database');

async function ensureRole(name) {
  const role = await db('roles').where({ name }).first();
  if (!role) throw new Error(`Role not found: ${name}`);
  return role.id;
}

async function ensureUser(username) {
  const user = await db('users').where({ username }).first();
  if (!user) throw new Error(`User not found: ${username}`);
  return user.id;
}

async function assignRoleIfMissing(userId, roleId) {
  const existing = await db('user_roles').where({ user_id: userId, role_id: roleId }).first();
  if (!existing) {
    await db('user_roles').insert({ user_id: userId, role_id: roleId });
    return true;
  }
  return false;
}

(async () => {
  try {
    const mapping = [
      { username: 'admin', role: 'System Administrator' },
      { username: 'hradmin', role: 'HR Administrator' },
      { username: 'supervisor', role: 'Supervisor' },
      { username: 'employee', role: 'Employee' },
    ];

    let assigned = 0;
    for (const { username, role } of mapping) {
      const [userId, roleId] = await Promise.all([
        ensureUser(username),
        ensureRole(role),
      ]);
      const didAssign = await assignRoleIfMissing(userId, roleId);
      if (didAssign) assigned++;
      console.log(`User ${username} -> Role ${role} ${didAssign ? '(assigned)' : '(already assigned)'}`);
    }

    console.log(`Done. New assignments: ${assigned}`);
    process.exit(0);
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
})();

