/**
 * Migration: Alter sessions.token to TEXT to support long JWTs
 */

exports.up = async function (knex) {
  // Use raw SQL for maximum compatibility on Postgres
  await knex.raw(`
    ALTER TABLE sessions
    ALTER COLUMN token TYPE TEXT USING token::text
  `);
};

exports.down = async function (knex) {
  // Revert back to VARCHAR(500); truncate values if longer
  await knex.raw(`
    ALTER TABLE sessions
    ALTER COLUMN token TYPE VARCHAR(500) USING LEFT(token, 500)
  `);
};

