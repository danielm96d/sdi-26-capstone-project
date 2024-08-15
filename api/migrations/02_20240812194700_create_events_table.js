/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('events', table => {
    table.increments();
    table.string('name');
    table.time('startTime');
    table.time('endTime');
    table.date('startDate');
    table.date('endDate');
    table.text('description');
    table.string('type');
    table.boolean('approved');
    table.string('POCinfo');
    table.string('location');
    table.timestamps(true, true);
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('events');
};
