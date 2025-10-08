/**
 * Migration: Create System Configuration Table
 * System-wide configuration settings
 */

exports.up = function(knex) {
  return knex.schema
    .createTable('system_config', (table) => {
      table.increments('id').primary();
      table.string('config_key', 100).notNullable().unique();
      table.text('config_value').notNullable();
      table.text('description');
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.integer('updated_by').unsigned().references('id').inTable('users');
      
      table.index('config_key');
    });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('system_config');
};

