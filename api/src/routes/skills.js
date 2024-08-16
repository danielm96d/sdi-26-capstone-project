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
    knex('skills')
    .select('*')
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(301).send(`Error retrieving all skills: ${err}`);
    });
  } else if (id) {
    knex('skills')
      .select('*')
      .where({ id: id })
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
        console.log(err);
        res.status(301).send(`Error retrieving single skill: ${err}`);
      })
  }
});
//------------------CREATE-------------------\\
router.post("/", (req, res) => {
  const newskill = req.body;
  console.log('request body log output:', req.body);
  knex('skills')
    .insert(newskill)
    .returning('*')
    .then((insertedskill) => {
      res.status(201).json(insertedskill[0]);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(`Error creating new skill: ${err}`);
    });
});
//------------------UPDATE(by id)-------------------\\
router.patch("/:id", (req, res) => {
  const { id } = req.params;
  const updates = req.body;
console.log(updates)

  knex('skills')
    .where({ id: id })
    .update(updates)
    .returning("*")
    .then((updateskills) => {
      if (updateskills.length) {
        res.status(200).json(updateskills[0]);
      } else {
        res.status(404).send(`skill with id ${id} not found`);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(`Error updating skill: ${err}`);
    });
});

//------------------DELETE (by id)-------------------\\
router.delete('/:id', (req, res) => {
  knex('skills')
    .where({ id: req.params.id })
    .del()
    .then((deletedCount) => {
      if (deletedCount > 0) {
        res.json({ message: 'skill deleted successfully' });
      } else {
        res.status(404).json({ error: 'skill not found' });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(400).send(`Error deleting skill: ${err}`);
    });
});

module.exports = router;