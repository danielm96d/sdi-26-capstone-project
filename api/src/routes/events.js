const express = require('express');
const cors = require("cors");
const router = express.Router();
const knex = require("knex")(require("../../knexfile.js")[process.env.NODE_ENV || "development"]);

router.use(cors());
router.use(express.json());


//=====================================Events CRUD===========================================\\
//------------------READ (all and by id)-------------------\\
router.get("/", async ( req, res ) => {
  res.header('Access-Control-Allow-Origin', req.header('origin'));
  const {id} = req.query
  console.log('id: ', id);


  if (!id) {
   knex('events')
    .select('*')
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(301).send("Error retrieving events");
    });

  } else if (id) {
    let responseData = []
    let eventData = await knex('events')
      .select('*')
      .where({ id: id })
      .catch((err) => {
        console.log(err);
        res.status(301).send("Error retrieving single event");
      })

    responseData.push(...eventData) // needs update, approver is currently showing users id from positions?
    let approverData = await knex("approvers")
      .join('users', 'approvers.users_id', '=', 'users.id')
      .distinct('users_id as id', 'name', 'rank')
      .where({
        'approvers.events_id': id,
        'users.isApprover': true
      })

    responseData[0].approver = approverData;

    let positionData = await knex('positions')
      .join('users', 'positions.users_id', '=', 'users.id')
      .join('events', 'positions.events_id', '=', 'events.id')
      .select(
        'positions.id',
        'positions.name as position_name',
        'positions.events_id',
        'positions.users_id as user_id',
        'users.name as victim',
        'users.rank',
      )
      .where({
        'positions.events_id': id
      })

    responseData[0].position = positionData;
    res.status(200).send(responseData)


  }
});

router.get('/requests', (req,res) => {
  res.header('Access-Control-Allow-Origin', req.header('origin'));
  const {id} = req.query;
  // console.log('event request ID: ', id)

  if (!id) {
    knex("events")
    .select('*') // selects all info from events_table
    .where({
      'type': 'Request'
    })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(301).send("Error retrieving events");
    });
  } else if(id){
    knex("events")
    .select('*') // selects all info from events_table
    .where({
      'type': 'Request',
      "id": id
    })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(301).send("Error retrieving events");
    });
  } else {
    res.status(301).send("Error retrieving events");
  }
})

//------------------CREATE-------------------\\
router.post("/", (req, res) => {
  res.header('Access-Control-Allow-Origin', req.header('origin'));
  const body = req.body;
  const eventData = {
    name: body.name,
    startTime: body.startTime,
    endTime: body.endTime,
    startDate: body.startDate,
    endDate: body.endDate,
    description: body.description,
    type: body.type,
    approved: body.approved,
    POCinfo: body.POCinfo,
    location: body.location
  }
  knex('events')
    .insert(eventData)
    .returning('*')
    .then((insertedEvent) => {
      let approverObj = {events_id: insertedEvent[0].id, users_id: body.approver}
      // res.status(201).json(insertedEvent[0]);
      knex('approvers')
      .insert(approverObj)
      .returning('*')
      .then(data=>{
        res.status(201).json({eventDetails: {...insertedEvent[0]}, approverDetails: {...data[0]}});
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send(`Error creating new event: ${err}`);
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(`Error creating new event: ${err}`);
    });
});

//------------------UPDATE(by id)-------------------\\
router.patch('/:id', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.header('origin'));
  const updatedEvent = req.body;
  console.log('updatedEvent: ', updatedEvent)

  knex('events')
    .where({ id: req.params.id })
    .update(updatedEvent)
    .then((updatedCount) => {
      if (updatedCount) {
        res.json({ message: 'Event updated successfully' });
      } else {
        res.status(404).json({ error: 'Event not found' });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(400).send(`Error updating Event: ${err}`);
    });
});
//------------------DELETE (by id)-------------------\\
router.delete('/:id', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.header('origin'));
  console.log(req.params.id)
  knex('events')
    .where({ id: req.params.id })
    .del()
    .then((deletedCount) => {
      if (deletedCount > 0) {
        res.json({ message: 'Event deleted successfully' });
      } else {
        res.status(404).json({ error: 'Event not found' });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(400).send(`Error deleting event: ${err}`);
    });
});



module.exports = router;