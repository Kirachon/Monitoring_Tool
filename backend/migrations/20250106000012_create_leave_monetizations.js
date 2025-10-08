exports.up = function(knex) {
  return knex.schema.createTable('leave_monetizations', function(table) {
    table.increments('id').primary()
    table.integer('employee_id').notNullable().references('id').inTable('employees')
    table.date('retirement_date').notNullable()
    table.decimal('vl_balance', 8, 2).notNullable().defaultTo(0)
    table.decimal('sl_balance', 8, 2).notNullable().defaultTo(0)
    table.decimal('total_days', 8, 2).notNullable().defaultTo(0)
    table.decimal('daily_rate', 12, 2).notNullable().defaultTo(0)
    table.decimal('total_amount', 14, 2).notNullable().defaultTo(0)
    table.integer('created_by').notNullable().references('id').inTable('users')
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
  })
}

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('leave_monetizations')
}

