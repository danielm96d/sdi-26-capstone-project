require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const util = require('util')
const knex = require("knex")(require("../knexfile.js")[process.env.NODE_ENV || "development"]);

const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
if (!JWT_SECRET) {
  console.error('JWT_SECRET is not set. Please set this environment variable.');
  process.exit(1);
}
app.use(cors());
app.use(express.json());

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

// Registration endpoint
app.post('/register', async (req, res) => {
  console.log(req.body)
  try {
    const { username, password, name, rank, isApprover } = req.body;

    const existingUser = await knex('users').where({ username }).first();
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userId = await knex('users').insert({
      username,
      password: hashedPassword,
      name,
      rank,
      isApprover: isApprover || false
    });

    res.status(201).json({ message: 'User registered successfully', userId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await knex('users').where({ username }).first();
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, isApprover: user.isApprover },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        rank: user.rank,
        isApprover: user.isApprover
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Get all events
// app.get('/events', verifyToken, async (req, res) => {
//   try {
//     const events = await knex('events').select('*');
//     res.json(events);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error fetching events' });
//   }
// });

// Create a new event
// app.post('/events', verifyToken, async (req, res) => {
//   try {
//     const { name, startTime, endTime, startDate, endDate, description, type } = req.body;
//     const [eventId] = await knex('events').insert({
//       name,
//       startTime,
//       endTime,
//       startDate,
//       endDate,
//       description,
//       type,
//       approved: false // Default to not approved
//     });
//     res.status(201).json({ message: 'Event created successfully', eventId });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error creating event' });
//   }
// });

// // Approve an event (only for users with isApprover = true)
// app.put('/events/:id/approve', verifyToken, async (req, res) => {
//   if (!req.user.isApprover) {
//     return res.status(403).json({ message: 'Not authorized to approve events' });
//   }

  // try {
  //   const { id } = req.params;
  //   await knex('events').where({ id }).update({ approved: true });
  //   res.json({ message: 'Event approved successfully' });
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).json({ message: 'Error approving event' });
  //   }
  // })

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
app.get("/events", async ( req, res ) => {
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
    let responseData = []
    let eventData = await knex('events')
      .select('*')
      .where({ id: id })
      .catch((err) => {
        console.log(err);
        res.status(301).send("Error retrieving single event");
      })

    responseData.push(...eventData) // needs update, approver is currently showing users id from positions?
    let approverData = await knex("events_users")
      .join('users', 'events_users.approver_id', '=', 'users.id')
      .select('approver_id as id', 'name', 'rank')
      .where({
        'events_users.events_id': id,
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

app.get('/events/requests', (req,res) => {
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

//======================================POSITIONS CRUD===========================================\\
//------------------READ (all and by id)-------------------\\
app.get("/positions*", ( req, res ) => {
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
    .where({ events_id: id })
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
    //this call should be able to get the event information for all events that a user is an approver of
    //this functions uses the query approver (this is a user id)
  } else if (approver){
      await knex("events_users")
        .join('events', 'events_users.events_id', '=', 'events.id')
        .join('users', 'events_users.users_id', '=', 'users.id')
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
        //this call should be able to get the event information for a specific event by event id
        //this functions uses the query event
  } else if (event) {
      await knex('events_users')
      .join('events', 'events_users.events_id', '=', 'events.id')
      .join('users', 'events_users.users_id', '=', 'users.id')
      .select('*')
      .where('events_id', event)
      .then((data) => {
        if (data.length !== 0) {
          res.status(200).send(data);
        } else {
          res.status(404).send("No event data found")
        }
      })
      .catch((err) => {
        console.error('Error executing query:', err);
        res.status(500).send(`Error retrieving event data: ${err}`);
      });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})