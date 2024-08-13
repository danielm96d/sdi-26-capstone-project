require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require('bcryptjs')
const app = express();
// **NOTE: process.env.NODE_ENV is keyed to use compose as opposed to development, may need altering for deployment
const knex = require("knex")(
  require("./knexfile.js")[process.env.NODE_ENV || "development"]
);
const PORT = 8080;

app.use(cors());
app.use(express.json());

app.get("/", (req, res)=>{
  console.log("test")// this log is used to test live updates within the docker environment
  res.send(`application running using NODE_ENV: ${process.env.NODE_ENV}`);//this line will need editing for deployment
})

app.get("/users*", ( req, res ) => {
  const {id} = req.query
  console.log('id: ', id);

  if (!id) {
    knex("users")
    .select('*')
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(301).send(`Error retrieving single user: ${err}`);
    });
  } else if (id) {
    knex('users')
      .select('*')
      .where({ id: id })
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
        console.log(err);
        res.status(301).send(`Error retrieving single user: ${err}`);
      })
  }
});

app.post("/users", (req, res) => {
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




app.listen(PORT, () => {
  console.log(`application running using NODE_ENV: ${process.env.NODE_ENV}`);//this line will need editing for deployment
});


// app.get("/events*", ( req, res ) => {
//   const {id} = req.query
//   console.log('id: ', id);

//   if (!id) {
//     knex("events")
//     .select('*') // selects all info from events_table
//     .then((data) => {
//       res.status(200).send(data);
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(301).send("Error retrieving events");
//     });
//   } else if (id) {
//     knex('events')
//       .select('*')
//       .where({ id: id })
//       .then((data) => {
//         res.status(200).send(data);
//       })
//       .catch((err) => {
//         console.log(err);
//         res.status(301).send("Error retrieving single event");
//       })
//   }
// });