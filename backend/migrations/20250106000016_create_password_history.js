/**
 * Migration: Create Password History Table
 * Stores password history for password reuse prevention
 */

exports.up = function(knex) {
  return knex.schema
    .createTable('password_history', (table) => {
      table.bigIncrements('id').primary();
      table.integer('user_id').unsigned().notNullable()
        .references('id').inTable('users').onDelete('CASCADE');
      table.string('password_hash', 255).notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      
      table.index('user_id');
      table.index(['user_id', 'created_at']);
    });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('password_history');
};

