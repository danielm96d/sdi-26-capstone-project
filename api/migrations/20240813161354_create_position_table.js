/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('positions', table => {
    table.increments();// table.increments('id').primary();

    table.string('name').notNullable();
    table.integer('users_id').unsigned();
    table.foreign("users_id").references("id").inTable('users').onDelete("CASCADE");
    table.integer('events_id').unsigned();
    table.foreign("events_id").references("id").inTable('events').onDelete("CASCADE");
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
  .alterTable("positions", (table) => {
    return knex.schema.hasColumn("positions", "users_id", "events_id").then((exists) => {
      if (exists) {
        table.dropForeign("users_id", "events_id");
      }
    });
  })
  .then(function () {
    return knex.schema.dropTableIfExists("positions");
  });
};
