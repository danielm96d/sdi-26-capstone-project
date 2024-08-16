/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('skills_positions').del()
  await knex('skills_positions').insert([
    {skills_id: 1, positions_id: 1},
    {skills_id: 2, positions_id: 1},
    {skills_id: 3, positions_id: 1},
  ]);
};
