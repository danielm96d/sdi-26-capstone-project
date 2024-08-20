/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('approvers').del()

  const users = await knex('users').select('id');
  const events = await knex('events').select('id');

  await knex('approvers').insert([
    {events_id: events[0].id, users_id: users[0].id},

    {events_id: events[1].id, users_id: users[4].id},

    {events_id: events[2].id, users_id: users[3].id},

    {events_id: events[3].id, users_id: users[7].id},

    {events_id: events[4].id, users_id: users[7].id},
  ]);
};