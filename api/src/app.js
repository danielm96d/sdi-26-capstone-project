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
app.get("/users", ( req, res ) => {
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
//------------------READ (all and by id)-------------------\\
app.get("/events", ( req, res ) => {
  const {id} = req.query
  console.log('id: ', id);

  if (!id) {
    knex("events")
    .select('*') // selects all info from events_table
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(301).send("Error retrieving events");
    });
  } else if (id) {
    knex('events')
      .select('*')
      .where({ id: id })
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
        console.log(err);
        res.status(301).send("Error retrieving single event");
      })
  }
});
//------------------CREATE-------------------\\
app.post("/events", (req, res) => {
  const newEvent = req.body;

  knex('events')
    .insert(newEvent)
    .returning('*')
    .then((insertedEvent) => {
      res.status(201).json(insertedEvent[0]);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(`Error creating new event: ${err}`);
    });
});
//------------------UPDATE(by id)-------------------\\
app.patch('/events/:id', (req, res) => {
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
app.delete('/events/:id', (req, res) => {
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

//======================================POSITIONS CRUD===========================================\\
//------------------READ (all and by id)-------------------\\
app.get("/positions*", ( req, res ) => {
  const {id} = req.query
  console.log('id: ', id);
  // console.log('wrong one')

  if (!id) {
    knex("positions")
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
      .where({ id: id })
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
app.post("/positions", (req, res) => {
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
app.patch("/positions/:id", (req, res) => {
  const { id } = req.params;
  const updates = req.body;

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
app.delete('/positions/:id', (req, res) => {
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

//======================================USERS_EVENTS CRUD===========================================\\
app.get("/events_users", async (req, res) => {
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
  } else if (approver){
      await knex("events_users")
        .join('events', 'events_users.events_id', '=', 'events.id')
        .join('users', 'events_users.users_id', '=', 'users.id')
        .select('*')
        .where('users_id', approver)
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
          res.status(500).send(`Error retrieving events_users data: ${err}`);
        });
  }


  //this call should be able to get the event information for all events that a user is an approver of
  //this functions uses the query approver (this is a user id)

  //this call should be able to get the event information for a specific event by event id
  //this functions uses the query event

  //https://localhost:8080/events_users?id=1
});


app.listen(PORT, () => {
  console.log(`application running using NODE_ENV: ${process.env.NODE_ENV}`);//this line will need editing for deployment
});

// .join('users', 'users.id', 'events.users_id')
// .select('posts.id', 'users.username', 'posts.contents')
// .where({user_id: id})

//======================Register===========================\\
// app.post('/register', authenticateUser, async (req, res) => {
//   const newUser = req.body;
//   bcrypt.hash(newUser.password, 10, (err, hashedPassword) => {
//       if (err) {
//           console.error(err);
//           return res.status(400).send("Error posting user");
//       }
//       newUser.password = hashedPassword;
//       knex('users')
//           .insert(newUser)
//           .returning('id')
//           .then((id) => {
//               res.status(201).redirect('/login');//redirect to login route
//           })
//           .catch((err) => {
//               console.error(err);
//               res.status(400).send("Error posting user");
//           });
//   });
// });
