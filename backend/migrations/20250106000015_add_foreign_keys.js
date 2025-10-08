/**
 * Migration: Add Foreign Keys for Circular Dependencies
 * Adds foreign keys that couldn't be added initially due to circular dependencies
 */

exports.up = function(knex) {
  return knex.schema
    // Add dept_head_id foreign key to departments table
    .alterTable('departments', (table) => {
      table.foreign('dept_head_id')
        .references('id')
        .inTable('employees')
        .onDelete('SET NULL');
    })
    
    // Add created_by and updated_by foreign keys to departments
    .alterTable('departments', (table) => {
      table.foreign('created_by')
        .references('id')
        .inTable('users')
        .onDelete('SET NULL');
      table.foreign('updated_by')
        .references('id')
        .inTable('users')
        .onDelete('SET NULL');
    })
    
    // Add created_by and updated_by foreign keys to employees
    .alterTable('employees', (table) => {
      table.foreign('created_by')
        .references('id')
        .inTable('users')
        .onDelete('SET NULL');
      table.foreign('updated_by')
        .references('id')
        .inTable('users')
        .onDelete('SET NULL');
    })
    
    // Add created_by and updated_by foreign keys to users
    .alterTable('users', (table) => {
      table.foreign('created_by')
        .references('id')
        .inTable('users')
        .onDelete('SET NULL');
      table.foreign('updated_by')
        .references('id')
        .inTable('users')
        .onDelete('SET NULL');
    });
};

exports.down = function(knex) {
  return knex.schema
    .alterTable('users', (table) => {
      table.dropForeign('created_by');
      table.dropForeign('updated_by');
    })
    .alterTable('employees', (table) => {
      table.dropForeign('created_by');
      table.dropForeign('updated_by');
    })
    .alterTable('departments', (table) => {
      table.dropForeign('dept_head_id');
      table.dropForeign('created_by');
      table.dropForeign('updated_by');
    });
};

