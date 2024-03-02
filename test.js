/*
 * @Author: 佚心
 * @Date: 2023-12-28 15:50:04
 * @Description: 
 */
// main.js
console.log('main starting');
const a = require('./a.js');
const b = require('./b.js');
console.log('in main, a.done=%j, b.done=%j', a.done, b.done);