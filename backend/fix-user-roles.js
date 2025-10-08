/**
 * Quick fix script to assign roles to test users
 * Run with: node fix-user-roles.js
 */

const { Client } = require('pg');
require('dotenv').config();

async function fixUserRoles() {
  const hostEnv = process.env.DB_HOST || 'localhost';
  const host = hostEnv === 'localhost' ? '127.0.0.1' : hostEnv;
  const client = new Client({
    host,
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'hrms_dev',
    user: process.env.DB_USER || 'hrms_user',
    password: process.env.DB_PASSWORD || '',
    connectionTimeoutMillis: 5000
  });

  try {
    console.log('🔧 Connecting to database...');
    await client.connect();
    console.log('✅ Connected');

    // Delete existing user_roles
    await client.query('DELETE FROM user_roles');
    console.log('✅ Cleared existing user_roles');

    // Insert new mappings
    const insertQuery = `
      INSERT INTO user_roles (user_id, role_id)
      SELECT u.id,
        CASE u.username
          WHEN 'admin' THEN 4
          WHEN 'hradmin' THEN 3
          WHEN 'supervisor' THEN 2
          WHEN 'employee' THEN 1
        END
      FROM users u
      WHERE u.username IN ('admin', 'hradmin', 'supervisor', 'employee')
    `;

    const result = await client.query(insertQuery);
    console.log(`✅ Assigned ${result.rowCount} user roles`);

    // Verify
    const verifyQuery = `
      SELECT u.username, r.name as role
      FROM users u
      JOIN user_roles ur ON u.id = ur.user_id
      JOIN roles r ON ur.role_id = r.id
      WHERE u.username IN ('admin', 'hradmin', 'supervisor', 'employee')
      ORDER BY u.id
    `;

    const verification = await client.query(verifyQuery);
    console.log('\n📋 Current user-role mappings:');
    verification.rows.forEach(row => {
      console.log(`   ${row.username} → ${row.role}`);
    });

    await client.end();
    console.log('\n✅ Done!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    await client.end();
    process.exit(1);
  }
}

fixUserRoles();

