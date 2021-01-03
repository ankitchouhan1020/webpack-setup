// external dependencies
const prompts = require('prompts');
const program = require('commander');
const didYouMean = require('didyoumean');

// internal modules
const path = require('path');
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

// helper functions
const {
    getPresetMerge,
    getCommonWebpackConfig,
    getEmptyExportFunc
} = require('../static/fileContent.js');
const { data: pluginsList } = require('../static/plugins.json');
const color = require('./colors.js');

// Helper functions [START]
console.error = function (message) {
    console.log(color.boldRed(">>> ") + message);
};

console.warn = function (message) {
    console.log(color.boldYellow(">>> ") + message);
}

function throwCreateIssueError(err) {
    console.error("If you think it is my fault please create issue at https://github.com/ankitchouhan1020/webpack-setup with below log");
    console.log(color.boldRed("Err:"));
    console.log(err);
}

const suggestCommands = (cmd) => {
    const suggestion = didYouMean(cmd, program.commands.map(cmd => cmd._name));
    if (suggestion) {
        console.log();
        console.log(`Did you mean ${suggestion}?`);
    }
};

const onCancel = () => {
    console.error("See ya ('__') /");
    process.exit();
    return false;
}


const suggestPluginChoices = (input, choices) => {
    return Promise.resolve(
        choices.filter(choice =>
            choice.title.toLowerCase().includes(input.toLowerCase())
        )
    )
}

const selectPlugin = async () => {
    let selectedPlugin;

    // Ask which plugin user wants to install
    const questions = [
        {
            type: 'autocomplete',
            message: 'Select plugin to install :',
            name: 'selectedPlugin',
            choices: pluginsList,
            limit: 40,
            suggest: suggestPluginChoices,
        }
    ];
    ({ selectedPlugin } = await prompts(questions, { onCancel }));
    return selectedPlugin;
}

const installPlugin = async (pluginName) => {
    checkRequiredConfiguration();

    const file = pluginsList.find(plugin => plugin.title === pluginName);

    const fileDependencies = file.dependencies.join(" ");
    const fileDevDependencies = file.devDependencies.join(" ");

    // npm install <dependencies>
    npmInstallPkg(fileDependencies);
    npmInstallPkg(fileDevDependencies, /*isDevDependency*/ true);

    createPluginFile(file);
}

const createPluginFile = (file) => {
    const currentDir = process.cwd();
    const presetsDir = path.join(currentDir, 'build_utils', 'presets');

    const filePath = path.join(presetsDir, `webpack.${file.title}.js`);
    const fileContent = file.content.join("\n");
    fs.writeFileSync(filePath, fileContent, 'utf-8');
}


const checkRequiredConfiguration = () => {
    console.log(`${color.boldGreen(">>>")} Checking required configuration${color.green("...")}`);

    const currentDir = process.cwd();
    const buildUtilsDir = path.join(currentDir, 'build_utils');
    if (!fs.existsSync(buildUtilsDir)) {
        createInitialConfiguation();
    } else {
        console.log(`${color.boldGreen(">>>")} Found required configuration ${color.boldGreen("✔")}`);
    }
}

const createInitialConfiguation = () => {
    console.log(`${color.boldGreen(">>>")} Initializing webpack configuation${color.green("...")}`);

    const currentDir = process.cwd();

    const buildUtilsDir = path.join(currentDir, 'build_utils');
    if (!fs.existsSync(buildUtilsDir)) {
        fs.mkdirSync(buildUtilsDir);
    }

    const presetsDir = path.join(buildUtilsDir, 'presets');
    if (!fs.existsSync(presetsDir)) {
        fs.mkdirSync(presetsDir);
    }

    // loadPresets.js file merge all plugin files to common configuration
    const loadPresetsPath = path.join(buildUtilsDir, 'loadPresets.js');
    const loadPresetsfileContent = getPresetMerge();
    fs.writeFileSync(loadPresetsPath, loadPresetsfileContent, 'utf-8');
    npmInstallPkg("webpack-merge");


    createWebpackConfigFile('development');
    createWebpackConfigFile('production');
    createWebpackConfigFile('common', getCommonWebpackConfig());
}


const createWebpackConfigFile = (type = "common", fileContent = getEmptyExportFunc()) => {
    const currentDir = process.cwd();
    let filePath;

    if (type === "common") {
        filePath = path.join(currentDir, 'webpack.config.js');
    } else {
        filePath = path.join(currentDir, 'build_utils', `webpack.${type}.js`);
    }

    fs.writeFileSync(filePath, fileContent, 'utf-8');
}


const npmInstallPkg = async (pkgs, isDevDependency) => {
    if (!pkgs.trim()) {
        return;
    }

    let command, stderr;
    if (isDevDependency) {
        command = `npm install -D ${pkgs}`;
    } else {
        command = `npm install ${pkgs}`;
    }

    console.log(`${color.boldGreen(">>>")} Running ${command}${color.green("...")}`);

    ({ stderr } = await exec(command));
    if (stderr) {
        console.error(`Unable to install ${pkgs.replace(" ", ",")}`, stderr);
    }
}


const camelize = (text) => {
    return text.substr(0, 1).toLowerCase() + text.substr(1);
}

// Helper funcitions [END]

module.exports = {
    throwCreateIssueError,
    suggestCommands,
    onCancel,
    selectPlugin,
    installPlugin
}
