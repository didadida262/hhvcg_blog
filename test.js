const data = [1,2,3,4]
for (let key in data) {
  let val = data[key]
  Object.defineProperty(data, key, {
      enumerable: true,
      get() {
          console.log('搜集以来')
          return val
      },
      set(newVal) {
          console.log('触发以来')
          val = newVal
      }
  })
}
const oldProto = Array.prototype
const newProto = Object.create(Array.prototype)

;['push', 'pop'].forEach(method => {
  newProto[method] = function(...args) {
    console.log('gengxing')
    oldProto[method].apply(this, args)
  } 
});
data.__proto__ = newProto

data.pop()