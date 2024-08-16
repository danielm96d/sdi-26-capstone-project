const express = require('express');
const cors = require("cors");
const router = express.Router();
const knex = require("knex")(require("../../knexfile.js")[process.env.NODE_ENV || "development"]);

router.use(cors());
router.use(express.json());


//======================================positions_skills CRUD===========================================\\
router.get("/", async (req, res) => {
  const { positions, approver, skill } = req.query;

  console.log('Approver: ', approver)

  //this call should be able to get the skill information for all skills that a position is a participant of
  //this functions uses the query positions
  // console.log('Received request for skills_positions. id:', positions);
  if (positions) {
    await knex("skills_positions")
    .join('skills', 'skills_positions.skills_id', '=', 'skills.id')
    .join('positions', 'skills_positions.positions_id', '=', 'positions.id')
    .select('*')
    .where('positions_id', positions)
    .then((data) => {
      if (data.length !== 0) {
        res.status(200).send(data);
      } else {
        res.status(404).send("Error retrieving data")
      }
    })
    .catch((err) => {
      console.error('Error executing query:', err);
      res.status(500).send(`Error retrieving skills_positions data: ${err}`);
    });
    //this call should be able to get the skill information for all skills that a position is an approver of
    //this functions uses the query approver (this is a position id)
  } else if (approver){
      await knex("skills_positions")
        .join('skills', 'skills_positions.skills_id', '=', 'skills.id')
        .join('positions', 'skills_positions.positions_id', '=', 'positions.id')
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
        //this call should be able to get the skill information for a specific skill by skill id
        //this functions uses the query skill
  } else if (skill) {
      await knex('skills_positions')
      .join('skills', 'skills_positions.skills_id', '=', 'skills.id')
      .join('positions', 'skills_positions.positions_id', '=', 'positions.id')
      .select('*')
      .where('skills_id', skill)
      .then((data) => {
        if (data.length !== 0) {
          res.status(200).send(data);
        } else {
          res.status(404).send("No skill data found")
        }
      })
      .catch((err) => {
        console.error('Error executing query:', err);
        res.status(500).send(`Error retrieving skill data: ${err}`);
      });
  }
});



module.exports = router;