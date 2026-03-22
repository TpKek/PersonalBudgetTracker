import 'dotenv/config' // Import dotenv
import express from 'express';
import pool from './db/pool.js';
import transactionRoutes from './routes/transactions.js';
import logger from './middleware/logger.js';
// import authenticate from './middleware/authenticate.js';
import authRoutes from './routes/auth.js'

const app = express(); // create express app
const port = process.env.PORT; // specify port
app.use(express.json()); // use json middleware
app.use(logger);
app.use('/transactions', transactionRoutes);
app.use('/auth', authRoutes);

// define a route handler for the default home page
app.get('/', (req, res) => {
  res.send('Hello world!');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
