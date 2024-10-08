/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('participants', table => {
    table.increments();
    table.integer('events_id').unsigned().notNullable();
    table.integer('users_id').unsigned().notNullable();
    table.foreign('events_id').references('id').inTable('events').onDelete('CASCADE');//references("id").inTable('events').
    table.foreign('users_id').references('id').inTable('users').onDelete('CASCADE');//references("id").inTable('users').
    // table.unique(['events_id', 'users_id']);
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('participants');
};