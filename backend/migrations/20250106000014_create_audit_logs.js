/**
 * Migration: Create Audit Logs Table
 * Comprehensive audit trail for all system activities
 */

exports.up = function(knex) {
  return knex.schema
    .createTable('audit_logs', (table) => {
      table.bigIncrements('id').primary();
      table.integer('user_id').unsigned()
        .references('id').inTable('users').onDelete('SET NULL');
      table.string('action', 50).notNullable(); // Create, Update, Delete, Approve, Deny, Login, Logout, etc.
      table.string('module', 30).notNullable(); // PassSlip, Leave, Certificate, User, System
      table.string('entity_type', 50);
      table.integer('entity_id');
      table.json('details'); // JSON object with before/after values, additional context
      table.string('ip_address', 45);
      table.text('user_agent');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      
      table.index('user_id');
      table.index('action');
      table.index('module');
      table.index('entity_type');
      table.index('created_at');
      table.index(['module', 'action', 'created_at']);
    });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('audit_logs');
};

