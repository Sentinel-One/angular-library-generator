'use strict';

const fs = require('fs');
const log = require('./log');

module.exports = {
    readTemplateFile: function (fileName) {
        return fs.readFileSync(`${__dirname}/../template-files/${fileName}`, 'utf-8');
    },
    copyTemplateFileToDestination: function (fileName, data, rootFolder, libName, copyToLib) {
        fs.writeFileSync(`./${rootFolder}/${fileName}`, data, 'utf-8');
        if (copyToLib) {
            fs.writeFileSync(`./${rootFolder}/projects/${libName}/${fileName}`, data, 'utf-8');
        }
        log.green(`Adding ${fileName}\` file.`);
    },
    copyTemplateFile: function (fileName, rootFolder, libName, copyToLib) {
        const data = this.readTemplateFile(fileName);
        this.copyTemplateFileToDestination(fileName, data, rootFolder, libName, copyToLib);
    },
    editJsonFile: function (pathToFile, cb) {
        let jsonObject = JSON.parse(fs.readFileSync(pathToFile, 'utf8'));
        jsonObject = cb(jsonObject);
        fs.writeFileSync(pathToFile, JSON.stringify(jsonObject, null, 2));
    }
};
