// backend>routes>api.ts
const express = require('express');
const router = express.Router();
import {startNewScan} from "../controllers/scan.controller"

router.post('/scan',startNewScan)
// Export the router for use in the main application file
module.exports = router;