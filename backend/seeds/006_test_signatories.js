/**
 * Seed: Test Digital Signatures
 * Creates sample digital signatures for quick certificate generation testing
 */

exports.seed = async function(knex) {
  try {
    console.log('🖊️  Seeding test digital signatures...');

    const exists = await knex('digital_signatures').first();
    if (exists) {
      console.log('✅ Digital signatures already exist. Skipping.');
      return;
    }

    // Fetch known users/employees
    const admin = await knex('users').where({ username: 'admin' }).first();
    const hradmin = await knex('users').where({ username: 'hradmin' }).first();

    if (!admin || !hradmin) {
      console.log('⚠️  Required users not found (admin/hradmin). Ensure 000_test_users ran.');
      return;
    }

    const rows = [
      {
        employee_id: hradmin.employee_id,
        signature_path: 'uploads/signatures/hradmin.png',
        signature_title: 'HR Administrator',
        uploaded_by: admin.id
      },
      {
        employee_id: admin.employee_id,
        signature_path: 'uploads/signatures/admin.png',
        signature_title: 'System Administrator',
        uploaded_by: admin.id
      }
    ];

    await knex('digital_signatures').insert(rows);
    console.log(`✅ Inserted ${rows.length} digital signatures.`);
  } catch (err) {
    console.error('❌ Error seeding digital signatures:', err.message);
    throw err;
  }
};

