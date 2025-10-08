/**
 * Migration: Create Departments Table
 * Must be created before employees table due to foreign key dependencies
 */

exports.up = function(knex) {
  return knex.schema
    .createTable('departments', (table) => {
      table.increments('id').primary();
      table.string('name', 100).notNullable();
      table.integer('parent_id').unsigned()
        .references('id').inTable('departments').onDelete('SET NULL');
      table.integer('dept_head_id').unsigned(); // Will add FK after employees table exists
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.integer('created_by').unsigned();
      table.integer('updated_by').unsigned();
      
      table.index('parent_id');
      table.index('name');
    });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('departments');
};

