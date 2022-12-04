exports.up = knex => knex.schema.withSchema('animals').createTable('app_task', table => {
  table.string('id').primary()
  table.string('kind').notNullable()
  table.string('event_id').notNullable()
  table.integer('attempt_count').notNullable().defaultTo(0)
  table.datetime('last_attempt_at')
  table.datetime('created_at').notNullable().defaultTo(knex.fn.now())
  table.datetime('processed_at')
})

exports.down = knex => knex.schema.withSchema('animals').dropTable('app_task')
