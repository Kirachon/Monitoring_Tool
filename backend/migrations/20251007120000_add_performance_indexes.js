exports.up = async function(knex) {
  // Approvals composite index
  await knex.schema.alterTable('approvals', (table) => {
    table.index(['entity_type', 'approver_id', 'action'], 'idx_approvals_entity_approver_action');
  });

  // Leave requests indexes
  await knex.schema.alterTable('leave_requests', (table) => {
    table.index(['employee_id', 'status'], 'idx_leave_requests_employee_status');
    table.index(['status', 'date_from'], 'idx_leave_requests_status_date_from');
  });

  // Pass slips indexes
  await knex.schema.alterTable('pass_slips', (table) => {
    table.index(['employee_id', 'status'], 'idx_pass_slips_employee_status');
  });

  // Audit logs index
  await knex.schema.alterTable('audit_logs', (table) => {
    table.index(['user_id', 'created_at'], 'idx_audit_logs_user_created_at');
  });

  // Users index
  await knex.schema.alterTable('users', (table) => {
    table.index(['status', 'last_login'], 'idx_users_status_last_login');
  });
};

exports.down = async function(knex) {
  // Revert users index
  await knex.schema.alterTable('users', (table) => {
    table.dropIndex(['status', 'last_login'], 'idx_users_status_last_login');
  });

  // Revert audit logs index
  await knex.schema.alterTable('audit_logs', (table) => {
    table.dropIndex(['user_id', 'created_at'], 'idx_audit_logs_user_created_at');
  });

  // Revert pass slips index
  await knex.schema.alterTable('pass_slips', (table) => {
    table.dropIndex(['employee_id', 'status'], 'idx_pass_slips_employee_status');
  });

  // Revert leave requests indexes
  await knex.schema.alterTable('leave_requests', (table) => {
    table.dropIndex(['employee_id', 'status'], 'idx_leave_requests_employee_status');
    table.dropIndex(['status', 'date_from'], 'idx_leave_requests_status_date_from');
  });

  // Revert approvals index
  await knex.schema.alterTable('approvals', (table) => {
    table.dropIndex(['entity_type', 'approver_id', 'action'], 'idx_approvals_entity_approver_action');
  });
};

