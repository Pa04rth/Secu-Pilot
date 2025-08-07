import { invokeAgent } from "../services/agent.service"
import { prisma } from "../services/db.service"
import { Request, Response } from 'express';

export async function startNewScan(req: Request, res: Response){
    try {
        const {targetUrl} =req.body;
        // Basic validation
        if (!targetUrl || typeof targetUrl !== 'string') {
            return res.status(400).json({ message: 'Invalid or missing targetUrl' });
        }
    
        // Call the agent
        const agentResult = await invokeAgent('scanner_agent.py', [targetUrl]);
        const scanEntry = await prisma.scan.create({
            data: {
              targetUrl,
              result: agentResult,
            },
        });
        return res.status(201).json({
            message: 'Scan completed',
            data: scanEntry,
        });
      


    } catch (error) {
        console.error('Scan failed:', error);
        return res.status(500).json({
        message: 'Internal Server Error',
        error: error instanceof Error ? error.message : String(error),
        });
        
    }
 
  
}


