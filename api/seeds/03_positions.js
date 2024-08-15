/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('positions').del()
  await knex('positions').insert([
    {name: 'Bearer', events_id: 2, users_id: 2},
    // {name: 'Drill', events_id: 2, users_id: 1},
    // {name: 'Firing Party', events_id: 1, users_id: 2},
    // {name: 'Bearer', events_id: 2, users_id: 2},
    // {name: 'Drill', events_id: 2, users_id: 1},
    // {name: 'Firing Party', events_id: 1, users_id: 2},
    // {name: 'Color Guard', events_id: 3, users_id: 4},
    // {name: 'Bugler', events_id: 1, users_id: 3},
    // {name: 'Escort', events_id: 4, users_id: 5},
    // {name: 'Pallbearer', events_id: 5, users_id: 6},
    // {name: 'Flag Folder', events_id: 3, users_id: 7},
    // {name: 'Officer in Charge', events_id: 4, users_id: 8},
    // {name: 'NCOIC', events_id: 5, users_id: 9}
  ])}
