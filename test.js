const f = function(name) {
  this.name = name
}

const o = new f('hhvcg')
console.log('o>>>>>', o)
console.log('o>>>>>1', o.prototype)
console.log('o>>>>>2', o.__proto__)


const myNew = function(...args) {
  const target = args[0]  
  const child = Object.create(target.prototype)
  target.call(child, ...args.slice(1))
  return child
}

const oo = myNew(f, 'hhvcg2')
console.log('oo>>>>>', oo)
console.log('ooo>>>>>1', oo.prototype)
console.log('ooo>>>>>2', oo.__proto__)
