/**
 * Migration: Create Employees Table
 * Core employee master data
 */

exports.up = function(knex) {
  return knex.schema
    .createTable('employees', (table) => {
      table.increments('id').primary();
      table.string('employee_id', 30).notNullable().unique();
      table.string('first_name', 100).notNullable();
      table.string('middle_name', 100);
      table.string('last_name', 100).notNullable();
      table.string('suffix', 10);
      table.date('date_of_birth');
      table.string('gender', 20);
      table.string('civil_status', 20);
      table.string('position', 100).notNullable();
      table.string('salary_grade', 20);
      table.integer('department_id').unsigned()
        .references('id').inTable('departments').onDelete('SET NULL');
      table.string('employment_status', 30).notNullable(); // Regular, Casual, Contractual, Co-terminus
      table.date('date_hired').notNullable();
      table.date('date_regularized');
      table.string('email', 100);
      table.string('mobile_number', 20);
      table.string('address_street', 255);
      table.string('address_barangay', 100);
      table.string('address_city', 100);
      table.string('address_province', 100);
      table.string('address_postal_code', 10);
      table.string('status', 20).notNullable().defaultTo('active'); // active, inactive, resigned, retired
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.integer('created_by').unsigned();
      table.integer('updated_by').unsigned();
      
      table.index('employee_id');
      table.index('department_id');
      table.index('status');
      table.index(['last_name', 'first_name']);
      table.index('employment_status');
    });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('employees');
};

