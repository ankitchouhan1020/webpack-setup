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
    .arguments("<command>")
    .action((command) => {
        console.log(`Command ${command} not found\n`);
        program.outputHelp();
        suggestCommands(command);
    });

program.usage("<command>")


if (process.argv.length <= 2) { // If no command mentioned then output help
    action.addPlugin();
}

// Parse arguments
program.parse(process.argv);
