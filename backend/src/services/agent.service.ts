import childProcess from 'node:child_process'; 
const { spawn, exec, fork } = childProcess;


export  async function invokeAgent(agentName:string,args :string[]):Promise<string> {
    return new Promise ((resolve , reject)=>{
        const pythonProcess = spawn('python3', [agentName, ...args]);

        let stdout = '';
        let stderr = '';
    
        pythonProcess.stdout.on('data', (data) => {
            // capture JSON output from the script
          stdout += data.toString();
        });
    
        pythonProcess.stderr.on('data', (data) => {
            // capture error message
          stderr += data.toString();
        });
    
        pythonProcess.on('close', (code) => {
          if (code === 0) {
            resolve(stdout.trim());
          } else {
            reject(new Error(`Agent exited with code ${code}: ${stderr.trim()}`));
          }
        });
    
        pythonProcess.on('error', (err) => {
          reject(err);
        });


    });

    
}