/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('events', table => {
    table.increments();
    table.string('name');
    table.datetime('startTime');
    table.datetime('endTime');
    table.date('startDate');
    table.date('endDate');
    table.text('description');
    table.string('type');
    table.boolean('approved');
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('events_table');
};
