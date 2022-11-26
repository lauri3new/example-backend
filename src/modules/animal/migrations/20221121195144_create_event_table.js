exports.up = knex => knex.schema.withSchema('animals').createTable('app_event', table => {
  table.string('id').primary()
  table.string('type').notNullable()
  table.jsonb('data').notNullable()
  table.datetime('created_at')
})

exports.down = knex => knex.schema.withSchema('animals').dropTable('app_event')
