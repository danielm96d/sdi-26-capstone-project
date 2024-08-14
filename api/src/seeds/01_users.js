/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  const users = await knex('users').insert([
    {
      name: 'John',
      rank: 'E1',
      password: '1234',
      username: 'A1',
      isApprover:true

    },
    {
      name: 'Frank',
      rank: 'E2',
      password: '1234',
      username: 'A2',
      isApprover:false

    },
    {
      name: 'Zues',
      rank: 'E2',
      password: '1234',
      username: 'A2',
      isApprover:false

    },
    {
      name: 'Bob',
      rank: 'E3',
      password: '1234',
      username: 'A3',
      isApprover:true

    },
    {
      name: "Bob",
      rank: "E3",
      password: "1234",
      username: "A3",
      isApprover: true
    },
    {
      name: "Alice",
      rank: "E5",
      password: "qwerty",
      username: "B7",
      isApprover: false
    },
    {
      name: "Charlie",
      rank: "E4",
      password: "pass123",
      username: "C9",
      isApprover: true
    },
    {
      name: "Diana",
      rank: "E6",
      password: "securePass",
      username: "D2",
      isApprover: true
    },
    {
      name: "Evan",
      rank: "E2",
      password: "evan2024",
      username: "E8",
      isApprover: false
    }
  ]).returning('id');

  return users;
};

