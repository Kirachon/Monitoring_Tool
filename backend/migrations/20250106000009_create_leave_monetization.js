/**
 * Migration: Create Leave Monetization Table
 * Terminal leave calculations for retiring employees
 */

exports.up = function(knex) {
  return knex.schema
    .createTable('leave_monetization', (table) => {
      table.increments('id').primary();
      table.integer('employee_id').unsigned().notNullable()
        .references('id').inTable('employees').onDelete('CASCADE');
      table.date('retirement_date').notNullable();
      table.decimal('vl_balance', 6, 2).notNullable();
      table.decimal('sl_balance', 6, 2).notNullable();
      table.decimal('total_monetizable_days', 6, 2).notNullable();
      table.decimal('daily_rate', 10, 2).notNullable();
      table.decimal('total_amount', 12, 2).notNullable();
      table.timestamp('generated_at').defaultTo(knex.fn.now());
      table.integer('generated_by').unsigned().references('id').inTable('users');
      
      table.index('employee_id');
      table.index('retirement_date');
    });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('leave_monetization');
};

