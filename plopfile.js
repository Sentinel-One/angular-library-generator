'use strict';

const log = require('./utils/log');
const validators = require('./utils/validators');
const utils = require('./utils/utils');
const actions = require('./utils/actions');
const constantValues = require('./utils/consts');

module.exports = function (plop) {
    log.blue('Hi, welcome to Angular Library Generator 🚀 \n\r');
    plop.setGenerator('genAngularLibrary', {
        description: 'Angular Library Generator',
        prompts: [
            {
                type: 'input',
                name: 'libName',
                message: 'Enter library name',
                validate: validators.isNotEmptyAndLowerCase('library name')
            },
            {
                type: 'checkbox',
                name: 'genFiles',
                message: 'Select files which be added to library',
                choices: [
                    {name: 'README.md', value: constantValues.readme, checked: true},
                    {name: 'MIT LICENSE', value: constantValues.license, checked: true},
                    {name: 'CONTRIBUTING.md', value: constantValues.contributing, checked: true},
                ]
            },
            {
                type: 'input',
                name: 'fullName',
                message: 'Enter your full name',
                default: () => utils.getDefaultUserName(),
                validate: validators.isNotEmptyFor('full name')
            },
            {
                type: 'input',
                name: 'libPrefix',
                message: 'Enter library prefix',
                default: 'ngx',
                validate: validators.isNotEmptyAndLowerCase( 'library prefix')
            },
            {
                type: 'list',
                name: 'style',
                message: 'Select style',
                choices: ['css', 'scss', 'sass', 'less', 'styl'],
                default: 'scss'
            },
            {
                type: 'list',
                name: 'createExaAppUnderProjectFolder',
                message: 'Create example application under project folder',
                choices: ['yes', 'no'],
                default: 'no'
            }
        ],
        actions: [
            async (options) => {
                log.yellow('\n\r Start generating your library. (it might take some time)');
                options.rootFolder = options.createExaAppUnderProjectFolder === 'yes' ? options.libPrefix : `${options.libPrefix}-${options.libName}`
                await actions.createAngularWorkspace(options);
                await actions.setStyle(options);
                await actions.generateAngularLibrary(options);
                await actions.generateAngularApplicationExample(options);
                await actions.installAdditionalNpmPackages(options);
                actions.addReadMeFile(options);
                actions.addLicenseFile(options);
                actions.addContributingFile(options);
                actions.addPrettierRcFile(options);
                actions.updatePackageJsonFile(options);
                actions.updateTslintFile(options);
                return log.success(`\n\r Library ${options.libName} created successfully. 💪`);
            }, options => {log.ascii(options.libName)}]
    });
};

