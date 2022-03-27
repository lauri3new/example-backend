exports.up = knex => knex.schema.createTable('product', table => {
  table.string('id').primary()
  table.string('name')
  table.string('currency')
  table.integer('price')
  table.string('external_id')
  table.string('type')
  table.string('image')
})

exports.down = knex => knex.schema.dropTable('product')
