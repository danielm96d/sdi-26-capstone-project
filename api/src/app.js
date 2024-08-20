require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const util = require('util')
const knex = require("knex")(require("../knexfile.js")[process.env.NODE_ENV || "development"]);
const cookieParser = require("cookie-parser");
const usersRouter = require('./routes/users')
const positionsRouter = require('./routes/positions')
const eventsRouter = require('./routes/events')
const skillsRouter = require('./routes/skills')


const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
if (!JWT_SECRET) {
  console.error('JWT_SECRET is not set. Please set this environment variable.');
  process.exit(1);
}
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

app.use(express.json());


// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.cookies.token; // Changed this line
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.', status: "error", title: "Unauthorized", invalid: true });
  }

  try {
    res.header('Access-Control-Allow-Credentials', 'true');
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.', invalid: true });
  }
};

// Registration endpoint
app.post('/register', async (req, res) => {
  console.log(req.body)
  try {
    const { username, password, firstname, lastname, rank, isApprover } = req.body;
    const name = `${firstname} ${lastname}`

    const existingUser = await knex('users').where({ username }).first();
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists', title: "Error", status: "error" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userId = await knex('users').insert({
      username,
      password: hashedPassword,
      name,
      rank,
      isApprover: isApprover
    });

    res.status(201).json({ message: 'User registered successfully', title: "Success", status: "success", userId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering user', title: 'Server Error', status: "error" });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await knex('users').where({ username }).first();
    if (!user) {
      return res.status(400).send({ message: 'Invalid username or password' });
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

    // Set the token as an HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure in production
      maxAge: 3600000 // 1 hour in milliseconds
    });
    res.json({
      message: 'Logged in successfully',
      status: "success",
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

app.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({ message: 'Logged out successfully' });
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

app.get("/", (req, res) => {
  console.log("test")// this log is used to test live updates within the docker environment
  res.send(`application running using NODE_ENV: ${process.env.NODE_ENV}`);//this line will need editing for deployment
})

app.get('/validate', verifyToken, (req, res) => {
  res.status(200).json({ message: 'User is authenticated' })
})


// ======================================USERS CRUD===========================================\\
app.use('/users', verifyToken, usersRouter)

//======================================POSITIONS CRUD===========================================\\
app.use('/positions', verifyToken, positionsRouter)

//======================================EVENTS CRUD===========================================\\
app.use('/events', verifyToken, eventsRouter)

//======================================SKILLS CRUD===========================================\\
app.use('/skills', verifyToken, skillsRouter)

//======================================USERS CRUD===========================================\\
// app.use('/users', usersRouter)

// //======================================POSITIONS CRUD===========================================\\
// app.use('/positions', positionsRouter)

// //======================================EVENTS CRUD===========================================\\
// app.use('/events', eventsRouter)

// //======================================SKILLS CRUD===========================================\\
// app.use('/skills', skillsRouter)



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})