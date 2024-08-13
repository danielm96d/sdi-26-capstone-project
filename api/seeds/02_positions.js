/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('positions').del()
  await knex('positions').insert([
    {name: 'Bearer', events_id: 2},
    {name: 'Firing Party', events_id: 1},
    {name: 'Drill', events_id: 2},
  ]);
};
