"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const tl = require("azure-pipelines-task-lib/task");
const tr = require('azure-pipelines-task-lib/toolrunner');
const fs = require('fs');
const path = require('path');
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const endpointId = tl.getInput('ADOConnection', true);
            console.log(endpointId);
            if (endpointId) {
                const endpointAuth = tl.getEndpointAuthorization(endpointId, false);
                if (endpointAuth) {
                    const url = tl.getEndpointUrl(endpointId, false);
                    const token = endpointAuth.parameters.apitoken;
                    console.log(url);
                    tl.debug(`System access token: ${token}`);
                    // Task succeeded
                    tl.setResult(tl.TaskResult.Succeeded, 'Task completed successfully');
                    console.log("OK DONE", token);
                    const pythonPath = "/hello_world.py";
                    const taskPath = path.dirname(__filename);
                    console.log(`Task path: ${taskPath}`);
                    fs.readdir(taskPath, (err, files) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                        console.log(`Files in task path:`);
                        files.forEach((file) => {
                            console.log(`- ${file}`);
                        });
                    });
                    const toolPath = tl.which('python', true);
                    const scriptPath = taskPath + pythonPath;
                    const toolRunner = tl.tool(toolPath);
                    toolRunner.arg(scriptPath);
                    toolRunner.arg(token);
                    const code = yield toolRunner.exec();
                    if (code !== 0) {
                        tl.setResult(tl.TaskResult.Failed, 'Python script failed with error code ' + code);
                    }
                }
                else {
                    console.error('endpointAuth object not found............');
                }
            }
            else {
                console.error(`Authorization for endpoint '${endpointId}' not found.`);
            }
        }
        catch (error) {
            // Task failed
            tl.setResult(tl.TaskResult.Failed, error.message);
        }
    });
}
run();
