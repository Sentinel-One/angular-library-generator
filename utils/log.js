'use strict';

const chalk = require('chalk');
const figlet = require('figlet');

module.exports = {
    blue: function (text) {
        console.log(chalk.hex("#61AFEF").bold(text));
    },
    yellow: function (text) {
        console.log(chalk.hex("#FCE546").bold(text));
    },
    green: function (text) {
        console.log(chalk.hex('#98C379')(text));
    },
    success: function (text) {
        return chalk.hex('#1ec537').bold(text)
    },
    ascii: function (text) {
        figlet(text, {
            font: 'Alpha',
            horizontalLayout: 'default',
            verticalLayout: 'default',
            whitespaceBreak: true
        }, function (err, data) {
            if (err) {
                console.log('Something went wrong...');
                console.dir(err);
                return;
            }
            console.log(data)
        });
    }
};


