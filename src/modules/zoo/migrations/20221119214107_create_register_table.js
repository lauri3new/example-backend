exports.up = async function (knex) {
  await knex.raw('create schema if not exists zoo')
  return knex.schema.withSchema('zoo').createTable('register', table => {
    table.string('animal_id')
    table.string('animal_name')
    table.string('animal_type')
  })
}

exports.down = function (knex) {
  return knex.schema.withSchema('zoo').dropTable('register')
}
