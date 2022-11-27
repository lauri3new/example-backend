exports.up = async function (knex) {
  await knex.raw('create schema if not exists zoo')
  return knex.schema.withSchema('food').createTable('register', table => {
    table.string('animal_id')
    table.string('food')
    table.string('value')
  })
}

exports.down = async function (knex) {
  await knex.schema.withSchema('food').dropTable('register')
  await knex.dropSchema('food')
}
