/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('users', table => {
    table.increments();
    table.string('name').notNullable();
    table.string('rank').notNullable();
    table.string("password").notNullable();
    table.string('username').notNullable();
    table.boolean('isApprover').notNullable();
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users');
};

