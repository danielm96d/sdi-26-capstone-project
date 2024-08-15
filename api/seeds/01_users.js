/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  const users = await knex('users').insert([
    {name: 'John', rank: 'E1', password: '1234', username: 'A1', isApprover:true},
    {name: 'Frank', rank: 'E2', password: '1234', username: 'A2', isApprover:false},
    {name: 'Frank', rank: 'E2', password: '1234', username: 'A3', isApprover:false},
    {name: 'Bob', rank: 'E3', password: '1234', username: 'A4', isApprover:true},
    {name: 'Dan', rank: 'O1', password: '1234', username: 'A5', isApprover:true},
    {name: 'Billy', rank: 'O1', password: '1234', username: 'A6', isApprover:true},
    {name: 'Shawn', rank: 'O1', password: '1234', username: 'A7', isApprover:true},
    {name: 'Yogi', rank: 'O1', password: '1234', username: 'A8', isApprover:true},
    {name: 'Peterson', rank: 'O1', password: '1234', username: 'A9', isApprover:true},

  ]).returning('id');

  return users;
};

