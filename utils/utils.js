'use strict';

module.exports = {
    getDefaultUserName: function () {
        const username = require('child_process').execSync('whoami', {encoding: 'utf-8'});
        return String(username).trim();
    },
    getFullName: function (fullName) {
        return fullName.toLowerCase()
            .split(' ')
            .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(' ');
    },
    isStringValueExistInArray(arr, value) {
        return arr.indexOf(value) > -1;
    }
};
