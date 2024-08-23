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
      location: "Denver",
      POCinfo: "John",
      creatorID: 1
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
      location: "DC",
      POCinfo: "Jake",
      creatorID: 1
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
      location: "Dover",
      POCinfo: "Ben",
      creatorID: 1
    },
    {
      name: "Surgery Recovery",
      startTime: "07:00:00",
      endTime: "16:00:00",
      startDate: "2025-01-20",
      endDate: "2025-01-20",
      description: "long day",
      type: "Request",
      approved: "true",
      location: "DC",
      POCinfo: "John",
      creatorID: 1
    },
    {
      name: "Tech Conference 2024",
      startTime: "09:00:00",
      endTime: "17:00:00",
      startDate: "2024-09-15",
      endDate: "2024-09-17",
      description: "Annual technology conference featuring keynote speakers and workshops",
      type: "Conference",
      approved: "true",
      location: "San Francisco",
      POCinfo: "Sarah Johnson",
      creatorID: 1
    },
    {
      name: "Community Garden Planting Day",
      startTime: "08:30:00",
      endTime: "14:00:00",
      startDate: "2024-04-22",
      endDate: "2024-04-22",
      description: "Join us for Earth Day as we plant new vegetables and flowers in the community garden",
      type: "Community Event",
      approved: "true",
      location: "Central Park",
      POCinfo: "Mike Chen",
      creatorID: 1
    },
    {
      name: "Annual Charity Gala",
      startTime: "19:00:00",
      endTime: "23:00:00",
      startDate: "2024-11-10",
      endDate: "2024-11-10",
      description: "Fundraising event for local children's hospital",
      type: "Fundraiser",
      approved: "true",
      location: "Grand Ballroom, Hilton Hotel",
      POCinfo: "Emily Wright",
      creatorID: 1
    },
    {
      name: "Summer Music Festival",
      startTime: "12:00:00",
      endTime: "23:00:00",
      startDate: "2024-07-20",
      endDate: "2024-07-22",
      description: "Three-day outdoor music festival featuring local and international artists",
      type: "Concert",
      approved: "true",
      location: "Riverfront Park",
      POCinfo: "David Lee",
      creatorID: 1
    },
    {
      name: "Virtual Book Club Meeting",
      startTime: "19:30:00",
      endTime: "21:00:00",
      startDate: "2024-06-05",
      endDate: "2024-06-05",
      description: "Online discussion of this month's selected novel",
      type: "Club Meeting",
      approved: "true",
      location: "Zoom",
      POCinfo: "Lisa Tran",
      creatorID: 1
    },
    {
      name: "Virtual Book Club Meeting",
      startTime: "19:30:00",
      endTime: "21:00:00",
      startDate: "2024-06-05",
      endDate: "2024-06-05",
      description: "Online discussion of this month's selected novel",
      type: "Club Meeting",
      approved: "true",
      location: "Zoom",
      POCinfo: "Lisa Tran",
      creatorID: 1
    },
    {
      name: "Virtual Book Club Meeting",
      startTime: "19:30:00",
      endTime: "21:00:00",
      startDate: "2024-06-05",
      endDate: "2024-06-05",
      description: "Online discussion of this month's selected novel",
      type: "Club Meeting",
      approved: "true",
      location: "Zoom",
      POCinfo: "Lisa Tran",
      creatorID: 1
    },
    {
      name: "Mission Briefing",
      startTime: "15:30:00",
      endTime: "16:00:00",
      startDate: "2024-06-05",
      endDate: "2024-06-05",
      description: "SCI Briefing on current mission",
      type: "Official Briefing",
      approved: "true",
      location: "Zoom",
      POCinfo: "Johnny Knox-ville",
      creatorID: 1
    },
  ]);
};
