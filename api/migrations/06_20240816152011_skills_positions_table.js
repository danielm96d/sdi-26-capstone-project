/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('skills_positions', table => {
        table.increments();
        table.integer('skills_id').unsigned().notNullable();
        table.integer('positions_id').unsigned().notNullable();
        table.foreign('skills_id').references('id').inTable('skills').onDelete('CASCADE');
        table.foreign('positions_id').references('id').inTable('positions').onDelete('CASCADE');
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('skills_positions');
};
