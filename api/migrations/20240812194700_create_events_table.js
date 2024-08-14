/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('events', table => {
    table.increments();
    table.string('name').notNullable();
    table.time('startTime').notNullable();
    table.time('endTime').notNullable();
    table.date('startDate').notNullable();
    table.date('endDate').notNullable();
    table.text('description');
    table.string('type').notNullable();
    table.boolean('approved').defaultTo(false);
    table.string('location');
    table.string('POCinfo');
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

// table.increments('id').primary();

