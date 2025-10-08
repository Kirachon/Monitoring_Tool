/**
 * Seed: Reset Admin Password and Unlock Account (Idempotent)
 * Use when E2E tests need a known admin credential.
 */

const bcrypt = require('bcrypt');

exports.seed = async function(knex) {
  const username = 'admin';
  const plain = 'Admin123!';
  const hash = await bcrypt.hash(plain, 10);

  const user = await knex('users').where({ username }).first();
  if (!user) {
    console.log('⚠️  Admin user not found; skipping reset.');
    return;
  }

  await knex('users')
    .where({ id: user.id })
    .update({
      password_hash: hash,
      status: 'active',
      failed_login_attempts: 0,
      last_failed_login: null,
      must_change_password: false,
      updated_at: knex.fn.now()
    });

  console.log('✅ Admin user password reset and account unlocked.');
};

