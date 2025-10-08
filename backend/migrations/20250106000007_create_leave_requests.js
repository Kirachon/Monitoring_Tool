/**
 * Migration: Create Leave Requests Table
 * Leave application and approval tracking
 */

exports.up = function(knex) {
  return knex.schema
    .createTable('leave_requests', (table) => {
      table.increments('id').primary();
      table.string('reference_no', 30).notNullable().unique(); // LR-YYYY-NNNN
      table.integer('employee_id').unsigned().notNullable()
        .references('id').inTable('employees').onDelete('CASCADE');
      table.integer('leave_type_id').unsigned().notNullable()
        .references('id').inTable('leave_types').onDelete('RESTRICT');
      table.date('date_from').notNullable();
      table.date('date_to').notNullable();
      table.decimal('num_days', 4, 2).notNullable(); // Supports half-day (0.5)
      table.boolean('is_half_day').defaultTo(false);
      table.string('half_day_period', 2); // AM, PM
      table.text('reason');
      table.string('medical_cert_path', 500);
      table.string('status', 20).notNullable().defaultTo('Pending'); // Pending, Approved, Denied, Cancelled
      table.integer('approved_by').unsigned().references('id').inTable('users');
      table.timestamp('approved_at');
      table.text('approval_comments');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.integer('created_by').unsigned().references('id').inTable('users');
      table.integer('updated_by').unsigned().references('id').inTable('users');
      
      table.index('reference_no');
      table.index('employee_id');
      table.index('leave_type_id');
      table.index('status');
      table.index('date_from');
      table.index('date_to');
      table.index(['employee_id', 'date_from', 'date_to']);
    });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('leave_requests');
};

