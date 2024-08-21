const bcrypt = require('bcryptjs');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */


exports.seed = async function (knex) {
  const testPassword = '1234'
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(testPassword, salt);
  // Deletes ALL existing entries
  await knex('users').del()
  const users = await knex('users').insert([
    { name: 'John Johnson', rank: 'E1', password: hashedPassword, username: 'a1', isApprover: true },
    { name: 'Frank Sinatra', rank: 'E2', password: hashedPassword, username: 'a2', isApprover: false },
    { name: 'Frank Ocean', rank: 'E2', password: hashedPassword, username: 'a3', isApprover: false },
    { name: 'Bob Marley', rank: 'E3', password: hashedPassword, username: 'a4', isApprover: true },
    { name: 'Dan DeVito', rank: 'O1', password: hashedPassword, username: 'a5', isApprover: true },
    { name: 'Billy Butcher', rank: 'O1', password: hashedPassword, username: 'a6', isApprover: true },
    { name: 'Shawn Wayans', rank: 'O1', password: hashedPassword, username: 'a7', isApprover: true },
    { name: 'Yogi Bear', rank: 'O1', password: hashedPassword, username: 'a8', isApprover: true },
    { name: 'Mark Peterson', rank: 'O1', password: hashedPassword, username: 'a9', isApprover: true },
    { name: 'Daniel Miller', rank: 'O2', password: hashedPassword, username: 'fireball96d@gmail.com', isApprover: false },

  ]).returning('id');

  return users;
};

