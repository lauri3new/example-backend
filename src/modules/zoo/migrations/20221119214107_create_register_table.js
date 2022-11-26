exports.up = async function (knex) {
  await knex.raw('create schema if not exists zoo')
  return knex.schema.withSchema('zoo').createTable('register', table => {
    table.integer('count')
  })
}

exports.down = function (knex) {
  return knex.schema.withSchema('zoo').dropTable('register')
}
