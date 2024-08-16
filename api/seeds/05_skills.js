/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('skills').del()
  await knex('skills').insert([
    {users_id: 1, name: 'Leadership'},
    {users_id: 1, name: 'Sabers'},
    {users_id: 1, name: 'Program Manager'}
  ]);
};
