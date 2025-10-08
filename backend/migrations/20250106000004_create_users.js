/**
 * Migration: Create Users and Related Tables
 * Authentication and session management
 */

exports.up = function(knex) {
  return knex.schema
    // Users table
    .createTable('users', (table) => {
      table.increments('id').primary();
      table.string('username', 50).notNullable().unique();
      table.string('password_hash', 255).notNullable();
      table.integer('employee_id').unsigned().unique()
        .references('id').inTable('employees').onDelete('SET NULL');
      table.string('status', 20).notNullable().defaultTo('active'); // active, inactive, locked
      table.integer('failed_login_attempts').defaultTo(0);
      table.timestamp('last_failed_login');
      table.timestamp('last_login');
      table.timestamp('password_changed_at').defaultTo(knex.fn.now());
      table.timestamp('password_expires_at');
      table.boolean('must_change_password').defaultTo(false);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.integer('created_by').unsigned();
      table.integer('updated_by').unsigned();
      
      table.index('username');
      table.index('status');
      table.index('employee_id');
    })
    
    // User-Roles mapping
    .createTable('user_roles', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable()
        .references('id').inTable('users').onDelete('CASCADE');
      table.integer('role_id').unsigned().notNullable()
        .references('id').inTable('roles').onDelete('CASCADE');
      table.timestamp('assigned_at').defaultTo(knex.fn.now());
      table.integer('assigned_by').unsigned().references('id').inTable('users');
      table.unique(['user_id', 'role_id']);
      
      table.index('user_id');
      table.index('role_id');
    })
    
    // Sessions table
    .createTable('sessions', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable()
        .references('id').inTable('users').onDelete('CASCADE');
      table.string('token', 500).notNullable().unique();
      table.string('ip_address', 45);
      table.text('user_agent');
      table.timestamp('expires_at').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      
      table.index('user_id');
      table.index('token');
      table.index('expires_at');
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('sessions')
    .dropTableIfExists('user_roles')
    .dropTableIfExists('users');
};

