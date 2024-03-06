/*
 * @Author: 佚心
 * @Date: 2024-03-02 20:43:23
 * @Description: 
 */
// a.js
console.log('a starting');
exports.done = false;
const b = require('./b.js');
console.log('in a, b.done = %j', b.done);
exports.done = true;
console.log('a done');