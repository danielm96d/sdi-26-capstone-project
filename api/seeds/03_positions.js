/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('positions').del()
  await knex('positions').insert([
    {name: 'Bearer', events_id: 2, users_id: 2},
    {name: 'Drill', events_id: 2, users_id: 1},
    {name: 'Firing Party', events_id: 1, users_id: 2}
  ])}
