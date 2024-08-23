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

    { events_id: events[0].id, users_id: users[3].id },
    { events_id: events[12].id, users_id: users[7].id },
    { events_id: events[5].id, users_id: users[1].id },
    { events_id: events[22].id, users_id: users[9].id },
    { events_id: events[17].id, users_id: users[2].id },
    { events_id: events[3].id, users_id: users[4].id },
    { events_id: events[10].id, users_id: users[6].id },
    { events_id: events[25].id, users_id: users[8].id },
    { events_id: events[14].id, users_id: users[3].id },
    { events_id: events[19].id, users_id: users[5].id },
    { events_id: events[7].id, users_id: users[4].id },
    { events_id: events[23].id, users_id: users[2].id },
    { events_id: events[2].id, users_id: users[9].id },
    { events_id: events[16].id, users_id: users[7].id },
    { events_id: events[21].id, users_id: users[3].id },
    { events_id: events[11].id, users_id: users[1].id },
    { events_id: events[6].id, users_id: users[4].id },
    { events_id: events[9].id, users_id: users[6].id },
    { events_id: events[15].id, users_id: users[8].id },
    { events_id: events[18].id, users_id: users[5].id },
    { events_id: events[4].id, users_id: users[2].id },
    { events_id: events[20].id, users_id: users[7].id },
    { events_id: events[13].id, users_id: users[9].id },
    { events_id: events[1].id, users_id: users[3].id },
    { events_id: events[24].id, users_id: users[6].id },
    { events_id: events[8].id, users_id: users[4].id },
    { events_id: events[3].id, users_id: users[2].id },
    { events_id: events[0].id, users_id: users[0].id },
    { events_id: events[12].id, users_id: users[0].id },
    { events_id: events[5].id, users_id: users[0].id },
    { events_id: events[22].id, users_id: users[0].id },
    { events_id: events[17].id, users_id: users[0].id },
    { events_id: events[3].id, users_id: users[0].id },
    { events_id: events[10].id, users_id: users[0].id },
    { events_id: events[25].id, users_id: users[0].id },
    { events_id: events[14].id, users_id: users[0].id },
    { events_id: events[8].id, users_id: users[0].id },
    { events_id: events[27].id, users_id: users[0].id },
{ events_id: events[28].id, users_id: users[0].id },
{ events_id: events[29].id, users_id: users[0].id },
{ events_id: events[30].id, users_id: users[0].id },
{ events_id: events[31].id, users_id: users[0].id },
{ events_id: events[32].id, users_id: users[0].id },
{ events_id: events[33].id, users_id: users[0].id },
{ events_id: events[34].id, users_id: users[0].id },
{ events_id: events[35].id, users_id: users[0].id },
{ events_id: events[36].id, users_id: users[0].id }



  ]);
};