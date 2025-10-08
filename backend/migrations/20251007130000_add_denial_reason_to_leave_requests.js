/**
 * Migration: Add denial_reason column to leave_requests table
 * This column stores the reason when a leave request is denied
 */

exports.up = function(knex) {
  return knex.schema.table('leave_requests', (table) => {
    table.text('denial_reason').after('approval_comments');
  });
};

exports.down = function(knex) {
  return knex.schema.table('leave_requests', (table) => {
    table.dropColumn('denial_reason');
  });
};

