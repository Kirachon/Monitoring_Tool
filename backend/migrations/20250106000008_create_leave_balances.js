/**
 * Migration: Create Leave Balances and Credits Tables
 * Leave balance tracking and transaction history
 */

exports.up = function(knex) {
  return knex.schema
    // Leave Balances table
    .createTable('leave_balances', (table) => {
      table.increments('id').primary();
      table.integer('employee_id').unsigned().notNullable()
        .references('id').inTable('employees').onDelete('CASCADE');
      table.integer('leave_type_id').unsigned().notNullable()
        .references('id').inTable('leave_types').onDelete('CASCADE');
      table.decimal('current_balance', 6, 2).notNullable().defaultTo(0);
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      
      table.unique(['employee_id', 'leave_type_id']);
      table.index('employee_id');
      table.index('leave_type_id');
      
      // Check constraint: balance cannot be negative
      table.check('current_balance >= 0', [], 'chk_balance_non_negative');
    })
    
    // Leave Credits table (transaction history)
    .createTable('leave_credits', (table) => {
      table.increments('id').primary();
      table.integer('employee_id').unsigned().notNullable()
        .references('id').inTable('employees').onDelete('CASCADE');
      table.integer('leave_type_id').unsigned().notNullable()
        .references('id').inTable('leave_types').onDelete('CASCADE');
      table.decimal('amount', 6, 2).notNullable(); // Positive for accrual, negative for usage
      table.string('transaction_type', 30).notNullable(); // Accrual, Usage, Adjustment, Opening Balance
      table.text('reason');
      table.decimal('balance_after', 6, 2).notNullable();
      table.integer('leave_request_id').unsigned()
        .references('id').inTable('leave_requests').onDelete('SET NULL');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.integer('created_by').unsigned().references('id').inTable('users');
      
      table.index('employee_id');
      table.index('leave_type_id');
      table.index('transaction_type');
      table.index('created_at');
      table.index(['employee_id', 'leave_type_id', 'created_at']);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('leave_credits')
    .dropTableIfExists('leave_balances');
};

