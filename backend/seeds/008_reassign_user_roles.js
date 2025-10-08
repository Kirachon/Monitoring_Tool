/**
 * Seed: Reassign User Roles (post role reset)
 * Ensures default test users have expected roles after 001_roles_permissions resets mappings.
 */

exports.seed = async function(knex) {
  try {
    console.log('👔  Reassigning user roles for test users...');

    const users = await knex('users').select('id','username');
    const byUsername = Object.fromEntries(users.map(u => [u.username, u]));

    const admin      = byUsername['admin'];
    const hradmin    = byUsername['hradmin'];
    const supervisor = byUsername['supervisor'];
    const employee   = byUsername['employee'];

    const roleMap = await knex('roles').select('id','name');
    const roleIdByName = Object.fromEntries(roleMap.map(r => [r.name, r.id]));

    const inserts = [];
    if (admin)      inserts.push({ user_id: admin.id,      role_id: roleIdByName['System Administrator'] });
    if (hradmin)    inserts.push({ user_id: hradmin.id,    role_id: roleIdByName['HR Administrator'] });
    if (supervisor) inserts.push({ user_id: supervisor.id, role_id: roleIdByName['Supervisor'] });
    if (employee)   inserts.push({ user_id: employee.id,   role_id: roleIdByName['Employee'] });

    // Remove existing mappings for these users to avoid duplicates
    await knex('user_roles').whereIn('user_id', inserts.map(i => i.user_id)).del();

    if (inserts.length) {
      await knex('user_roles').insert(inserts);
      console.log(`✅ Assigned roles for ${inserts.length} users.`);
    } else {
      console.log('ℹ️  No known test users found to assign roles.');
    }
  } catch (err) {
    console.error('❌ Error reassigning user roles:', err.message);
    throw err;
  }
};

