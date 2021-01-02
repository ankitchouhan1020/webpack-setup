#!/usr/bin/env node
const { Command } = require('commander');
const { suggestCommands } = require('../lib/helper');
const action = require('../lib/action');

const program = new Command();
program.version(require('../package.json').version);

// Commands
program
    .command('init [projectName]')
    .alias('i')
    .description("Initialize the webpack configuaration")
    .action(action.initWebpack);

program
    .command('add plugin')
    .alias('ap')
    .description("Add and install official webpack plugins")
    .action(action.addPlugin);

program
    .command('open [projectName]')
    .alias('o')
    .description("Open one of your saved projects")
    .action(action.openProject);

program
    .command('add [projectDirectory]')
    .alias('save')
    .option('-u, --url [link]', 'Add a link to a repository to projects')
    .description("Save current directory as a project")
    .action(action.addProject);

program
    .command('remove [projectName]')
    .description("Remove the project")
    .action(action.removeProject);

program
    .command('seteditor [commandToOpen]')
    .description("Set text editor to use")
    .option('-f|--for-project [projectName]', 'set different editor for specific project')
    .action(action.setEditor);

program
    .command('rmeditor [projectName]')
    .description("Remove text editor to use")
    .option('-a|--all', 'remove editors from all projects')
    .action(action.rmEditor);

program
    .command('edit')
    .description("Edit settings.json")
    .action(action.editConfigurations);

program
    .command('getpath [projectName]')
    .alias('gp')
    .description("Get project path")
    .action(action.getProjectPath);

program
    .arguments("<command>")
    .action((command) => {
        console.log(`Command ${command} not found\n`);
        program.outputHelp();
        suggestCommands(command);
    });

program.usage("<command>")


if (process.argv.length <= 2) { // If no command mentioned then output help
    action.initWebpack();
}

// Parse arguments
program.parse(process.argv);
