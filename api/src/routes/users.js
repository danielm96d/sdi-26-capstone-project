const express = require('express');
const cors = require("cors");
const router = express.Router();
const knex = require("knex")(require("../../knexfile.js")[process.env.NODE_ENV || "development"]);

router.use(cors());
router.use(express.json());
//======================================USERS CRUD===========================================\\
//------------------READ-------------------\\
router.get("/", async (req, res) => {
  res.header('Access-Control-Allow-Origin', req.header('origin'));
  const { id, approver } = req.query

  //get all users:
  if (!id && !approver) {
    knex("users")
      .select(
        'id',
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
        'id',
        'name',
        'rank',
        'isApprover',
      )
      .where({ 'users.id': id })
      .catch((err) => {
        console.log(err);
        res.status(301).send(`Error retrieving single user: ${err}`);
      })

    let eventData = await knex('positions')
      .join('events', 'events.id', 'positions.events_id')
      .distinct(
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
      .where({ 'positions.users_id': id })
      .catch((err) => {
        console.log(err);
        res.status(301).send(`Error retrieving single user: ${err}`);
      })

      let positionData = await knex('positions')
      .join('users', 'users.id', '=', 'positions.users_id')
      .distinct('positions.*')
      .where({'positions.users_id': id})
      .catch((err) => {
        console.log(err);
        res.status(301).send(`Error retrieving single user: ${err}`);
      })

      data.push({...userData[0], events: eventData, positions: positionData})
      res.status(200).send(data);
  }  else if (approver) {
        await knex('users')
          .select(
            'id',
            'name',
            'rank',
            'isApprover',
          )
          .where({ 'isApprover': true })
          .then((data) => {
            res.status(201).json(data);
          })
          .catch((err) => {
            console.log(err);
            res.status(301).send(`Error retrieving single user: ${err}`);
          });
  }
});

router.get('/self', async (req, res) => {
  try {
    res.header('Access-Control-Allow-Origin', req.header('origin'));
  let data = []
  // console.log('self id: ',req.user.id)
  let userData = await knex('users')
    .select(
      'id',
      'name',
      'rank',
      'isApprover',
    )
    .where({ 'users.id': req.user.id })
    .catch((err) => {
      console.log(err);
      res.status(301).send(`Error retrieving single user: ${err}`);
    })
    //returns the events they are an user for
  let eventData = await knex('positions')
    .join('events', 'events.id', 'positions.events_id')
    .distinct(
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
      'events.approved'
    )
    .where({ 'positions.users_id': req.user.id })
    .catch((err) => {
      console.log(err);
      res.status(301).send(`Error retrieving single user: ${err}`);
    })

        //returns the events they are an approver for
    let approverData = await knex('approvers')
    .join('events', 'events.id', 'approvers.events_id')
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
      'events.approved'
    )
    .where({ 'approvers.users_id': req.user.id })
    .catch((err) => {
      console.log(err);
      res.status(301).send(`Error retrieving single user: ${err}`);
    })

  //Need to check the userID with the Creator ID
  //Need to check the positions/events join to see if they are a participant
  let tempPermissionsIdList = await knex('positions')
  .join('events', 'events.id', 'positions.events_id' )
  .distinct(
    'events.id'
  )
  .where({'positions.users_id': req.user.id})
  .orWhere({'events.creatorID': req.user.id})
  let permissionsIdList = []
  tempPermissionsIdList.map((item)=>{
    permissionsIdList.push(item.id)
  })
  console.log('permissions ID LIST: ', permissionsIdList)


  data.push({ ...userData[0], permissions: permissionsIdList , overseenEvents: approverData, events: eventData })
  // console.log('working')
  res.status(200).send(data);
  } catch (error) {
    console.log(error)
  }
})

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
    .where({ id: id })
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