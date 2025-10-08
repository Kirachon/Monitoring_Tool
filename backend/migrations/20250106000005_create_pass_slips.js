/**
 * Migration: Create Pass Slips Table
 * Pass slip management system
 */

exports.up = function(knex) {
  return knex.schema
    .createTable('pass_slips', (table) => {
      table.increments('id').primary();
      table.string('reference_no', 30).notNullable().unique(); // PS-YYYY-NNNN
      table.integer('employee_id').unsigned().notNullable()
        .references('id').inTable('employees').onDelete('CASCADE');
      table.string('pass_slip_type', 20).notNullable(); // Planned, Emergency
      table.string('destination', 200).notNullable();
      table.text('reason').notNullable();
      table.date('date').notNullable();
      table.time('time_out').notNullable();
      table.time('expected_time_in').notNullable();
      table.time('actual_time_in');
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
      table.index('status');
      table.index('date');
      table.index(['employee_id', 'date']);
    });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('pass_slips');
};

