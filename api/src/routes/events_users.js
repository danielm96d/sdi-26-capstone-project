const express = require('express');
const cors = require("cors");
const router = express.Router();
const knex = require("knex")(require("../../knexfile.js")[process.env.NODE_ENV || "development"]);

router.use(cors());
router.use(express.json());


//======================================USERS_EVENTS CRUD===========================================\\
router.get("/", async (req, res) => {
  const { users, approver, event } = req.query;

  console.log('Approver: ', approver)

  //this call should be able to get the event information for all events that a user is a participant of
  //this functions uses the query users
  // console.log('Received request for events_users. id:', users);
  if (users) {
    await knex("events_users")
    .join('events', 'events_users.events_id', '=', 'events.id')
    .join('users', 'events_users.users_id', '=', 'users.id')
    .select('*')
    .where('users_id', users)
    .then((data) => {
      if (data.length !== 0) {
        res.status(200).send(data);
      } else {
        res.status(404).send("Error retrieving data")
      }
    })
    .catch((err) => {
      console.error('Error executing query:', err);
      res.status(500).send(`Error retrieving events_users data: ${err}`);
    });
    //this call should be able to get the event information for all events that a user is an approver of
    //this functions uses the query approver (this is a user id)
  } else if (approver){
      await knex("events_users")
        .join('events', 'events_users.events_id', '=', 'events.id')
        .join('users', 'events_users.users_id', '=', 'users.id')
        .select('*')
        .where('approver_id', approver)
        .andWhere({
          isApprover: 'true'
        })
        .then((data) => {
          if (data.length !== 0) {
            res.status(200).send(data);
          } else {
            res.status(404).send("No approver data found")
          }
        })
        .catch((err) => {
          console.error('Error executing query:', err);
          res.status(500).send(`Error retrieving approver data: ${err}`);
        });
        //this call should be able to get the event information for a specific event by event id
        //this functions uses the query event
  } else if (event) {
      await knex('events_users')
      .join('events', 'events_users.events_id', '=', 'events.id')
      .join('users', 'events_users.users_id', '=', 'users.id')
      .select('*')
      .where('events_id', event)
      .then((data) => {
        if (data.length !== 0) {
          res.status(200).send(data);
        } else {
          res.status(404).send("No event data found")
        }
      })
      .catch((err) => {
        console.error('Error executing query:', err);
        res.status(500).send(`Error retrieving event data: ${err}`);
      });
  }
});



module.exports = router;