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


//======================================USERS CRUD===========================================\\
//------------------READ (all and by id)-------------------\\
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

//------------------CREATE-------------------\\
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

//------------------DELETE (by id)-------------------\\
app.delete("/users/:id", (req, res) => {
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
app.patch("/users/:id", (req, res) => {
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

//=====================================Events CRUD===========================================\\

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

// app.post("/events", (req, res) => {
//   const newUser = req.body;

//   knex('events')
//     .insert(newEvent)
//     .returning('*')
//     .then((insertedEvent) => {
//       res.status(201).json(insertedEvent[0]);
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).send(`Error creating new event: ${err}`);
//     });
// });

// app.put('/events/:id', (req, res) => {
//   const updatedEvent = req.body;
//   knex('events')
//     .where({ id: req.params.id })
//     .update(updatedEvent)
//     .then((updatedCount) => {
//       if (updatedCount) {
//         res.json({ message: 'Event updated successfully' });
//       } else {
//         res.status(404).json({ error: 'Event not found' });
//       }
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(400).send(`Error updating Event: ${err}`);
//     });
// });

// app.delete('/events/:id', (req, res) => {
//   knex('events')
//     .where({ id: req.params.id })
//     .del()
//     .then((deletedCount) => {
//       if (deletedCount > 0) {
//         res.json({ message: 'Event deleted successfully' });
//       } else {
//         res.status(404).json({ error: 'Event not found' });
//       }
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(400).send(`Error deleting event: ${err}`);
//     });
// });