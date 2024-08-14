/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    {name: 'John', rank: 'E1', password: '1234', username: 'A1', isApprover:false},
    {name: 'Frank', rank: 'E2', password: '1234', username: 'A2', isApprover:false},
    {name: 'Bob', rank: 'E3', password: '1234', username: 'A3', isApprover:false}
  ]);
};

