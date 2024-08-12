/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    {name: 'John', rank: 'E1', password: '1234', username: 'A1', isApprover:false},
    {name: 'John', rank: 'E1', password: '1234', username: 'A1', isApprover:false},
    {name: 'John', rank: 'E1', password: '1234', username: 'A1', isApprover:false}
  ]);
};
