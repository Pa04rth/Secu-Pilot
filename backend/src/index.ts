// File: backend/src/index.ts
// Purpose: The main entry point for the backend server.

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/api'; // Import our new router

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Standard middleware
app.use(cors());
app.use(express.json());

// Mount the API router under the /api path.
// All routes defined in api.ts will now be accessible under /api/...
app.use('/api', apiRouter);

app.get('/', (req, res) => {
  res.send('SecuPilot.AI Backend is running!');
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});