/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('events_users').del()

  const users = await knex('users').select('id');
  const events = await knex('events').select('id');

  await knex('events_users').insert([
    {events_id: events[1].id, users_id: users[1].id, approver_id: users[0].id},
    {events_id: events[1].id, users_id: users[2].id, approver_id: users[0].id},
    {events_id: events[1].id, users_id: users[3].id, approver_id: users[0].id},
    {events_id: events[0].id, users_id: users[1].id, approver_id: users[0].id},
    {events_id: events[0].id, users_id: users[2].id, approver_id: users[0].id},
    {events_id: events[0].id, users_id: users[3].id, approver_id: users[0].id},
    {events_id: events[2].id, users_id: users[2].id, approver_id: users[3].id},
    {events_id: events[2].id, users_id: users[1].id, approver_id: users[3].id},
    {events_id: events[2].id, users_id: users[3].id, approver_id: users[3].id}
  ]);
};


//  await knex('events_users').insert([
//    {events_id: 1, users_id: 2, approver_id: 1},
//    {events_id: 2, users_id: 1, approver_id: 1},
//    {events_id: 3, users_id: 3, approver_id: 2},