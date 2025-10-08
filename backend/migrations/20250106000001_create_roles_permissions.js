/**
 * Migration: Create Roles and Permissions Tables
 * Creates the foundation for Role-Based Access Control (RBAC)
 */

exports.up = function(knex) {
  return knex.schema
    // Roles table
    .createTable('roles', (table) => {
      table.increments('id').primary();
      table.string('name', 50).notNullable().unique();
      table.text('description');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    
    // Permissions table
    .createTable('permissions', (table) => {
      table.increments('id').primary();
      table.string('name', 100).notNullable().unique();
      table.text('description');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    
    // Role-Permissions mapping
    .createTable('role_permissions', (table) => {
      table.increments('id').primary();
      table.integer('role_id').unsigned().notNullable()
        .references('id').inTable('roles').onDelete('CASCADE');
      table.integer('permission_id').unsigned().notNullable()
        .references('id').inTable('permissions').onDelete('CASCADE');
      table.unique(['role_id', 'permission_id']);
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('role_permissions')
    .dropTableIfExists('permissions')
    .dropTableIfExists('roles');
};

