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
        this.initBind()
        exector(this.resolve, this.reject)
    }
    initData() {
        this.promiseResult = ''
        this.promiseStatus = 'pending'
    }
    initBind () {
        // 初始化this
        this.resolve = this.resolve.bind(this)
        this.reject = this.reject.bind(this)
    }
    resolve(data) {
        if (this.promiseStatus === 'pending') {
            this.promiseStatus = 'resolve'
            this.promiseResult = data
        }
    }
    reject(data) {
        if (this.promiseStatus === 'pending') {
            this.promiseStatus = 'reject'
            this.promiseResult = data
        }
    }
    then(callback) {
        callback(this.promiseResult)
    }
    catch(callback) {
        callback(this.promiseResult)
    }
    
}

const p = new MyPromise((resolve, reject) => {
    console.log('promise-start')
    // resolve('asdasd')
    reject('xxx')
})
p.then((res) => {
    console.log('res>>>', res)
})