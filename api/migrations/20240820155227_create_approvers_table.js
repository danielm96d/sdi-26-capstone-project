/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('approvers', table => {
    table.increments();
    table.integer('events_id').unsigned().notNullable();
    table.integer('users_id').unsigned().notNullable();
    table.foreign('events_id').references('id').inTable('events').onDelete('CASCADE');//references("id").inTable('events').
    table.foreign('users_id').references('id').inTable('users').onDelete('CASCADE');//references("id").inTable('users').
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('approvers');
};
