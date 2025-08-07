import { Request, Response } from 'express';
import { invokeAgent } from '../services/agent.service';
import { prisma } from '../lib/prisma'; // Import our prisma client

export async function startNewScan(req: Request, res: Response) {
  // 1. Get the URL from the request body.
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // For now, we are creating a dummy project to link the scan to.
    // Later, this will come from the authenticated user.
    const project = await prisma.project.create({
      data: {
        name: url,
        url: url,
      }
    });

    // 2. Call our agent service to run the Python script.
    console.log(`Invoking scanner_agent.py for ${url}`);
    const scanResult = await invokeAgent('scanner_agent.py', [url]);
    console.log('Agent finished, result:', scanResult);
    
    // 3. Save the results to the database using Prisma.
    const savedScan = await prisma.scan.create({
      data: {
        projectId: project.id, // Link the scan to the project
        status: 'COMPLETED',
        results: scanResult, // The JSON from the python script
      },
    });

    // 4. Send a success response.
    res.status(201).json({ message: 'Scan completed successfully', data: savedScan });

  } catch (error) {
    console.error('Error during scan process:', error);
    res.status(500).json({ error: 'An error occurred during the scan.' });
  }
}