'use strict';

const appcmd = process.env["windir"] + "\\system32\\inetsrv\\appcmd.exe";
const exec = require('child_process').execSync;

function install(config) {
    console.log('Installing...');

    let site = 'add site /name:' + config.name + ' /bindings:' + config.protocol + '://' + config.host + ':' + config.port + ' /physicalpath:"' + config.physicalPath + '"'
    exec(appcmd + ' ' + site);

    if (config.appPool) {
        let apppool = 'add apppool /name:' + (config.appPool.name || config.name);

        if (config.appPool.runtime) {
            apppool += ' /managedRuntimeVersion:v' + config.appPool.runtime + '';
        }
        
        //defaults to integrated, so no need if not setting to classic
        if (config.appPool.pipeline && (config.appPool.pipeline.toLowerCase() === 'classic' )) {
            apppool += ' /managedPipelineMode:Classic';
        }
        
        if (config.appPool.processModel && config.appPool.processModel.identity)
        {
            let appPoolIdentity = config.appPool.processModel.identity;
            
            if (typeof (appPoolIdentity) === 'string')
            {
                apppool += ' /processModel.identityType:' + appPoolIdentity;
            }
            else if (typeof (appPoolIdentity) === 'object')
            {
                apppool += ' /processModel.identityType:SpecificUser';
                apppool += ' /processModel.userName:' + appPoolIdentity.username;
                apppool += ' /processModel.password:' + appPoolIdentity.password;
            }
        }
        
        exec(appcmd + ' ' + apppool);

        let setpool = 'set app "' + config.name + '/" /applicationpool:' + (config.appPool.name || config.name) + '';
        exec(appcmd + ' ' + setpool);
    }

    if (config.subsites) {
        handleSubSites(config.name, null, config.subsites);
    }

    console.log('Finished');
}

function handleSubSites(name, path, subsites) {
    if (typeof (subsites) === 'object') { let temp = subsites; subsites = []; subsites.push(temp); } // i would like to change this

    subsites.forEach((site) => {
        let _path = (path || '') + '/' + site.name;
        let setpool = 'add ' + site.type + ' /app.name:"' + name + '/" /path:' + _path + ' /physicalPath:"' + site.physicalPath + '"';
        exec(appcmd + ' ' + setpool);

        if (site.subsites) {
            handleSubSites(name, _path, site.subsites);
        }
    });
}

function uninstall(config) {
    console.log('Uninstalling...');

    let removeSite = 'delete site "' + config.name + '"';
    exec(appcmd + ' ' + removeSite);

    if (config.appPool) {
        let removeAppPool = 'delete apppool "' + (config.appPool.name || config.name) + '"';
        exec(appcmd + ' ' + removeAppPool);
    }

    console.log('Finished');
}

function exists(config) {
    try {
        let cmd = 'list site "' + config.name + '"';
        let results = exec(appcmd + ' ' + cmd) || '';
        return true;
    }
    catch (e) {
        return false;
    }
}

exports.exists = exists;
exports.install = install;
exports.uninstall = uninstall;