'use strict';

const cmd = require('node-cmd-promise');
const log = require('./log');
const utils = require('./utils');
const fileHandler = require('./file-handler');
const constantValues = require('./consts');

module.exports = {
    createAngularWorkspace: async function ({rootFolder, createExaAppUnderProjectFolder}) {
        log.green('Creating Angular Workspace');
        const createApplication = createExaAppUnderProjectFolder === 'yes' ? 'false' : 'true'
        await cmd(`ng new ${rootFolder} --create-application=${createApplication}`);
    },
    setStyle: async function ({rootFolder, style}) {
        await cmd(`
        cd ${rootFolder}
        ng config schematics.@schematics/angular:component.style ${style}`);
    },
    generateAngularLibrary: async function ({rootFolder, libName, libPrefix}) {
        log.green(`Creating Angular Library`);
        await cmd(`
        cd ${rootFolder}
        ng generate library ${libName} --prefix=${libPrefix}`);
    },
    generateAngularApplicationExample: async function ({rootFolder, libName, style, createExaAppUnderProjectFolder}) {
        if (createExaAppUnderProjectFolder === 'yes') {
            log.green(`Creating Angular application example`);
            await cmd(`
            cd ${rootFolder}
            ng generate application ${libName}-example --style=${style}`);
        }
    },
    installAdditionalNpmPackages: async function ({rootFolder}) {
        log.green(`Installing additional npm packages:  prettier, tslint-config-prettier, husky, lint-staged`);
        await cmd(`
        cd ${rootFolder}
        npm i --D --E prettier
        npm i --D tslint-config-prettier husky lint-staged`);
    },
    addReadMeFile: function ({fullName, rootFolder, libName, genFiles}) {
        if (utils.isStringValueExistInArray(genFiles, constantValues.readme)) {
            const _fullName = utils.getFullName(fullName);
            const fileName = 'README.md'
            const data = fileHandler.readTemplateFile(fileName);
            let newValue = data.replace('[year]', new Date().getFullYear());
            newValue = newValue.replace('[fullname]', _fullName);
            fileHandler.copyTemplateFileToDestination(fileName, newValue, rootFolder, libName, true)
        }
    },
    addLicenseFile: function ({fullName, rootFolder, libName, genFiles}) {
        if (utils.isStringValueExistInArray(genFiles, constantValues.license)) {
            const _fullName = utils.getFullName(fullName);
            const fileName = 'LICENSE';
            const data = fileHandler.readTemplateFile(fileName);
            let newValue = data.replace('[year]', new Date().getFullYear());
            newValue = newValue.replace('[fullname]', _fullName);
            fileHandler.copyTemplateFileToDestination(fileName, newValue, rootFolder, libName, true);
        }
    },
    addContributingFile: function ({rootFolder, libName, genFiles}) {
        if (utils.isStringValueExistInArray(genFiles, constantValues.contributing)) {
            fileHandler.copyTemplateFile('CONTRIBUTING.md', rootFolder, libName, true);
        }
    },
    addPrettierRcFile: function ({rootFolder, libName}) {
        fileHandler.copyTemplateFile('.prettierrc', rootFolder, libName, false);
    },
    updatePackageJsonFile: function ({rootFolder, libName}) {
        fileHandler.editJsonFile(`./${rootFolder}/package.json`, (jsonObject) => {
            jsonObject.scripts = {
                "ng": "ng",
                "all:build": "npm run example:build && npm run lib:build",
                "start": "ng serve --open",
                "lib:build": `ng build ${libName}`,
                "lib:lint": `ng lint ${libName} --fix`,
                "lib:publish-2-npm": `./dist/${libName} npm publish`
            };

            jsonObject.husky = {hooks: {"pre-commit": "lint-staged"}};
            jsonObject["lint-staged"] = {
                "projects/**/*.ts": [
                    "prettier --write",
                    "git add"
                ]
            };
            return jsonObject;
        });
    },
    updateTslintFile: function ({rootFolder}) {
        fileHandler.editJsonFile(`./${rootFolder}/tslint.json`, (jsonObject) => {
            if (Array.isArray(jsonObject.extends)) {
                jsonObject.extends = [...jsonObject.extends];
            } else {
                jsonObject.extends = [jsonObject.extends];
            }
            jsonObject.extends.push("tslint-config-prettier");
            return jsonObject;
        });
    }
};
