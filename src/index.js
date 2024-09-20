require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes.js');
const leadRoutes = require('./routes/leadRoutes.js');
const picRoutes = require('./routes/picRoutes.js');
const statusRoutes = require('./routes/statusRoutes.js');

const app = express();

app.use(express.json());
app.use(cookieParser());
// Middleware 
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));


// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/lead', leadRoutes);
app.use('/api/v1/pic', picRoutes);
app.use('/api/v1/status', statusRoutes);

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;
// Domain Response
app.get('/', (req, res) => {
  res.status(200).send(`<h1>Server running on port ${JWT_SECRET}</h1>`);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
