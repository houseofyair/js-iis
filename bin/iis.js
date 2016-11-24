#! /usr/bin/env node
'use strict'

const fs = require('fs');
const _ = require('lodash');
const Liftoff = require('liftoff');
const argv = require('minimist')(process.argv.slice(2));

const modulePackage = require('../package');
const command = require('../lib/command');

// params
var version = argv.v || argv.version;
var task = argv._[0]; // just grab the first item

let cli = new Liftoff({
    name: 'iis',
    configName: '.iisconfig',
    extensions: {
        'rc': null
    }
});

let configDefaults = {
    protocol: 'http',
    host: '*',
    port: '80'
};

cli.launch({}, (env) => {
    if (version) {
        console.log('CLI version', modulePackage.version);
        process.exit(0);
    }

    if (!env.configPath) {
        console.warn('Warning: IIS Config file not found');
        process.exit(1);
    }

    let config = JSON.parse(fs.readFileSync(env.configPath));

    if (!config && (!config.name || !config.physicalPath)) {
        console.warn('Warning: IIS Config missing key properties (name, physicalPath)');
        process.exit(1);
    }

    // map default values to config file 
    config = _.assign(configDefaults, config);

    if (task === 'install') {
        if (command.exists(config)) {
            console.warn('Warning: This site already exists')
            process.exit(1);
        }
        
        command.install(config);
    }
    else if (task === 'uninstall') {
        if (!command.exists(config)) {
            console.warn('Warning: This site doesnt exist')
            process.exit(1);
        }        
        
        command.uninstall(config);
    }
});