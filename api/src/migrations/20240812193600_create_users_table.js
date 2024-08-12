/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('users_table', table => {
    table.increments();
    table.string('name');
    table.string('rank');
    table.string('password');
    table.string('username');
    table.boolean('isApprover');
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users_table');
};
