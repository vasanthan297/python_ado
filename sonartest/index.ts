import tl = require('azure-pipelines-task-lib/task');
const tr = require('azure-pipelines-task-lib/toolrunner');
const fs = require('fs');
const path = require('path');


async  function run() {
  try {
      
       const endpointId: string | undefined = tl.getInput('ADOConnection', true);
	   console.log(endpointId)
       if (endpointId) {
            const endpointAuth: tl.EndpointAuthorization | undefined = tl.getEndpointAuthorization(endpointId, false);
            if(endpointAuth){
                const url = tl.getEndpointUrl(endpointId, false);				
				const token = endpointAuth.parameters.apitoken
               console.log(url)
			   tl.debug(`System access token: ${token}`);
              // Task succeeded
               tl.setResult(tl.TaskResult.Succeeded, 'Task completed successfully');	
	           console.log("OK DONE",token)
	           const pythonPath="/hello_world.py"
              const taskPath = path.dirname(__filename);
             console.log(`Task path: ${taskPath}`);
            fs.readdir(taskPath, (err:any, files:any) => {
            if (err) {
                console.error(err);
               return;
                }
                 console.log(`Files in task path:`);
               files.forEach((file:any) => {
               console.log(`- ${file}`);
                  });
                 });

               const toolPath = tl.which('python', true);
               const scriptPath = taskPath + pythonPath
               const toolRunner = tl.tool(toolPath);
			   
               toolRunner.arg(scriptPath);
			   toolRunner.arg(token);
               const code = await toolRunner.exec();
			   
			    if (code !== 0) {
                   tl.setResult(tl.TaskResult.Failed, 'Python script failed with error code ' + code);
                 } 
				
                } else {
                  console.error('endpointAuth object not found............')
               }
        } else {
            console.error(`Authorization for endpoint '${endpointId}' not found.`);
        }
		
	
  } catch (error) {
    // Task failed
    tl.setResult(tl.TaskResult.Failed, error.message);
  }
}

run();