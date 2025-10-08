/**
 * Migration: Create Certificate Tables
 * Certificate template management and generation tracking
 */

exports.up = function(knex) {
  return knex.schema
    // Certificate Templates table
    .createTable('certificate_templates', (table) => {
      table.increments('id').primary();
      table.string('name', 100).notNullable();
      table.string('certificate_type', 50).notNullable(); // Employment, Clearance, Leave Credits, Service Record
      table.text('template_content').notNullable(); // HTML/Rich text with placeholders
      table.json('placeholders'); // Array of available placeholders
      table.boolean('is_active').defaultTo(true);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.integer('created_by').unsigned().references('id').inTable('users');
      table.integer('updated_by').unsigned().references('id').inTable('users');
      
      table.index('certificate_type');
      table.index('is_active');
    })
    
    // Certificates table (generation log)
    .createTable('certificates', (table) => {
      table.increments('id').primary();
      table.string('reference_no', 30).notNullable().unique(); // CERT-YYYY-NNNN
      table.integer('employee_id').unsigned().notNullable()
        .references('id').inTable('employees').onDelete('CASCADE');
      table.integer('template_id').unsigned().notNullable()
        .references('id').inTable('certificate_templates').onDelete('RESTRICT');
      table.integer('signatory_id').unsigned()
        .references('id').inTable('employees').onDelete('SET NULL');
      table.string('file_path_pdf', 500);
      table.string('file_path_word', 500);
      table.string('status', 20).notNullable().defaultTo('Issued'); // Issued, Revoked, Reissued
      table.date('issued_date').notNullable().defaultTo(knex.fn.now());
      table.integer('issued_by').unsigned().references('id').inTable('users');
      table.text('revocation_reason');
      table.timestamp('revoked_at');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      
      table.index('reference_no');
      table.index('employee_id');
      table.index('template_id');
      table.index('status');
      table.index('issued_date');
    })
    
    // Digital Signatures table
    .createTable('digital_signatures', (table) => {
      table.increments('id').primary();
      table.integer('employee_id').unsigned().notNullable().unique()
        .references('id').inTable('employees').onDelete('CASCADE');
      table.string('signature_path', 500).notNullable();
      table.string('signature_title', 100); // e.g., "HR Manager", "Office Director"
      table.timestamp('uploaded_at').defaultTo(knex.fn.now());
      table.integer('uploaded_by').unsigned().references('id').inTable('users');
      
      table.index('employee_id');
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('digital_signatures')
    .dropTableIfExists('certificates')
    .dropTableIfExists('certificate_templates');
};

