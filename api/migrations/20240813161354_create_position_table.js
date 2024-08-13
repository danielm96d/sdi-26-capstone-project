/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('positions', table => {
    table.increments();// table.increments('id').primary();

    table.string('name').notNullable();
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
    return knex.schema.hasColumn("positions", "events_id").then((exists) => {
      if (exists) {
        table.dropForeign("events_id");
      }
    });
  })
  .then(function () {
    return knex.schema.dropTableIfExists("positions");
  });
};
