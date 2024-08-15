const express = require('express');
const cors = require("cors");
const router = express.Router();
const knex = require("knex")(require("../../knexfile.js")[process.env.NODE_ENV || "development"]);

router.use(cors());
router.use(express.json());
//======================================USERS CRUD===========================================\\
//------------------READ (all and by id)-------------------\\
router.get("/", async ( req, res ) => {
  res.header('Access-Control-Allow-Origin', req.header('origin'));
  const {id} = req.query
  console.log('id: ', id);

  //get all users:
  if (!id) {
    knex("users")
    .select(
      'name',
      'rank',
      'isApprover',
    )
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(301).send(`Error retrieving single user: ${err}`);
    });
  }

  //Get a single user by ID
  else if (id) {
    let data = []
    let userData = await knex('users')
      .select(
        'name',
        'rank',
        'isApprover',
      )
      .where({ 'users.id': id })
      // .then((data) => {
      //   res.status(200).send(data);
      // })
      .catch((err) => {
        console.log(err);
        res.status(301).send(`Error retrieving single user: ${err}`);
      })

    let eventData = await knex('events_users')
      .join('events', 'events.id', 'events_users.events_id')
      .select(
        'events.id',
        'events.name',
        'events.startTime',
        'events.endTime',
        'events.startDate',
        'events.endDate',
        'events.description',
        'events.type',
        'events.POCinfo',
        'events.location',
       )
      .where({ 'events_users.users_id': id })
      // .then((data) => {
      //   res.status(200).send(data);
      // })
      .catch((err) => {
        console.log(err);
        res.status(301).send(`Error retrieving single user: ${err}`);
      })

      data.push({...userData[0], events: eventData})
      res.status(200).send(data);
  }
});

//------------------CREATE-------------------\\
router.post("/", (req, res) => {
  res.header('Access-Control-Allow-Origin', req.header('origin'));
  const newUser = req.body;

  knex('users')
    .insert(newUser)
    .returning('*')
    .then((insertedUser) => {
      res.status(201).json(insertedUser[0]);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(`Error creating new user: ${err}`);
    });
});

//------------------DELETE (by id)-------------------\\
router.delete("/:id", (req, res) => {
  res.header('Access-Control-Allow-Origin', req.header('origin'));
  const { id } = req.params;

  knex('users')
    .where({ id: id})
    .del()
    .then((count) => {
      if (count > 0) {
        res.status(200).send(`User with ${id} deleted successfully`);
      } else {
        res.status(404).send(`User with id ${id} not found`);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(`Error deleting user: ${err}`);
    });
})

//------------------UPDATE(by id)-------------------\\
router.patch("/:id", (req, res) => {
  res.header('Access-Control-Allow-Origin', req.header('origin'));
  const { id } = req.params;
  const updates = req.body;

  knex('users')
    .where({ id: id })
    .update(updates)
    .returning("*")
    .then((updateUser) => {
      if (updateUser.length) {
        res.status(200).json(updateUser[0]);
      } else {
        res.status(404).send(`User with id ${id} not found`);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(`Error updating user: ${err}`);
    });
});

module.exports = router;