const express = require('express');
const cors = require("cors");
const router = express.Router();
const knex = require("knex")(require("../../knexfile.js")[process.env.NODE_ENV || "development"]);

router.use(cors());
router.use(express.json());

router.get("/", async ( req, res ) => {
  res.header('Access-Control-Allow-Origin', req.header('origin'));
  const {id, list} = req.query
  console.log('id: ', id);
  console.log('list: ', list);
  // console.log('wrong one')

  if (!id && !list) {
    console.log('defaults')
    knex('positions')
    .select('*')
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(301).send(`Error retrieving all positions: ${err}`);
    });
  } else if (id) {
    console.log('checking id')
    let data = []
    let positionData = await knex('positions')
      .select(
        'id',
        'name',
        'users_id',
        'events_id'
      )
      .where({ id: id })
      // .then((data) => {
      //   res.status(200).send(data);
      // })
      .catch((err) => {
        console.log(err);
        res.status(301).send(`Error retrieving single position: ${err}`);
      })
      console.log(positionData[0].events_id)

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
      .where({ 'events.id': positionData[0].events_id })
      .catch((err) => {
        console.log(err);
        res.status(301).send(`Error retrieving single user: ${err}`);
      })

    // let userData = await knex('positons')


    data.push({...positionData[0], events: eventData})
    res.status(200).send(data);

  } else if (list) {
    console.log('working')
    knex('positions')
      .distinct('name')
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
        console.log(err);
        res.status(301).send(`Error retrieving single position: ${err}`);
      })
  }
});
//------------------CREATE-------------------\\
router.post("/", (req, res) => {
  res.header('Access-Control-Allow-Origin', req.header('origin'));
  const newPosition = req.body;
  console.log('request body log output:', req.body);
  knex('positions')
    .insert(newPosition)
    .returning('*')
    .then((insertedPosition) => {
      res.status(201).json(insertedPosition[0]);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(`Error creating new position: ${err}`);
    });
});
//------------------UPDATE(by id)-------------------\\
router.patch("/:id", (req, res) => {
  res.header('Access-Control-Allow-Origin', req.header('origin'));
  const { id } = req.params;
  const updates = req.body;
  console.log(updates)

  knex('positions')
    .where({ id: id })
    .update(updates)
    .returning("*")
    .then((updatePositions) => {
      if (updatePositions.length) {
        res.status(200).json(updatePositions[0]);
      } else {
        res.status(404).send(`Position with id ${id} not found`);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(`Error updating position: ${err}`);
    });
});

//------------------DELETE (by id)-------------------\\
router.delete('/:id', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.header('origin'));
  knex('positions')
    .where({ id: req.params.id })
    .del()
    .then((deletedCount) => {
      if (deletedCount > 0) {
        res.json({ message: 'Position deleted successfully' });
      } else {
        res.status(404).json({ error: 'Position not found' });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(400).send(`Error deleting position: ${err}`);
    });
});

module.exports = router;