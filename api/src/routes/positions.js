const express = require('express');
const cors = require("cors");
const router = express.Router();
const knex = require("knex")(require("../../knexfile.js")[process.env.NODE_ENV || "development"]);

router.use(cors());
router.use(express.json());

router.get("/", ( req, res ) => {
  const {id} = req.query
  console.log('id: ', id);
  // console.log('wrong one')

  if (!id) {
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
    knex('positions')
      .select('*')
      .where({ events_id: id })
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
  const newPosition = req.body;

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
  knex('positions')
    .where({ id: req.params.id })
    .del()
    .then((deletedCount) => {
      if (deletedCount > 0) {
        res.json({ message: 'Positon deleted successfully' });
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