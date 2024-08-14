/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("events").del();
  await knex("events").insert([
    {
      name: "Smith Funeral",
      startTime: "12:00:00",
      endTime: "12:00:00",
      startDate: "2024-08-26",
      endDate: "2024-08-26",
      description: "RIP in Peace",
      type: "Funeral",
      approved: "true",
    },
    {
      name: "Jones Retirement",
      startTime: "09:00:00",
      endTime: "10:00:00",
      startDate: "2024-08-28",
      endDate: "2024-08-28",
      description: "About time",
      type: "Retirement",
      approved: "false",
    },
    {
      name: "Ralph Nader Inaguration",
      startTime: "07:00:00",
      endTime: "16:00:00",
      startDate: "2025-01-20",
      endDate: "2025-01-20",
      description: "long day",
      type: "Inaguration",
      approved: "true",
    },
  ]);
};
