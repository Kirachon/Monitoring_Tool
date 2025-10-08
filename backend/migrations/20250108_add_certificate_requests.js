/**
 * Migration: Add certificate_requests table
 * Allows employees to request certificates
 */

exports.up = function(knex) {
  return knex.schema.createTable('certificate_requests', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.integer('employee_id').unsigned().notNullable();
    table.string('certificate_type', 100).notNullable();
    table.string('purpose', 100).notNullable();
    table.text('additional_details');
    table.string('status', 20).notNullable().defaultTo('Pending'); // Pending, Approved, Completed, Denied
    table.integer('certificate_id').unsigned(); // Link to generated certificate
    table.text('denial_reason');
    table.timestamp('requested_at').defaultTo(knex.fn.now());
    table.timestamp('processed_at');
    table.integer('processed_by').unsigned();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    // Foreign keys
    table.foreign('user_id').references('users.id').onDelete('CASCADE');
    table.foreign('employee_id').references('employees.id').onDelete('CASCADE');
    table.foreign('certificate_id').references('certificates.id').onDelete('SET NULL');
    table.foreign('processed_by').references('users.id').onDelete('SET NULL');

    // Indexes
    table.index('user_id');
    table.index('employee_id');
    table.index('status');
    table.index('requested_at');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('certificate_requests');
};

