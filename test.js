// function Promise(fn) {
//     var value = null,
//         callbacks = [];  //callbacks为数组，因为可能同时有很多个回调

//     this.then = function (onFulfilled) {
//         callbacks.push(onFulfilled);
//     };

//     function resolve(value) {
//         callbacks.forEach(function (callback) {
//             callback(value);
//         });
//     }

//     fn(resolve);
// }




// const p = new Promise((resolve, reject) => {
//     console.log('promise-start')
//     resolve('asdasd')
//     reject('xxx')
// })

// p.then((res) => {
//     console.log('res>>', res)
// })

// p.catch((err) => {
//     console.log('err>>', err)
// })

class MyPromise {
    constructor(exector) {
        this.initData()
        exector(this.resolve, this.reject)
    }
    initData() {
        this.res = ''
    }
    resolve(data) {
        this.res = data
    }
    then(callback) {
        callback(this.res)
    }
    catch(callback) {
        callback(this.res)
    }
    
}

const p = new MyPromise((resolve, reject) => {
    console.log('promise-start')
    resolve('asdasd')
    // reject('xxx')
})
p.then((res) => {
    console.log('res>>>', res)
})