/**
 * Migration: Create Leave Types Table
 * CSC-compliant leave type definitions
 */

exports.up = function(knex) {
  return knex.schema
    .createTable('leave_types', (table) => {
      table.increments('id').primary();
      table.string('name', 100).notNullable();
      table.string('code', 10).notNullable().unique(); // VL, SL, ML, PL, SPL, etc.
      table.decimal('accrual_rate', 5, 2).defaultTo(0); // Days per month (1.25 for VL/SL)
      table.decimal('max_balance', 6, 2); // Maximum balance (300 for VL/SL)
      table.boolean('requires_medical_cert').defaultTo(false);
      table.boolean('monetizable').defaultTo(false);
      table.text('description');
      table.boolean('is_active').defaultTo(true);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.integer('created_by').unsigned().references('id').inTable('users');
      table.integer('updated_by').unsigned().references('id').inTable('users');
      
      table.index('code');
      table.index('is_active');
    });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('leave_types');
};

