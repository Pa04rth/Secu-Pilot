// File: backend/src/services/agent.service.ts
// Purpose: To execute Python agent scripts as child processes.

import { spawn } from 'child_process';
import path from 'path';

// A function to invoke a python agent. It's async and returns a Promise.
export function invokeAgent(agentName: string, args: string[]): Promise<any> {
  return new Promise((resolve, reject) => {
    // Construct the full path to the agent script for reliability.
    const agentPath = path.join(__dirname, '../../../agents', agentName);
    
    // Spawn the python process.
    const pythonProcess = spawn('python3', [agentPath, ...args]);

    let output = '';
    let errorOutput = '';

    // Listen for data from the script's standard output.
    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    // Listen for data from the script's standard error.
    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    // Listen for when the process closes.
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        // If the process exited with an error code, reject the promise.
        return reject(new Error(`Agent exited with code ${code}: ${errorOutput}`));
      }
      try {
        // If it was successful, parse the JSON output and resolve the promise.
        const result = JSON.parse(output);
        resolve(result);
      } catch (e) {
        reject(new Error(`Failed to parse agent output as JSON: ${output}`));
      }
    });
  });
}