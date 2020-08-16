'use strict';

const _ = require('lodash');
module.exports =  {
    isNotEmptyFor: function (name) {
        return value => {
            if (_.isEmpty(value)) return `${name} is required`;
            return true
        }
    },
    isLowerCase: function (name) {
        return value => {
            if(value !== value.toLowerCase()) return `${name} should be in lower case letters`;
            return true;
        }
    },
    isNotEmptyAndLowerCase: function (name) {
        return value => {
            const _isNotEmptyFor = this.isNotEmptyFor(name)(value);
            const _isLowerCase = this.isLowerCase(name)(value);
            if(_isNotEmptyFor !== true) return _isNotEmptyFor;
            if(_isLowerCase !== true) return _isLowerCase;
            return true;
        }
    }
};
