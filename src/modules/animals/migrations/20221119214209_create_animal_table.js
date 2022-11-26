exports.up = async function (knex) {
  await knex.raw('create schema if not exists animals')
  return knex.schema.withSchema('animals').createTable('animal', table => {
    table.string('id')
    table.string('name')
    table.string('type')
    table.datetime('updated_at')
  })
}

exports.down = function (knex) {
  return knex.schema.withSchema('animals').dropTable('animal')
}
