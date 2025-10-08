/**
 * Seed: Test Leave Requests
 * Creates a few pending leave requests for approvals/testing
 */

exports.seed = async function(knex) {
  try {
    console.log('\ud83d\udcc6  Seeding test leave requests...');

    // If there are already pending requests, don't duplicate too many
    const existing = await knex('leave_requests').where({ status: 'Pending' }).count('* as c').first();
    if (parseInt(existing.c, 10) >= 2) {
      console.log('\u2705 Sufficient pending leave requests exist. Skipping.');
      return;
    }

    // Get employee (requestor) and a leave type
    const employeeUser = await knex('users').where({ username: 'employee' }).first();
    const employeeId = employeeUser?.employee_id;
    if (!employeeId) {
      console.log('\u26a0\ufe0f  Employee user not found. Ensure 000_test_users ran.');
      return;
    }

    const leaveType = await knex('leave_types').orderBy('id').first();
    if (!leaveType) {
      console.log('\u26a0\ufe0f  No leave types found. Ensure 003_leave_types ran.');
      return;
    }

    // Build two pending requests
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 24*60*60*1000);

    const format = (d) => d.toISOString().slice(0,10);

    const rows = [
      {
        reference_no: 'TEST-LR-0001',
        employee_id: employeeId,
        leave_type_id: leaveType.id,
        date_from: format(today),
        date_to: format(tomorrow),
        num_days: 2.00,
        is_half_day: false,
        status: 'Pending',
        reason: 'Test pending leave request 1',
        created_by: employeeUser.id,
        updated_by: employeeUser.id
      },
      {
        reference_no: 'TEST-LR-0002',
        employee_id: employeeId,
        leave_type_id: leaveType.id,
        date_from: format(today),
        date_to: format(tomorrow),
        num_days: 2.00,
        is_half_day: false,
        status: 'Pending',
        reason: 'Test pending leave request 2',
        created_by: employeeUser.id,
        updated_by: employeeUser.id
      }
    ];

    // Insert, ignoring duplicates on unique reference_no
    for (const row of rows) {
      const dup = await knex('leave_requests').where({ reference_no: row.reference_no }).first();
      if (!dup) {
        await knex('leave_requests').insert(row);
        console.log(`\u2705 Inserted ${row.reference_no}`);
      } else {
        console.log(`\u2139\ufe0f  ${row.reference_no} already exists, skipping.`);
      }
    }
  } catch (err) {
    console.error('\u274c Error seeding leave requests:', err.message);
    throw err;
  }
};

