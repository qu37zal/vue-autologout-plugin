/* eslint-disable no-console */
const defaultAwesomeFunction = require('../lib').default;
const { awesomeFunction } = require('../lib');

const defaultVal = defaultAwesomeFunction('qu37zal');
const val = awesomeFunction();

// defaultVal === 'I am the Default Awesome Function, fellow comrade! - qu37zal'
console.log(defaultVal);
// val === 'I am just an Awesome Function'
console.log(val);
