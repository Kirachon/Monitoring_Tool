/**
 * Migration: Create Holidays Table
 * Philippine holiday calendar
 */

exports.up = function(knex) {
  return knex.schema
    .createTable('holidays', (table) => {
      table.increments('id').primary();
      table.date('date').notNullable();
      table.string('name', 100).notNullable();
      table.string('type', 30).notNullable(); // Regular, Special Non-Working
      table.boolean('recurring').defaultTo(false);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.integer('created_by').unsigned().references('id').inTable('users');
      
      table.index('date');
      table.index('type');
    });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('holidays');
};

