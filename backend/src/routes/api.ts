// File: backend/src/routes/api.ts
// Purpose: To define all API routes for the application.

import { Router } from 'express';
import { startNewScan } from '../controllers/scan.controller';

const router = Router();

// Define the endpoint: POST /api/scan will trigger a new scan.
router.post('/scan', startNewScan);

export default router;