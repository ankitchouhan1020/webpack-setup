// internal modules
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

// helper functions
const color = require('./colors.js');

const {
    throwCreateIssueError,
    selectPlugin,
    installPlugin
} = require('./helper.js');

// Includes end.

/*
COMMAND: ws init [projectName]
ARGUMENTS: [projectName] :: Name of the project to create
*/
async function initWebpack(projectName) {
    try {
        if (projectName) {
            console.log(`${color.boldGreen(">>>")} Creating Project: ${projectName} ${color.green("✔")}`);
        }

        ({ stderr } = await exec(`mkdir ${projectName}`))
    }
    catch (err) {
        throwCreateIssueError(err);
    }
}

/* COMMAND: ws add plugin */

async function addPlugin() {
    try {
        const selectedPlugin = await selectPlugin();

        if (!selectedPlugin) {
            console.error("Currently we are not supporting this plugins. You can always add other plugins mannualy. :(");
        } else {
            console.log(`${color.boldGreen(">>>")} Installing ${selectedPlugin}${color.green("...")}`);
            await installPlugin(selectedPlugin);
            console.log(`${color.boldGreen("✔ Plugin installed successfully.")}`);
        }
    }
    catch (err) {
        throwCreateIssueError(err);
    }
}

module.exports = {
    initWebpack,
    addPlugin
}
