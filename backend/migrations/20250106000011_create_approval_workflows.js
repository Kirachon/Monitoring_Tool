/**
 * Migration: Create Approval Workflow Tables
 * Configurable approval workflows and approval history
 */

exports.up = function(knex) {
  return knex.schema
    // Approval Workflows table
    .createTable('approval_workflows', (table) => {
      table.increments('id').primary();
      table.integer('department_id').unsigned()
        .references('id').inTable('departments').onDelete('CASCADE');
      table.string('entity_type', 30).notNullable(); // pass_slip, leave_request
      table.string('pass_slip_type', 20); // Planned, Emergency (for pass slips only)
      table.json('workflow_config').notNullable(); // JSON array of approval levels
      // Example: [{"level": 1, "approver_role": "Supervisor", "department_scope": "same"}, ...]
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.integer('created_by').unsigned().references('id').inTable('users');
      table.integer('updated_by').unsigned().references('id').inTable('users');
      
      table.index('department_id');
      table.index('entity_type');
    })
    
    // Approvals table (approval history)
    .createTable('approvals', (table) => {
      table.increments('id').primary();
      table.string('entity_type', 30).notNullable(); // pass_slip, leave_request
      table.integer('entity_id').notNullable(); // ID of pass_slip or leave_request
      table.integer('approval_level').notNullable();
      table.integer('approver_id').unsigned().notNullable()
        .references('id').inTable('users').onDelete('RESTRICT');
      table.string('action', 20).notNullable(); // Approved, Denied
      table.text('comments');
      table.timestamp('approved_at').defaultTo(knex.fn.now());
      
      table.index(['entity_type', 'entity_id']);
      table.index('approver_id');
      table.index('approved_at');
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('approvals')
    .dropTableIfExists('approval_workflows');
};

